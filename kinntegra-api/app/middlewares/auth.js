const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers["x-access-token"];

    if(!token)
    {
        return res.status(403).send("Invalid request...");
    }

    try
    {
        const decoded = jwt.verify(token, process.env.TOKEN_KEY);
        req.User = decoded;
    }
    catch(err){
        return res.status(401).send("Invalid session...");
    }

    return next();
};

module.exports = verifyToken;