const database = require("../services/database");
const fs = require('fs')

async function createUser(id) {
    return new Promise((resolve, reject) => {
        database.executeQuery((connection) => {
            connection.query(`INSERT INTO users (id) VALUES (?)`,
            id,
            async function (err) {
                if (err) return reject(err);

                resolve(true);
            });
        });
    });
}

async function getUserById(id) {
    return new Promise((resolve) => {
        database.executeQuery((connection) => {
            connection.query(`SELECT id, cv_path, linkedin_url FROM users WHERE id = ?`,
            [id],
            async function (err, result) {
                if (err) return reject(err);

                if(result.length == 0) return resolve(null);

                resolve(rowToUser(result[0]));
            });
        });
    });
}

async function editUserById(id, editUser) {
    const currentUser = await getUserById(id);

    if(currentUser == null) {
        await createUser(id);
    }

    const { linkedin_url } = fillEmptyEditProperties(editUser, currentUser);

    return new Promise((resolve, reject) => {
        database.executeQuery((connection) => {
            connection.query(`UPDATE users
            SET linkedin_url = ? 
            WHERE id = ?`,
            [linkedin_url, id],
            async function (err) {
                if (err) return reject(err);

                const editedUser = await getUserById(id);
                resolve(editedUser);
            });
        });
    });
}

function fillEmptyEditProperties(editUser) {
    return {
        linkedin_url : editUser.linkedin_url ? editUser.linkedin_url : editUser.linkedin_url
    };
}

function rowToUser(row) {
    return {
        id: row.id,
        cv_path: fs.existsSync(`./private/cv/${row.id}.pdf`) ? `/private/cv/${row.id}.pdf` : null,
        linkedin_url: row.linkedin_url,
    }
}

module.exports = { getUserById, editUserById };
