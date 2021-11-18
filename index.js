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

const userController = require("./controllers/user_controller");
const companyController = require("./controllers/company_controller");

/*
    API requests
*/
const router = express.Router()
app.use('/api', router)

// Get my company
router.get("/companies/me", async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    res.status(200).json(await companyController.getCompanyById(decoded.companyId));
});

// Get companies
router.get("/companies", async (req, res) => {
    const companies = await companyController.getCompanies();
    return res.status(200).json(companies);
});

// Create company
router.post("/companies", async (req, res) => {
    const newCompany = await companyController.addCompany(req.body);
    return res.status(200).json(newCompany);
});

// Import company CSV
router.post("/companies/csv", async (req, res) => {
    companyController.uploadCSV(req.files.companiesCsv);
    const success = await companyController.addCompaniesFromCSV("./companies.csv");

    res.status(200).json({result: success});
});

// Get company by ID
router.get("/companies/:companyId", async (req, res) => {
    const companyId = req.params.companyId;

    const company = await companyController.getCompanyById(companyId);
    return res.status(200).json(company);
});

// Get appointments for a company
router.get("/companies/:companyId/appointments", async (req, res) => {
    const companyId = req.params.companyId;
    return res.status(200).json(await companyController.listAppointmentsForCompany(companyId));
});

// Edit company
router.patch("/companies/:companyId", async (req, res) => {
    const companyId = req.params.companyId;

    const editedCompany = await companyController.editCompany(companyId, req.body); 
    return res.status(200).json(editedCompany);
});

// Delete company
router.delete("/companies/:companyId", async (req, res) => {
    const companyId = req.params.companyId;

    const deletedCompany = await companyController.deleteCompany(companyId);

    return res.status(200).json(deletedCompany);
})

// Company magic link generation
router.get("/companies/:companyId/generatemagiclink", async (req, res) => {
    const companyId = req.params.companyId;
    res.status(200).json({result: await companyController.generateMagicLink(companyId)});
});

// Company magic link sign in
router.post("/companies/signin/:token", async (req, res) => {
    const token = req.params.token;
    const jwt = await companyController.signInWithToken(token);
    res.status(200).json(jwt);
});

// Edit user
router.patch("/user", async (req, res) => {
    const editedUser = await userController.editUserById(1, req.body);
    return res.status(200).json(editedUser);
});

// Get appointments for user
router.get("/user/:userId/appointments", async (req, res) => {
    const appointments = await userController.getAppointmentsForUser(req.params.userId);
    return res.status(200).json(appointments);
});

// Cancel a user appointment
router.post("/user/:userId/appointments/:appointmentId/cancel", async (req, res) => {
    const result = await userController.cancelAppointmentForUser(req.params.userId, req.params.appointmentId);
    return res.status(200).json({result: result});
});

// Download CV
router.get("/user/cv", (req, res) => {
    res.download("./private/cv/1.pdf");
});

// Upload CV
router.post("/user/cv", async (req, res) => {
    const result = userController.uploadCV(1, req.files.cv);
    return res.status(200).json(result);
});

const server = http.createServer(app);
const port = process.env.EXPRESS_PORT;
server.listen(port);
console.log(colors.red(`Back-end up and running on port ${port}.`));
