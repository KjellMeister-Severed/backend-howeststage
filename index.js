require('dotenv').config()
const http = require("http");
const express = require("express");
const fileUpload = require("express-fileupload");
const colors = require('colors');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json())
app.use(fileUpload());
app.use(cors());

/*
    Error handler
*/
function errorHandler(err, req, res, next) {
    res.status(500)
    .json({error: err.message});
}

/*
    Authentication middleware
*/
const authenticateUserJWT = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1]; // Bearer token
        const userInfo = await userController.getAzureUserInfo(token);
        
        if(userInfo.error != null) return res.status(401).end("Unauthorized");

        req.userInfo = userInfo;
        next();
    } else {
        res.sendStatus(401);
    }
};

const authenticateCompanyJWT = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        try { 
            const token = authHeader.split(' ')[1]; // Bearer token
        
            const companyInfo = jwt.verify(token, process.env.JWT_KEY);

            req.companyInfo = await companyController.getCompanyById(companyInfo.companyId);
            
            next();
        } catch(err) {
            res.sendStatus(401);
        }
    } else {
        res.sendStatus(401);
    }
};

const userController = require("./controllers/user_controller");
const companyController = require("./controllers/company_controller");
const { fail } = require('assert');

/*
    API requests
*/
const router = express.Router()
app.use('/api', router)

// Get my company
router.get("/companies/me", authenticateCompanyJWT, async (req, res, next) => {
    try {
        res.status(200).json(req.companyInfo);
    } catch (err) {
        next(err);
    }
});

// Get companies
router.get("/companies", async (req, res, next) => {
    try {
        const companies = await companyController.getCompanies();
        return res.status(200).json(companies);
    } catch (err) {
        next(err);
    }

});

// Create company
router.post("/companies", authenticateUserJWT, async (req, res, next) => {
    try {
        const userId = req.userInfo.userPrincipalName;
        if(!await userController.hasRole(userId, "Administrator")) {
            return res.status(401).end("Unauthorized");
        }

        const newCompany = await companyController.addCompany(req.body);
        return res.status(200).json(newCompany);
    } catch (err) {
        next(err);
    }
});

// Import company CSV
router.post("/companies/csv", authenticateUserJWT, async (req, res, next) => {
    try {
        const userId = req.userInfo.userPrincipalName;
        if(!await userController.hasRole(userId, "Administrator")) {
            return res.status(401).end("Unauthorized");
        }

        companyController.uploadCSV(req.files.companiesCsv);
        const failedCompanies = await companyController.addCompaniesFromCSV("./companies.csv");

        res.status(200).json({ result: true, failedCompanies: failedCompanies});
    } catch (err) {
        next(err);
    }

});

// Get appointments for my company
router.get("/companies/appointments", authenticateCompanyJWT, async (req, res, next) => {
    try {
        const companyInfo = req.companyInfo;

        return res.status(200).json(await companyController.listAppointmentsForCompany(companyInfo.id));
    } catch (err) {
        next(err);
    }
});

// Get company by ID
router.get("/companies/:companyId", async (req, res, next) => {
    try {
        const companyId = req.params.companyId;

        const company = await companyController.getCompanyById(companyId);
        return res.status(200).json(company);
    } catch (err) {
        next(err);
    }

});

// Get appointments for a company
router.get("/companies/:companyId/appointments", authenticateUserJWT, async (req, res, next) => {
    try {
        const userId = req.userInfo.userPrincipalName;

        if(!await userController.hasRole(userId, "Administrator")) {
            return res.status(401).end("Unauthorized");
        }

        const companyId = req.params.companyId;
        return res.status(200).json(await companyController.listAppointmentsForCompany(companyId));
    } catch (err) {
        next(err);
    }
});

// Edit company
router.patch("/companies/:companyId", authenticateUserJWT, async (req, res, next) => {
    try {
        const userId = req.userInfo.userPrincipalName;

        if(!await userController.hasRole(userId, "Administrator")) {
            return res.status(401).end("Unauthorized");
        }

        const companyId = req.params.companyId;

        const editedCompany = await companyController.editCompany(companyId, req.body);
        return res.status(200).json(editedCompany);
    } catch (err) {
        next(err);
    }
});

// Edit my company
router.patch("/companies", authenticateCompanyJWT, async (req, res, next) => {
    try {
        const companyId = req.companyInfo.id;

        const editedCompany = await companyController.editCompany(companyId, req.body);
        return res.status(200).json(editedCompany);
    } catch (err) {
        next(err);
    }
});

