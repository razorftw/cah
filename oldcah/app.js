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
    res.render("login.ejs");
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


var responses = {
    '/users': [],
    '/games': []
}

io.on('connection', (socket) => {
    console.log('A connection was made.');
    socket.on('disconnect', () => {
        console.log('A connection was closed.');
    });

    socket.on("createUser", (user) => {
        user.socketID = socket.id;
        responses["/users"].push(user)
        console.log('A user was created.');
    })
    socket.on("createGame", (game) => {
        responses["/games"].push(game)
        console.log('A game was created.');
    })

    socket.on("updateGameData", (hostUUID, updatedValues, cb) => {
        const gameToUpdate = responses["/games"].find(game => game.hostUUID === hostUUID);
        Object.assign(gameToUpdate, updatedValues);
        const updatedGame = responses["/games"].find(game => game.hostUUID === hostUUID);
        cb(updatedGame);
    })



    socket.on("getApiResponses", () => {
        socket.emit("retrieveApiResponses", responses);
    })


});

const checkSessions = false;
function sessionChecker(req, res, next) {
    ignoreList = ["/favicon.ico"]
    if (ignoreList.indexOf(req.originalUrl) != -1) return next()
    console.log(req.originalUrl, req.method)
    if (req.method != "GET") return next();
    if (!req.session.username || !req.session.uuid) return res.redirect("/");
    if (checkSessions) return res.redirect("/");
    next();
}
app.use(sessionChecker);

server.listen(3000);
module.exports = app;