const fs = require('fs');
const path = require("path");
const csv = require('csv-parser');
const stripBom = require('strip-bom-stream');
const jwt = require('jsonwebtoken');


const companyRepository = require("../repositories/company_repository");
const azureRepository = require("../repositories/azure_repository");
const mailService = require("../services/mail_service");

async function getCompanies() {
  let companies = await companyRepository.getAllCompanies();

  companies.forEach(company => {
    company.bookingsUrl = process.env.BOOKINGS_URL;
  });

  return companies;
}

async function getCompanyById(companyId) {
    const company = await companyRepository.getCompanyById(companyId);
    company.bookingsUrl = process.env.BOOKINGS_URL;
    return company;
}

async function listAppointmentsForCompany(companyId) {
  const company = await getCompanyById(companyId);
  return await azureRepository.listAppointmentsForCompany(company.bookingsid);
}

async function addCompany(companyObject) {
  if(await companyRepository.getCompanyByName(companyObject.name)) {
    return Promise.reject(new Error("There is already a company with this name."));
  }

  if(await companyRepository.getCompanyByEmail(companyObject.email)) {
    return Promise.reject(new Error("There is already a company with this email."));
  }
  const newCompany = await companyRepository.addCompany(companyObject);
  const employee = await azureRepository.addEmployee(newCompany);
  await companyRepository.setBookingsId(newCompany.id, employee.id);
  return newCompany;
}

async function editCompany(companyId, companyObject) {
  return await companyRepository.editCompanyById(companyId, companyObject); 
}

async function deleteCompany(companyId) {
  const deletedCompany = await companyRepository.deleteCompanyById(companyId);
  await azureRepository.deleteEmployee(deletedCompany.bookingsid);

  return deleteCompany;
}

async function generateMagicLink(companyEmail) {
  const company = await companyRepository.getCompanyByEmail(companyEmail);
  const generatedToken = generateToken();

  await companyRepository.deleteOldMagicLinksForCompany(company.id);
  await companyRepository.addMagicLinkToken(generatedToken, company.id);
  
  await mailService.sendMail(company.email, "Link for your Howest Internship Platform account",
  `
  Hi there
  
  Here is the link to login to your accounts on our platform: http://${process.env.EXPRESS_ENDPOINT}:${process.env.EXPRESS_PORT}/signin/${generatedToken}
  
  Kind regards
  Howest University of Applied Sciences
  `);

  return true;
}

async function signInWithToken(token) {
  const magicLink = await companyRepository.getMagicLink(token);
  await companyRepository.deleteOldMagicLinksForCompany(magicLink.companyId);
  return jwt.sign({companyId: magicLink.companyId}, process.env.JWT_KEY, {
    expiresIn: "1d"
  });
}


function uploadCSV(file) {
  if(!file) {
    throw "File not found.";
  }

  const extension = path.extname(file.name).toLowerCase();
  if(extension != ".csv") {
      throw "The file needs to be CSV file.";
  }

  file.mv(`./companies.csv`);
  return true;
}

function addCompaniesFromCSV(csvFileUrl) {
  return new Promise((resolve) => {
    const companies = [];

      fs.createReadStream(csvFileUrl)
      .pipe(stripBom())
      .pipe(csv({ separator: ';' }))
      .on('data', (row) => {
        companies.push(row);
      })
      .on('end', () => {
          let counter = 0; // used for the delay between imports
          let progress = 0;

          companies.forEach(company => {
            setTimeout(async () => {
              await addCompany({
                name: company.name,
                email: `employee${progress}@howest.be`,
                phonenumber: company.phone_number,
                address: company.address,
                postalcode: company.postalcode,
                city: company.city,
                website: company.website,
                description: company.description,
                lookingfor: company.looking_for,
              });

              progress++;
              if(progress == companies.length) {
                resolve(true);
              }
            }, 2000 * counter);
            counter++;
        });
      });
  });
}

function generateToken() {
  const epochSeconds = Date.now()
  const randomString = Math.random().toString(36).substr(2);
  return epochSeconds + randomString;
}

module.exports = { getCompanies, getCompanyById, addCompany, editCompany, deleteCompany, 
  uploadCSV, addCompaniesFromCSV, listAppointmentsForCompany, generateMagicLink, signInWithToken };