// Delete company
router.delete("/companies/:companyId", authenticateUserJWT, async (req, res, next) => {
    try {
        const userId = req.userInfo.userPrincipalName;

        if(!await userController.hasRole(userId, "Administrator")) {
            return res.status(401).end("Unauthorized");
        }

        const companyId = req.params.companyId;

        const deletedCompany = await companyController.deleteCompany(companyId);

        return res.status(200).json(deletedCompany);
    } catch (err) {
        next(err);
    }

})

// Company magic link generation
router.post("/companies/:companyEmail/generatemagiclink", async (req, res, next) => {
    try {
        const companyEmail = req.params.companyEmail;
        res.status(200).json({ result: await companyController.generateMagicLink(companyEmail)});
    } catch(err){
        next(err);
    }   
});

// Company magic link sign in
app.get("/signin/:token", async (req, res, next) => {
    try{
        const token = req.params.token;
        const jwt = await companyController.signInWithToken(token);
        res.status(302).redirect(`${process.env.MAGICLINK_REDIRECT_URL}?companyToken=${jwt}`);    
    }catch(err){
        next(err);
    }    
});

// Get user info
router.get("/user", authenticateUserJWT, async (req, res, next) => {
    try{
        const user = await userController.getUserById(req.userInfo.userPrincipalName);
        return res.status(200).json(user);
    }catch(err){
        next(err);
    }
});

// Get my user appointments
router.get("/user/appointments", authenticateUserJWT, async (req, res, next) => {
    try{
        const userInfo = req.userInfo;

        const appointments = await userController.getAppointmentsForUser(userInfo.userPrincipalName);
        return res.status(200).json(appointments);
    }catch(err){
        next(err);
    }
});

// Cancel a user appointment
router.delete("/user/appointments/:appointmentBookingsId", authenticateUserJWT, async (req, res, next) => {
    try {
        const userId = req.userInfo.userPrincipalName;

        const result = await userController.cancelAppointmentForUser(userId, req.params.appointmentBookingsId);
        return res.status(200).json({ result: result });
    }catch(err){
        next(err);
    }    
});

// Download CV
router.get("/user/cv", authenticateUserJWT, (req, res, next) => {
    try{
        res.download(`./private/cv/${req.userInfo.userPrincipalName}.pdf`);
    }catch(err){
        next(err);
    }
    
});

// Upload CV
router.post("/user/cv", authenticateUserJWT ,async (req, res, next) => {
    try{
        const result = userController.uploadCV(req.userInfo.userPrincipalName, req.files.cv);
        return res.status(200).json(result);
    } catch(err){
        next(err);
    }
    
});

// Edit user
router.patch("/user", authenticateUserJWT, async (req, res, next) => {
    try{
        const editedUser = await userController.editUserById(req.userInfo.userPrincipalName, req.body);
        return res.status(200).json(editedUser);    
    }catch(err){
        next(err);
    }
});

// Get user info as company
router.get("/user/:userId", authenticateCompanyJWT, async (req, res, next) => {
    try{
        const user = await userController.getUserById(req.params.userId);
        return res.status(200).json(user);
    }catch(err){
        next(err);
    }
});

// Get a users appointments as an admin
router.get("/user/:userId/appointments", authenticateUserJWT, async (req, res, next) => {
    try{
        const userId = req.params.userId;
        const userInfo = req.userInfo;

        if(!await userController.hasRole(userId, "Administrator")) {
            return res.status(401).end("Unauthorized");
        }
        
        if(userInfo.userPrincipalName != userId) {
            throw "You do not have permission to view this user's appointments.";
        }

        const appointments = await userController.getAppointmentsForUser(userId);
        return res.status(200).json(appointments);
    }catch(err){
        next(err);
    }
});

// Cancel a user's appointment as the company
router.delete("/user/:userId/appointments/:appointmentBookingsId", authenticateCompanyJWT, async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const appointmentId = req.params.appointmentBookingsId;
        const companyId = req.companyInfo.id;

        const appointments = await companyController.listAppointmentsForCompany(companyId);
        const appointment = appointments.find(appointment => appointment.bookingsId === appointmentId);
        
        if(appointment == null) {
            return res.status(404).end();
        }

        const result = await userController.cancelAppointmentForUser(userId, appointmentId);
        return res.status(200).json({ result: result });
    }catch(err){
        next(err);
    }    
});

// Download user CV for a company
router.get("/user/:userId/cv", authenticateCompanyJWT, async (req, res, next) => {
    const userId = req.params.userId;

    try{
        res.download(`./private/cv/${userId}.pdf`);
    }catch(err){
        next(err);
    }
});

app.use(errorHandler);

const server = http.createServer(app);
const port = process.env.EXPRESS_PORT;
server.listen(port);
console.log(colors.red(`Back-end up and running on port ${port}.`));
