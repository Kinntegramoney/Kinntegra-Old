const nodeMailer = require("nodemailer");
const emailConfig = require("../configs/mail.config");
const fileSystem = require("fs");
const path = require("path");
const apiLink = process.env.WEB_API_LINK;

const transporter = nodeMailer.createTransport({
    port: emailConfig.PORT,
    host: emailConfig.HOST,
    auth: {
        user: emailConfig.USER,
        pass: emailConfig.PASSWORD,
    },
    secure: emailConfig.SECURE,
    tls: {
        rejectUnauthorized: false
    }
});

const EmailEngine = function () { }

module.exports = EmailEngine;

EmailEngine.SendAssociateVerification = (emailTo, associateName, link) => {

    var templatePath = path.join(__dirname.replace("models", ""), "templates", "emailers", "emailassociateselfverificationtemplate.html");
    fileSystem.readFile(templatePath, 'utf8', function (err, htmlData) {
        var emailContent = htmlData.replaceAll("[AssociateName]", associateName)
            .replaceAll("[Link]", link);

        const mailData = {
            from: emailConfig.USER,
            to: emailTo,
            subject: "Associate Self verification",
            html: emailContent,
        };

        transporter.sendMail(mailData, (err, result) => {
            if (err) {
                return err;
            }

            return { Message: "Mail sent", MessageId: result.messageId };
        });
    });
};

EmailEngine.SendAssociateCredentials = (emailTo, associateName, link, pin) => {

    var templatePath = path.join(__dirname.replace("models", ""), "templates", "emailers", "emailassociatecredentialstemplate.html");
    fileSystem.readFile(templatePath, 'utf8', function (err, htmlData) {
        var emailContent = htmlData.replaceAll("[AssociateName]", associateName)
            .replaceAll("[Link]", link)
            .replaceAll("[Pin]", pin);

        const mailData = {
            from: emailConfig.USER,
            to: emailTo,
            subject: "Associate Credentials",
            html: emailContent,
        };

        transporter.sendMail(mailData, (err, result) => {
            if (err) {
                return err;
            }

            return { Message: "Mail sent", MessageId: result.messageId };
        });
    });
};

EmailEngine.SendEmployeeVerification = (emailTo, employeeName, link) => {


    var templatePath = path.join(__dirname.replace("models", ""), "templates", "emailers", "emailemployeeselfverificationtemplate.html");
    fileSystem.readFile(templatePath, 'utf8', function (err, htmlData) {
        var emailContent = htmlData.replaceAll("[EmployeeName]", employeeName)
            .replaceAll("[Link]", link);

        const mailData = {
            from: emailConfig.USER,
            to: emailTo,
            subject: "Employee Self verification",
            html: emailContent,
        };

        transporter.sendMail(mailData, (err, result) => {
            if (err) {
                console.log(err);
                return err;
            }

            return { Message: "Mail sent", MessageId: result.messageId };
        });
    });
};

EmailEngine.SendSelfRejection = (emailTo, employeeName, reason) => {


    var templatePath = path.join(__dirname.replace("models", ""), "templates", "emailers", "emailemployeerejectiontemplate.html");
    fileSystem.readFile(templatePath, 'utf8', function (err, htmlData) {
        var emailContent = htmlData.replaceAll("[EmployeeName]", employeeName)
            .replaceAll("[Reason]", reason);

        const mailData = {
            from: emailConfig.USER,
            to: emailTo,
            subject: "Employee Self rejection",
            html: emailContent,
        };

        transporter.sendMail(mailData, (err, result) => {
            if (err) {
                console.log(err);
                return err;
            }

            return { Message: "Mail sent", MessageId: result.messageId };
        });
    });
};

EmailEngine.SendEmployeeCredentials = (emailTo, employeeName, link, pin) => {

    var templatePath = path.join(__dirname.replace("models", ""), "templates", "emailers", "emailemployeecredentialstemplate.html");
    fileSystem.readFile(templatePath, 'utf8', function (err, htmlData) {
        var emailContent = htmlData.replaceAll("[EmployeeName]", employeeName)
            .replaceAll("[Link]", link)
            .replaceAll("[Pin]", pin);

        const mailData = {
            from: emailConfig.USER,
            to: emailTo,
            subject: "Employee Credentials",
            html: emailContent,
        };

        transporter.sendMail(mailData, (err, result) => {
            if (err) {
                return err;
            }

            return { Message: "Mail sent", MessageId: result.messageId };
        });
    });
};

