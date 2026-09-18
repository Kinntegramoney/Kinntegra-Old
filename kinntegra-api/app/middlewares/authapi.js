const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const apiKey = req.headers["x-api-key"];

    if (!apiKey) {
        return res.status(403).send("Invalid request...");
    }

    try {
        if (apiKey.toUpperCase() != '397071386F563639685674495956545432704E4F6E673D3D') {
            return res.status(403).send("Invalid request...");
        }
    }
    catch (err) {
        return res.status(401).send("Invalid session...");
    }

    return next();
};

module.exports = verifyToken;