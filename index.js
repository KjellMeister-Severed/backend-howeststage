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
    console.log(err);
    res.status(500)
    .json({error: err});
}

const userController = require("./controllers/user_controller");
const companyController = require("./controllers/company_controller");

/*
    API requests
*/
const router = express.Router()
app.use('/api', router)

// Get my company
router.get("/companies/me", async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        res.status(200).json(await companyController.getCompanyById(decoded.companyId));
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
router.post("/companies", async (req, res, next) => {
    try {
        const newCompany = await companyController.addCompany(req.body);
        return res.status(200).json(newCompany);
    } catch (err) {
        next(err);
    }
});

// Import company CSV
router.post("/companies/csv", async (req, res, next) => {
    try {
        companyController.uploadCSV(req.files.companiesCsv);
        const success = await companyController.addCompaniesFromCSV("./companies.csv");

        res.status(200).json({ result: success });
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
router.get("/companies/:companyId/appointments", async (req, res, next) => {
    try {
        const companyId = req.params.companyId;
        return res.status(200).json(await companyController.listAppointmentsForCompany(companyId));
    } catch (err) {
        next(err);
    }

});

// Edit company
router.patch("/companies/:companyId", async (req, res, next) => {
    try {
        const companyId = req.params.companyId;

        const editedCompany = await companyController.editCompany(companyId, req.body);
        return res.status(200).json(editedCompany);
    } catch (err) {
        next(err);
    }

});

// Delete company
router.delete("/companies/:companyId", async (req, res, next) => {
    try {
        const companyId = req.params.companyId;

        const deletedCompany = await companyController.deleteCompany(companyId);

        return res.status(200).json(deletedCompany);
    } catch (err) {
        next(err);
    }

})

// Company magic link generation
router.post("/companies/:companyId/generatemagiclink", async (req, res, next) => {
    try{
        const companyId = req.params.companyId;
        res.status(200).json({ result: await companyController.generateMagicLink(companyId) });
    }catch(err){
        next(err);
    }   
});

// Company magic link sign in
app.get("/signin/:token", async (req, res, next) => {
    try{
        const token = req.params.token;
        const jwt = await companyController.signInWithToken(token);
        res.status(302).redirect(`${process.env.MAGICLINK_REDIRECT_URL}?token=${jwt}`);    
    }catch(err){
        next(err);
    }    
});

// Edit user
router.patch("/user", async (req, res, next) => {
    try{
        const editedUser = await userController.editUserById(1, req.body);
        return res.status(200).json(editedUser);    
    }catch(err){
        next(err);
    }
    
});

// Get appointments for user
router.get("/user/:userId/appointments", async (req, res, next) => {
    try{
        const appointments = await userController.getAppointmentsForUser(req.params.userId);
        return res.status(200).json(appointments);
    }catch(err){
        next(err);
    }
    
});

// Cancel a user appointment
router.post("/user/:userId/appointments/:appointmentId/cancel", async (req, res, next) => {
    try{
        const result = await userController.cancelAppointmentForUser(req.params.userId, req.params.appointmentId);
        return res.status(200).json({ result: result });
    }catch(err){
        next(err);
    }    
});

// Download CV
router.get("/user/cv", (req, res, next) => {
    try{
        res.download("./private/cv/1.pdf");
    }catch(err){
        next(err);
    }
    
});

// Upload CV
router.post("/user/cv", async (req, res, next) => {
    try{
        const result = userController.uploadCV(1, req.files.cv);
        return res.status(200).json(result);
    } catch(err){
        next(err);
    }
    
});

app.use(errorHandler);

const server = http.createServer(app);
const port = process.env.EXPRESS_PORT;
server.listen(port);
console.log(colors.red(`Back-end up and running on port ${port}.`));
