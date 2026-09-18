require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();

const http = require("http").createServer(app);

const io = new Server(http, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

var corsOptions = {
    origin: ["http://localhost", "http://localhost:4200", "http://localhost:8080", "http://103.75.226.185:8081", "http://103.75.226.185:8082",]
};

// var corsOptions = {
//     origin: ["https://kinntegrawebapp.azurewebsites.net", "https://kinntegraapi.azurewebsites.net", "https://kinntegrarcomm.azurewebsites.net"]
// };

app.use(cors(corsOptions));

app.use(express.json({ limit: '50mb' }));

app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.get(
    "/", (req, res) => {
        res.json({ message: "Welcome to Kinntegra Real Communication!" });
    }
);

io.on('connection', (socket) => {
    console.log('a user connected!');

    socket.on('sendmessage', (msg) => {
        console.log('send message: ' + msg);

        io.emit('receivemessage', msg);
    });

    socket.on('reportorderprogress', (msg) => {
        console.log('send message: ' + msg);

        io.emit('receiveorderprogress', msg);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected!');
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log("Server is running on port " + PORT + ".");
});
