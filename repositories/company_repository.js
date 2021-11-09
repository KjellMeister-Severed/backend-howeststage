const database = require("../services/database");

function getAllCompanies() {
    return new Promise((resolve) => {
        database.executeQuery((connection) => {
            connection.query(`SELECT id, name, address, postal_code, city, website, description, looking_for 
            FROM companies`, function (err, result) {
                if (err) throw err;
                resolve(result.map(rowToCompany));
            });
        });
    });
}

function getCompanyById(id) {
    return new Promise((resolve) => {
        database.executeQuery((connection) => {
            connection.query(`SELECT id, name, address, postal_code, city, website, description, looking_for 
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
            connection.query(`INSERT INTO companies (name, address, postal_code, city, website,
                description, looking_for) VALUES(?, ?, ?, ?, ?, ?, ?)`,
            [company.name, company.address, company.postalcode, company.city, company.website,
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

    const { name, address, postalcode, city, website, description, lookingfor } = fillEmptyEditProperties(editCompany, currentCompany);

    return new Promise((resolve) => {
        database.executeQuery((connection) => {
            connection.query(`UPDATE companies
            SET name = ?, address = ?, postal_code = ?, city = ?, website = ?, description = ?, 
            looking_for = ? 
            WHERE id = ?`,
            [name, address, postalcode, city, website,
            description, lookingfor, id],
            async function (err, result) {
                if (err) throw err;

                const editedCompany = await getCompanyById(id);
                resolve(editedCompany);
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
            function (err, result) {
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
        address: row.address,
        postalcode: row.postal_code,
        city: row.city,
        website: row.website,
        description: row.description,
        lookingfor: row.looking_for
    };
}

module.exports = { getAllCompanies, getCompanyById, deleteCompanyById, addCompany, editCompanyById }