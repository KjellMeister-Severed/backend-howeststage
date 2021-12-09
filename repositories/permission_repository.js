const database = require("../services/database");

async function getPermissionsForRole(roleId) {
    return new Promise((resolve, reject) => {
        database.executeQuery((connection) => {
            connection.query(`SELECT * FROM roles WHERE id = ?`,
            roleId,
            async function (err, result) {
                if (err) return reject(err);

                if(result.length == 0) resolve(null);

                resolve(result.map(rowToPermission));
            });
        });
    });
}

function rowToPermission(row) {
    return {
        id: row.id,
        name: row.name,
        description: row.description
    };
}

module.exports = { getPermissionsForRole };