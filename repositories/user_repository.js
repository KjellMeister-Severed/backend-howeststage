const database = require("../services/database");

async function getUserById(id) {
    return new Promise((resolve) => {
        database.executeQuery((connection) => {
            connection.query(`SELECT id, cv_path, linkedin_url, is_admin FROM users WHERE id = ?`,
            [id],
            async function (err, result) {
                if (err) throw err;

                resolve(rowToUser(result[0]));
            });
        });
    });
}

async function editUserById(id, editUser) {
    const currentUser = await getUserById(id);

    const { linkedin_url } = fillEmptyEditProperties(editUser, currentUser);

    return new Promise((resolve) => {
        database.executeQuery((connection) => {
            connection.query(`UPDATE users
            SET linkedin_url = ? 
            WHERE id = ?`,
            [linkedin_url, id],
            async function (err) {
                if (err) throw err;

                const editedUser = await getUserById(id);
                resolve(editedUser);
            });
        });
    });
}

function fillEmptyEditProperties(editUser, currentUser) {
    return {
        linkedin_url : editUser.linkedin_url ? editUser.linkedin_url : editUser.linkedin_url
    };
}

function rowToUser(row) {
    return {
        id: row.id,
        cv_path: row.cv_path,
        linkedin_url: row.linkedin_url,
        is_admin: row.is_admin
    }
}

module.exports = { editUserById };