EmailEngine.SendRestPasswordEmailLink = (emailTo, Device, Browser, IpAddress, ResetLink, name) => {
    // emailTo = 'deephshah212000@gmail.com';
    var time = new Date().toLocaleString('en-GB', { timeZone: 'Asia/Kolkata' });
    var templatePath = path.join(__dirname.replace("models", ""), "templates", "emailers", "emailresetpasswordlinktemplate.html");
    fileSystem.readFile(templatePath, 'utf8', function (err, htmlData) {
        var emailContent = htmlData.replaceAll("[Link]", ResetLink)
            .replaceAll("[IpAddress]", IpAddress)
            .replaceAll("[device]", Device)
            .replaceAll("[browser]", Browser)
            .replaceAll("[time]", time)
            .replaceAll("[LogoImage]", apiLink + '/images/logo-green.png')
            .replaceAll("[UserName]", name);

        const mailData = {
            from: emailConfig.USER,
            to: emailTo,
            subject: "Kinntegra | Reset Password/PIN Request",
            html: emailContent,
        };

        transporter.sendMail(mailData, (err, result) => {
            if (err) {
                return err;
            }

            return { Message: "Mail sent", MessageId: result.messageId };
        });
    });
};

EmailEngine.SendClientSelfVerification = (emailTo, clientName, link) => {
    var templatePath = path.join(__dirname.replace("models", ""), "templates", "emailers", "emailclientselfverificationtemplate.html");
    fileSystem.readFile(templatePath, 'utf8', function (err, htmlData) {
        var emailContent = htmlData.replaceAll("[ClientName]", clientName)
            .replaceAll("[Link]", link);

        const mailData = {
            from: emailConfig.USER,
            to: emailTo,
            subject: "Client Self verification",
            html: emailContent,
        };

        transporter.sendMail(mailData, (err, result) => {
            if (err) {
                return err;
            }

            return { Message: "Mail sent", MessageId: result.messageId };
        });
    });
};

EmailEngine.SendAssociateSelfRejection = (emailTo, associateName, reason) => {


    var templatePath = path.join(__dirname.replace("models", ""), "templates", "emailers", "emailassociaterejectiontemplate.html");
    fileSystem.readFile(templatePath, 'utf8', function (err, htmlData) {
        var emailContent = htmlData.replaceAll("[AssociateName]", associateName)
            .replaceAll("[Reason]", reason);

        const mailData = {
            from: emailConfig.USER,
            to: emailTo,
            subject: "Associate Self rejection",
            html: emailContent,
        };

        transporter.sendMail(mailData, (err, result) => {
            if (err) {
                console.log(err);
                return err;
            }

            return { Message: "Mail sent", MessageId: result.messageId };
        });
    });
};

EmailEngine.SendClientMFUCANRegistrationConsent = (emailTo, clientName, link) => {

    var templatePath = path.join(__dirname.replace("models", ""), "templates", "emailers", "emailcanregistrationconsenttemplate.html");
    fileSystem.readFile(templatePath, 'utf8', function (err, htmlData) {
        var emailContent = htmlData.replaceAll("[ClientName]", clientName)
            .replaceAll("[Link]", link);

        const mailData = {
            from: emailConfig.USER,
            to: emailTo,
            subject: "MFU CAN Registration Consent",
            html: emailContent,
        };

        transporter.sendMail(mailData, (err, result) => {
            if (err) {
                return err;
            }

            return { Message: "Mail sent", MessageId: result.messageId };
        });
    });
};

EmailEngine.SendClientCredentials = (emailTo, clientName, link, pin) => {
    var templatePath = path.join(__dirname.replace("models", ""), "templates", "emailers", "emailclientcredentialstemplate.html");
    fileSystem.readFile(templatePath, 'utf8', function (err, htmlData) {
        var emailContent = htmlData.replaceAll("[ClientName]", clientName)
            .replaceAll("[Link]", link)
            .replaceAll("[Pin]", pin);

        const mailData = {
            from: emailConfig.USER,
            to: emailTo,
            subject: "Client Account Credentials",
            html: emailContent,
        };

        transporter.sendMail(mailData, (err, result) => {
            if (err) {
                return err;
            }

            return { Message: "Mail sent", MessageId: result.messageId };
        });
    });
};

