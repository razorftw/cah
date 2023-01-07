const express = require('express');
const session = require('express-session');
const crpyto = require('node:crypto');
const app = express();
const path = require('path');
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use("/public", express.static("views"))
app.set("views", path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.get("/", (req, res) => {
    res.render("login")
})

app.use(session({
    secret: crypto.randomUUID(),
    resave: false,
    saveUninitialized: true
}));

io.on('connection', (socket) => {
    console.log('A connection was made.');
    socket.on('disconnect', () => {
        console.log('A connection was closed.');
    });
});

server.listen(3000);
module.exports = app;