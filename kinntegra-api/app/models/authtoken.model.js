const jwt = require("jsonwebtoken");

const key = process.env.TOKEN_KEY;

const AuthToken = function () { }

AuthToken.GenerateMidToken = (id, username) => {
    const token = jwt.sign(
        { user_id: id, user_name: username },
        process.env.TOKEN_KEY,
        {
            expiresIn: "1h"
        }
    );

    return token;
};

AuthToken.GenerateToken = (id, username, userrole, associateid, employeeid, clientid) => {
    const token = jwt.sign(
        { user_id: id, user_name: username, user_role: userrole, associate_id: associateid, employee_id: employeeid, client_id: clientid },
        process.env.TOKEN_KEY,
        {
            expiresIn: "8h"
        }
    );

    return token;
};

AuthToken.GeneratePublicToken = (id, username) => {
    const token = jwt.sign(
        { user_id: id, user_name: username },
        process.env.TOKEN_KEY,
        {
            expiresIn: "1h"
        }
    );

    return token;
};

AuthToken.VerifyMidToken = (token) => {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    return decoded;
};

module.exports = AuthToken;