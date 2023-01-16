const express = require('express');
const bodyParser = require("body-parser");
const crypto = require('node:crypto');
const app = express();
const path = require('path');
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(bodyParser.urlencoded({ extended: true }));
app.use("/assets", express.static("assets"))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.get("/", (req, res) => {
    res.render("login");
});

session = require("express-session")({
    secret: "my-secret",
    resave: true,
    saveUninitialized: true,
    maxAge: 1000 * 60 * 60 * 24 // session max age in miliseconds (1 day)
});
app.use(session);

app.use('/api', require("./routes/api"));
app.use("/login", require("./routes/login"));
app.use("/game", require("./routes/game"));

io.on('connection', (socket) => {
    console.log('A connection was made.');
    socket.on('disconnect', () => {
        console.log('A connection was closed.');
    });
});

server.listen(3000);
module.exports = app;