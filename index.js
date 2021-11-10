require('dotenv').config()
const http = require("http");
const express = require("express");
const fileUpload = require("express-fileupload");
const colors = require('colors');

const app = express();
app.use(express.json())
app.use(fileUpload());

const azureRepository = require("./repositories/azure_repository");
const userController = require("./controllers/user_controller");
const companyRepository = require("./repositories/company_repository");
const userRepository = require("./repositories/user_repository");

/*
    API requests
*/
const router = express.Router()
app.use('/api', router)

router.get("/", (req, res) => {
});

// Get companies
router.get("/companies", (req, res) => {
    companyRepository.getAllCompanies().then(companies => {
        return res.status(200).json(companies);
    })
});

// Create company
router.post("/companies", async (req, res) => {
    const newCompany = await companyRepository.addCompany(req.body);
    const bookingsBusiness = await azureRepository.addBusiness(newCompany);
    companyRepository.setBookingsId(newCompany.id, bookingsBusiness.id);
    return res.status(200).json(newCompany);
});

// Get company by ID
router.get("/companies/:companyId", (req, res) => {
    const companyId = req.params.companyId;

    companyRepository.getCompanyById(companyId).then(company => { 
        return res.status(200).json(company)
    });
})
// Edit company
router.patch("/companies/:companyId", (req, res) => {
    const companyId = req.params.companyId;

    companyRepository.editCompanyById(companyId, req.body).then(editedCompany => { 
        return res.status(200).json(editedCompany)
    });
});

// Delete company
router.delete("/companies/:companyId", (req, res) => {
    const companyId = req.params.companyId;

    companyRepository.deleteCompanyById(companyId).then(deletedCompany => { 
        return res.status(200).json(deletedCompany)
    });
})

// Edit user
router.patch("/users", (req, res) => {
    userRepository.editUserById(1, req.body).then(editedUser => {
        return res.status(200).json(editedUser);
    });
});

// Download CV
router.get("/user/cv", (req, res) => {
    res.download("./private/cv/1.pdf");
});

// Upload CV
router.post("/user/cv", (req, res) => {
    userController.uploadCV(1, req.files.cv).then(result => {
        return res.status(200).json(result);
    });
});

const server = http.createServer(app);
const port = process.env.PORT;
server.listen(port);
console.log(colors.red(`Back-end up and running on port ${port}.`));