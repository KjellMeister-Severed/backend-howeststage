require('dotenv').config()
const http = require("http");
const express = require("express");
const fileUpload = require("express-fileupload");
const colors = require('colors');

const app = express();
app.use(express.json())
app.use(fileUpload());

const azureRepository = require("./repositories/azure_repository");
const companyRepository = require("./repositories/company_repository");
const userRepository = require("./repositories/user_repository");

const userController = require("./controllers/user_controller");
const companyController = require("./controllers/company_controller");

/*
    API requests
*/
const router = express.Router()
app.use('/api', router)

router.get("/", (req, res) => {
});

// Get companies
router.get("/companies", async (req, res) => {
    const companies = await companyRepository.getAllCompanies();
    return res.status(200).json(companies);
});

// Create company
router.post("/companies", async (req, res) => {
    const newCompany = await companyRepository.addCompany(req.body);
    const employee = await azureRepository.addEmployee(newCompany);
    companyRepository.setBookingsId(newCompany.id, employee.id);
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

    const company = await companyRepository.getCompanyById(companyId);
    return res.status(200).json(company);
});

// Edit company
router.patch("/companies/:companyId", async (req, res) => {
    const companyId = req.params.companyId;

    const editedCompany = await companyRepository.editCompanyById(companyId, req.body); 
    return res.status(200).json(editedCompany);
});

// Delete company
router.delete("/companies/:companyId", async (req, res) => {
    const companyId = req.params.companyId;

    const deletedCompany = await companyRepository.deleteCompanyById(companyId);
    await azureRepository.deleteEmployee(deletedCompany.bookingsid);

    return res.status(200).json(deletedCompany);
})

// Edit user
router.patch("/users", async (req, res) => {
    const editedUser = await userRepository.editUserById(1, req.body);
    return res.status(200).json(editedUser);
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
const port = process.env.PORT;
server.listen(port);
console.log(colors.red(`Back-end up and running on port ${port}.`));