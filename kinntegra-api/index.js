require("dotenv").config();
const express = require("express");
const cors = require("cors");
const nodeMailer = require("nodemailer");
const fileUpload = require("express-fileupload");

const app = express();

const http = require("http").createServer(app);

var corsOptions = {
    origin: ["http://localhost", "http://localhost:4200", "http://103.75.226.185:8081", "http://103.75.226.185:8082",]
};

// var corsOptions = {
//     origin: ["https://kinntegrawebapp.azurewebsites.net", "https://kinntegraapi.azurewebsites.net", "https://kinntegrarcomm.azurewebsites.net"]
// };

// var corsOptions = {
//     origin: ["https://kinntegra.co.in", "https://www.kinntegra.co.in", "https://api.kinntegra.co.in", "https://rcomm.kinntegra.co.in"]
// };

app.use(cors(corsOptions));

app.use(express.json({ limit: '50mb' }));

app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use(fileUpload());

app.use('/images', express.static('app/assets/images'));
app.use('/doc/report', express.static('public/documents/reports'));
app.use('/download/doc', express.static('public/documents/downloads'));

app.get(
    "/", (req, res) => {
        res.json({ message: "Welcome to Kinntegra!" });
    }
);

require("./app/routes/appuser.route")(app);
require("./app/routes/addresstype.route")(app);
require("./app/routes/bankaccounttype.route")(app);
require("./app/routes/department.route")(app);
require("./app/routes/wealthsource.route")(app);
require("./app/routes/grossannualincome.route")(app);
require("./app/routes/country.route")(app);
require("./app/routes/occupation.route")(app);
require("./app/routes/taxstatus.route")(app);
require("./app/routes/taxslab.route")(app);
require("./app/routes/bank.route")(app);
require("./app/routes/state.route")(app);
require("./app/routes/subdepartment.route")(app);
require("./app/routes/associate.route")(app);
require("./app/routes/employee.route")(app);
require("./app/routes/profession.route")(app);
require("./app/routes/entitytype.route")(app);
require("./app/routes/gender.route")(app);
require("./app/routes/lead.route")(app);
require("./app/routes/relation.route")(app);
require("./app/routes/client.route")(app);
require("./app/routes/designation.route")(app);
require("./app/routes/kycstatus.route")(app);
require("./app/routes/selfdeclaration.route")(app);
require("./app/routes/bloodgroup.route")(app);
require("./app/routes/otherincomecategory.route")(app);
require("./app/routes/dataupload.route")(app);
require("./app/routes/commercial.route")(app);
require("./app/routes/amctype.route")(app);
require("./app/routes/costinflationindices.route")(app);
require("./app/routes/accounttype.route")(app);
require("./app/routes/mandatetype.route")(app);
require("./app/routes/notification.route")(app);
require("./app/routes/employeefilter.route")(app);
require("./app/routes/appscheduler.route")(app);
require("./app/routes/transactiontype.route")(app);
require("./app/routes/transactionplan.route")(app);
require("./app/routes/transactionportfoliotype.route")(app);
require("./app/routes/transaction.route")(app);
require("./app/routes/importassociate.route")(app);
require("./app/routes/importdata.route")(app);
require("./app/routes/bseimport.route")(app);
require("./app/routes/exportdata.route")(app);
require("./app/routes/bsescheme.route")(app);
require("./app/routes/transactionportfolio.route")(app);
require("./app/routes/transactionmaster.route")(app);
require("./app/routes/expectedreturn.route")(app);
require("./app/routes/applog.route")(app);
require("./app/routes/termsconditions.route")(app);
require("./app/routes/comprehensiveplan.route")(app);
require("./app/routes/mismatchcases.route")(app);
require("./app/routes/bsestarmfconnect.route")(app);
require("./app/routes/dashboard.route")(app);
require("./app/routes/benchmarkdata.route")(app);

const appPool = require("./app/models/db.model");

// Start the HTTP server immediately so the service is up even if the database
// is temporarily unreachable (e.g. Azure SQL firewall not yet opened).
const PORT = process.env.PORT || 8080;
http.listen(PORT, () => {
    console.log("Server is running on port " + PORT + ".");
});

// Connect to the database with retry; expose the pool once ready.
function connectDb(attempt) {
    appPool.connect().then(function (pool) {
        app.locals.db = pool;
        console.log("Database pool connected.");
    }).catch(function (err) {
        console.error("Error creating pool (attempt " + attempt + "):", err && err.message ? err.message : err);
        setTimeout(function () { connectDb(attempt + 1); }, 15000);
    });
}
connectDb(1);