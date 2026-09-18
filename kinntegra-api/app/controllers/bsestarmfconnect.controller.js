const msSql = require("mssql");
const cryptoEngine = require("../models/cryptoengine.model");

exports.BSEConnect = async (req, res) => {
    // console.log(req.body);

    res.status(200).send({ Status: true, Message: "", Data: null });
};