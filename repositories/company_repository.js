const database = require("../services/database");
const azureRepository = require("../repositories/azure_repository");

async function getAllCompanies() {
    return new Promise((resolve) => {
        database.executeQuery((connection) => {
            connection.query(`SELECT id, name, email, phone_number, address, postal_code, city, website, description, looking_for, bookings_id 
            FROM companies`, function (err, result) {
                if (err) throw err;
                resolve(result.map(rowToCompany));
            });
        });
    });
}

async function getCompanyById(id) {
    return new Promise((resolve) => {
        database.executeQuery((connection) => {
            connection.query(`SELECT id, name, email, phone_number, address, postal_code, city, website, description, looking_for, bookings_id
            FROM companies WHERE id = ?`,
            id,
            function (err, result) {
                if (err) throw err;

                if(result.length == 0) {
                    throw `Company with id ${id} not found.`;
                }

                resolve(rowToCompany(result[0]));
            });
        });
    });
}

async function addCompany(company) {
    return new Promise((resolve) => {
        database.executeQuery((connection) => {
            connection.query(`INSERT INTO companies (name, email, phone_number, address, postal_code, city, website,
                description, looking_for) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [company.name, company.email, company.phonenumber, company.address, company.postalcode, company.city, company.website,
            company.description, company.lookingfor],
            async function (err, result) {
                if (err) throw err;

                const addedCompany = await getCompanyById(result.insertId);
                resolve(addedCompany);
            });
        });
    });
}

// Fill up the edit properties that are null with the current properties
function fillEmptyEditProperties(editCompany, currentCompany) {
    editCompany.name =  editCompany.name ? editCompany.name : currentCompany.name;
    editCompany.email = editCompany.email ? editCompany.email : currentCompany.email;
    editCompany.phonenumber = editCompany.phonenumber ? editCompany.phonenumber : currentCompany.phonenumber;
    editCompany.address = editCompany.address ? editCompany.address : currentCompany.address;
    editCompany.postalcode = editCompany.postalcode ? editCompany.postalcode : currentCompany.postalcode;
    editCompany.city =  editCompany.city ? editCompany.city : currentCompany.city;
    editCompany.website = editCompany.website ? editCompany.website : currentCompany.website;
    editCompany.description =  editCompany.description ? editCompany.description : currentCompany.description;
    editCompany.lookingfor =  editCompany.lookingfor ? editCompany.lookingfor : currentCompany.lookingfor;

    return editCompany;
}

async function editCompanyById(id, editCompany) {
    const currentCompany = await getCompanyById(id);

    const { name, email, phonenumber, address, postalcode, city, website, description, lookingfor } = fillEmptyEditProperties(editCompany, currentCompany);

    return new Promise((resolve) => {
        database.executeQuery((connection) => {
            connection.query(`UPDATE companies
            SET name = ?, email = ?, phone_number = ?, address = ?, postal_code = ?, city = ?, website = ?, description = ?, 
            looking_for = ? 
            WHERE id = ?`,
            [name, email, phonenumber, address, postalcode, city, website,
            description, lookingfor, id],
            async function (err, result) {
                if (err) throw err;

                const editedCompany = await getCompanyById(id);
                resolve(editedCompany);
            });
        });
    });
}

async function setBookingsId(companyId, bookingsId) {
    return new Promise((resolve) => {
        database.executeQuery((connection) => {
            connection.query(`UPDATE companies
            SET bookings_id = ?
            WHERE id = ?`,
            [bookingsId, companyId],
            function (err) {
                if (err) throw err;

                resolve(true);
            });
        });
    });
}

async function deleteCompanyById(id) {
    const deletedCompany = await getCompanyById(id);

    return new Promise((resolve) => {
        database.executeQuery((connection) => {
            connection.query(`DELETE FROM companies WHERE id = ?`,
            id,
            function (err) {
                if (err) throw err;

                resolve(deletedCompany);
            });
        });
    });
}

function rowToCompany(row) {
    return {
        id: row.id,
        name: row.name,
        email: row.email,
        phonenumber: row.phone_number,
        address: row.address,
        postalcode: row.postal_code,
        city: row.city,
        website: row.website,
        description: row.description,
        lookingfor: row.looking_for,
        bookingsid: row.bookings_id
    };
}

module.exports = { getAllCompanies, getCompanyById, deleteCompanyById, addCompany, editCompanyById, setBookingsId }