EmailEngine.SendBulkClientCredentials = (emailTo, clientName, link, pin, password) => {
    var templatePath = path.join(__dirname.replace("models", ""), "templates", "emailers", "emailbulkclientcredentialstemplate.html");
    fileSystem.readFile(templatePath, 'utf8', function (err, htmlData) {
        var emailContent = htmlData.replaceAll("[ClientName]", clientName)
            .replaceAll("[Link]", link)
            .replaceAll("[Pin]", pin)
            .replaceAll("[Password]", password);

        const mailData = {
            from: emailConfig.USER,
            to: emailTo,
            subject: "Client Account Credentials",
            html: emailContent,
        };

        transporter.sendMail(mailData, (err, result) => {
            if (err) {
                return err;
            }

            return { Message: "Mail sent", MessageId: result.messageId };
        });
    });
};

EmailEngine.SendClientOrderConfirmationLink = (emailTo, clientName, associateName, clientAccounts, link, subject) => {
    var accountsHtml = '';

    for (let i = 0; i < clientAccounts.length; i++) {
        var accountItem = clientAccounts[i];

        var accountHtmlItem = "<div>";
        if (accountItem.UCC != '') {
            accountHtmlItem += "<span>" + accountItem.UCC + "</span> | ";
        }
        else {
            accountHtmlItem += "<span>No UCC</span> | ";
        }

        if (accountItem.FirstHolderName != '') {
            accountHtmlItem += "<span>" + accountItem.FirstHolderName + "</span>";
        }
        if (accountItem.SecondHolderName != '') {
            accountHtmlItem += " - <span>" + accountItem.SecondHolderName + "</span>";
        }
        if (accountItem.ThirdHolderName != '') {
            accountHtmlItem += " - <span>" + accountItem.ThirdHolderName + "</span>";
        }
        if (accountItem.GuardianName != '') {
            accountHtmlItem += " | <span>Guardian: " + accountItem.GuardianName + "</span>";
        }
        if (accountItem.FirstNomineeName != '') {
            accountHtmlItem += " | <span>Nominee: " + accountItem.FirstNomineeName + "</span>";
            if (accountItem.SecondNomineeName != '') {
                accountHtmlItem += "<span>, " + accountItem.SecondNomineeName + "</span>";
            }
            if (accountItem.ThirdNomineeName != '') {
                accountHtmlItem += "<span>, " + accountItem.ThirdNomineeName + "</span>";
            }
        }

        accountHtmlItem += "</div>";

        accountsHtml += accountHtmlItem;
    }

    var templatePath = path.join(__dirname.replace("models", ""), "templates", "emailers", "emailconfirmordertemplate.html");
    fileSystem.readFile(templatePath, 'utf8', function (err, htmlData) {
        var emailContent = htmlData.replaceAll("[ClientName]", clientName)
            .replaceAll("[AssociateName]", associateName)
            .replaceAll("[AccountsHtml]", accountsHtml)
            .replaceAll("[Link]", link);

        const mailData = {
            from: emailConfig.USER,
            to: emailTo,
            subject: subject,
            html: emailContent,
        };

        transporter.sendMail(mailData, (err, result) => {
            if (err) {
                return err;
            }

            return { Message: "Mail sent", MessageId: result.messageId };
        });
    });
};

EmailEngine.SendClientOrderPaymentLink = (emailTo, clientName, associateName, link, subject) => {

    var templatePath = path.join(__dirname.replace("models", ""), "templates", "emailers", "emailorderpaymenttemplate.html");
    fileSystem.readFile(templatePath, 'utf8', function (err, htmlData) {
        var emailContent = htmlData.replaceAll("[ClientName]", clientName)
            .replaceAll("[Link]", link);

        const mailData = {
            from: emailConfig.USER,
            to: emailTo,
            subject: subject,
            html: emailContent,
        };

        transporter.sendMail(mailData, (err, result) => {
            if (err) {
                return err;
            }

            return { Message: "Mail sent", MessageId: result.messageId };
        });
    });
};

