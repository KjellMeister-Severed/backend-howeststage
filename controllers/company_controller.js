const fs = require('fs');
const path = require("path");
const csv = require('csv-parser');
const stripBom = require('strip-bom-stream');

const companyRepository = require("../repositories/company_repository");
const azureRepository = require("../repositories/azure_repository");

async function getCompanies() {
  return await companyRepository.getAllCompanies();
}

async function getCompanyById(companyId) {
  return await companyRepository.getCompanyById(companyId);
}

async function listAppointmentsForCompany(companyId) {
  const company = await getCompanyById(companyId);
  return await azureRepository.listAppointmentsForCompany(company.bookingsid);
}

async function addCompany(companyObject) {
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

module.exports = { getCompanies, getCompanyById, addCompany, editCompany, deleteCompany, 
  uploadCSV, addCompaniesFromCSV, listAppointmentsForCompany };