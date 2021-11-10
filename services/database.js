const mysql = require("mysql");

function createConnection() {
    return mysql.createConnection({
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME
        });
}

function executeQuery(query) {
    const connection = createConnection();
    connection.connect(function(err) {
        if (err) throw err;
        query(connection);
        connection.end();
    });
}

module.exports = { executeQuery }