EmailEngine.SendSWPIntimation = (emailTo, clientName, schemeNames, swpAmount, currentInstallment, totalInstallments, swpDate, fileName, filePath, subject) => {
    var templatePath = path.join(__dirname.replace("models", ""), "templates", "emailers", "emailswpintimationtemplate.html");
    fileSystem.readFile(templatePath, 'utf8', function (err, htmlData) {
        var emailContent = htmlData.replaceAll("[ClientName]", clientName)
            .replaceAll("[SchemeName]", schemeNames)
            .replaceAll("[Amount]", swpAmount)
            .replaceAll("[CurrentInstallmentNumber]", currentInstallment)
            .replaceAll("[TotalInstallments]", totalInstallments)
            .replaceAll("[Date]", swpDate);

        const mailData = {
            from: emailConfig.USER,
            to: emailTo,
            subject: subject,
            html: emailContent,
            attachments: [
                {
                    filename: fileName,
                    href: filePath
                }
            ]
        };

        transporter.sendMail(mailData, (err, result) => {
            if (err) {
                return err;
            }

            return { Message: "Mail sent", MessageId: result.messageId };
        });
    });
};

EmailEngine.SendBuyIntimation = (emailTo, clientName, schemeNames, amount, transactionDate, fileName, filePath, subject) => {
    var templatePath = path.join(__dirname.replace("models", ""), "templates", "emailers", "emailbuyintimationtemplate.html");
    fileSystem.readFile(templatePath, 'utf8', function (err, htmlData) {
        var emailContent = htmlData.replaceAll("[ClientName]", clientName)
            .replaceAll("[SchemeName]", schemeNames)
            .replaceAll("[Amount]", amount)
            .replaceAll("[Date]", transactionDate);

        const mailData = {
            from: emailConfig.USER,
            to: emailTo,
            subject: subject,
            html: emailContent,
            attachments: [
                {
                    filename: fileName,
                    href: filePath
                }
            ]
        };

        transporter.sendMail(mailData, (err, result) => {
            if (err) {
                return err;
            }

            return { Message: "Mail sent", MessageId: result.messageId };
        });
    });
};

EmailEngine.SendCancelBuyIntimation = (emailTo, clientName, amount, transactionDate, subject) => {
    var templatePath = path.join(__dirname.replace("models", ""), "templates", "emailers", "emailcancelbuyintimationtemplate.html");
    fileSystem.readFile(templatePath, 'utf8', function (err, htmlData) {
        var emailContent = htmlData.replaceAll("[ClientName]", clientName)
            .replaceAll("[Amount]", amount)
            .replaceAll("[Date]", transactionDate);

        const mailData = {
            from: emailConfig.USER,
            to: emailTo,
            subject: subject,
            html: emailContent
        };

        transporter.sendMail(mailData, (err, result) => {
            if (err) {
                return err;
            }

            return { Message: "Mail sent", MessageId: result.messageId };
        });
    });
};

EmailEngine.SendCancelASWPIntimation = (emailTo, clientName, amount, transactionDate, subject) => {
    var templatePath = path.join(__dirname.replace("models", ""), "templates", "emailers", "emailcancelaswpintimationtemplate.html");
    fileSystem.readFile(templatePath, 'utf8', function (err, htmlData) {
        var emailContent = htmlData.replaceAll("[ClientName]", clientName)
            .replaceAll("[Amount]", amount)
            .replaceAll("[Date]", transactionDate);

        const mailData = {
            from: emailConfig.USER,
            to: emailTo,
            subject: subject,
            html: emailContent
        };

        transporter.sendMail(mailData, (err, result) => {
            if (err) {
                return err;
            }

            return { Message: "Mail sent", MessageId: result.messageId };
        });
    });
};

EmailEngine.SendClientHoldingReport = (emailTo, clientName, fileName, filePath, subject) => {
    var templatePath = path.join(__dirname.replace("models", ""), "templates", "emailers", "emailclientholdingreporttemplate.html");
    fileSystem.readFile(templatePath, 'utf8', function (err, htmlData) {
        var emailContent = htmlData.replaceAll("[ClientName]", clientName);

        const mailData = {
            from: emailConfig.USER,
            to: emailTo,
            subject: subject,
            html: emailContent,
            attachments: [
                {
                    filename: fileName,
                    href: filePath
                }
            ]
        };

        transporter.sendMail(mailData, (err, result) => {
            if (err) {
                return err;
            }

            return { Message: "Mail sent", MessageId: result.messageId };
        });
    });
};

