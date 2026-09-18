const emailEngine = require('../models/emailengine.model');
// const smsEngine = require('../models/smsengine.model');
const associateController = require('../controllers/associate.controller');
const employeeController = require('../controllers/employee.controller');
const io = require('socket.io-client');

const NotificationEngine = function () {
}

// NotificationEngine.SendAssociateVerificationNotification = (email, sms, web, mobile, data) => {
//     if (email) {
//         emailEngine.SendAssociateVerification(data);
//     }
//     if (web) { }
//     if (sms) { }

//     if (mobile) { }
// };

// NotificationEngine.SendAssociateCredentialsNotification = (email, sms, web, mobile, data) => {
//     if (email) {
//         emailEngine.SendAssociateCredentials(data);
//     }
//     if (web) { }
//     if (sms) { }

//     if (mobile) { }
// };

// NotificationEngine.SendEmployeeVerificationNotification = (email, sms, web, mobile, data) => {
//     if (email) {
//         emailEngine.SendEmployeeVerification(data);
//     }
//     if (web) { }
//     if (sms) { }

//     if (mobile) { }
// };

// NotificationEngine.SendEmployeeCredentialsNotification = (email, sms, web, mobile, data) => {
//     if (email) {
//         emailEngine.SendEmployeeCredentials(data);
//     }
//     if (web) { }
//     if (sms) { }

//     if (mobile) { }
// };

// NotificationEngine.SendRestPasswordNotification = (email, sms, web, mobile, data) => {
//     if (email) {
//         emailEngine.SendRestPasswordEmailLink(data);
//     }
//     if (web) { }
//     if (sms) { }

//     if (mobile) { }
// };


NotificationEngine.SendRealCommunicationMessage = (message) => {
    const socket = io.connect(process.env.REAL_COMM_LINK, {
        reconnection: true,
        autoConnect: true
    });

    socket.on('connection', function () {
        // console.log('connected to real communication socket');
    });

    socket.emit('sendmessage', message);

    socket.on('receivemessage', (msg) => {
        // console.log('receivemessage: ' + msg);
    });
};

NotificationEngine.SendRealCommunicationOrderProgress = (message) => {
    const socket = io.connect(process.env.REAL_COMM_LINK, {
        reconnection: true,
        autoConnect: true
    });

    socket.on('connection', function () {
        // console.log('connected to real communication socket');
    });

    socket.emit('reportorderprogress', message);

    socket.on('receiveorderprogress', (msg) => {
        // console.log('receivemessage: ' + msg);
    });
};

module.exports = NotificationEngine;