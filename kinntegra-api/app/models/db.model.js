// MSSQL
const msSql = require("mssql");
const dbConfig = require("../configs/db.config");
const config = {
    user: dbConfig.USERNAME,
    password: dbConfig.PASSWORD,
    server: dbConfig.SERVER,
    database: dbConfig.DATABASE,
    connectTimeout: 1000000,
    requestTimeout: 1000000,
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 1000000
    },
    dialectOptions: {
        requestTimeout: 1000000
    },
    options: {
        encrypt: true, //true for azure
        trustServerCertificate: true
    }
};

const pool = new msSql.ConnectionPool(config);

module.exports = pool;