EmailEngine.SendClientSupervisorRejectionLog = (emailTo, associateName, familyName, reason) => {
    var templatePath = path.join(__dirname.replace("models", ""), "templates", "emailers", "emailclientsupervisorrejectionlogtemplate.html");
    fileSystem.readFile(templatePath, 'utf8', function (err, htmlData) {
        var emailContent = htmlData.replaceAll("[AssociateName]", associateName)
            .replaceAll("[FamilyName]", familyName)
            .replaceAll("[Reason]", reason);

        const mailData = {
            from: emailConfig.USER,
            to: emailTo,
            subject: "Approval Request for " + familyName + " has been rejected by the Super Admin",
            html: emailContent,
        };

        transporter.sendMail(mailData, (err, result) => {
            if (err) {
                console.log(err);
                return err;
            }

            return { Message: "Mail sent", MessageId: result.messageId };
        });
    });
};

EmailEngine.SendClientAccountRejectionLog = (emailTo, associateName, familyName, reason) => {
    var templatePath = path.join(__dirname.replace("models", ""), "templates", "emailers", "emailclientaccountrejectionlogtemplate.html");
    fileSystem.readFile(templatePath, 'utf8', function (err, htmlData) {
        var emailContent = htmlData.replaceAll("[AssociateName]", associateName)
            .replaceAll("[FamilyName]", familyName)
            .replaceAll("[Reason]", reason);

        const mailData = {
            from: emailConfig.USER,
            to: emailTo,
            subject: "Client " + familyName + " has declined the self-approval request",
            html: emailContent,
        };

        transporter.sendMail(mailData, (err, result) => {
            if (err) {
                console.log(err);
                return err;
            }

            return { Message: "Mail sent", MessageId: result.messageId };
        });
    });
};

EmailEngine.SendClientWelcomeEmail = (emailTo, clientName, fileName, filePath, subject) => {
    var templatePath = path.join(__dirname.replace("models", ""), "templates", "emailers", "emailclientwelcometemplate.html");
    fileSystem.readFile(templatePath, 'utf8', function (err, htmlData) {
        var emailContent = htmlData.replaceAll("[ClientName]", clientName);

        const mailData = {
            from: emailConfig.USER,
            to: emailTo,
            subject: subject,
            html: emailContent,
            attachments: [
                {
                    filename: fileName,
                    href: filePath
                }
            ]
        };

        transporter.sendMail(mailData, (err, result) => {
            if (err) {
                return err;
            }

            return { Message: "Mail sent", MessageId: result.messageId };
        });
    });
};

EmailEngine.SendAssociateMandateRejectionEmail = (emailTo, clientName, ucc) => {
    var templatePath = path.join(__dirname.replace("models", ""), "templates", "emailers", "emailmandaterejectedtemplate.html");
    fileSystem.readFile(templatePath, 'utf8', function (err, htmlData) {
        var emailContent = htmlData.replaceAll("[ClientName]", clientName)
            .replaceAll("[UCC]", ucc);

        const mailData = {
            from: emailConfig.USER,
            to: emailTo,
            subject: "Action Required: Mandate Rejected for SIP Registration.",
            html: emailContent,
        };

        transporter.sendMail(mailData, (err, result) => {
            if (err) {
                return err;
            }

            return { Message: "Mail sent", MessageId: result.messageId };
        });
    });
};

EmailEngine.SendBSEPasswordChangedEmail = (emailTo, newPassword) => {
    var templatePath = path.join(__dirname.replace("models", ""), "templates", "emailers", "emailbsepasswordchangedtemplate.html");
    fileSystem.readFile(templatePath, 'utf8', function (err, htmlData) {
        var emailContent = htmlData.replaceAll("[Password]", newPassword);

        const mailData = {
            from: emailConfig.USER,
            to: emailTo,
            subject: "Attention: BSE Login Password Changed.",
            html: emailContent,
        };

        transporter.sendMail(mailData, (err, result) => {
            if (err) {
                return err;
            }

            return { Message: "Mail sent", MessageId: result.messageId };
        });
    });
};

