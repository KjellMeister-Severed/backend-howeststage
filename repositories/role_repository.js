const database = require("../services/database");

async function getUserRoles(userId) {
    return new Promise((resolve, reject) => {
        database.executeQuery((connection) => {
            connection.query(`SELECT roles.id, roles.name, roles.description FROM roles
            INNER JOIN users_roles ON roles.id = users_roles.role_id
            WHERE users_roles.user_id = ?;`,
            userId,
            async function (err, result) {
                if (err) return reject(err);

                if(result.length == 0) return resolve(null);
                
                resolve(result.map(rowToRole));
            });
        });
    });
}

function rowToRole(row) {
    return {
        id: row.id,
        name: row.name,
        description: row.description
    }
}


module.exports = { getUserRoles };