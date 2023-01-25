const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const io = require("socket.io-client");

router.get("/", (req, res) => {
    // redirects from '/login' to '/'
    res.render("login.ejs");
});

router.post("/", (req, res) => {
    req.session.loggedIn = true;
    req.session.user = {
        username: req.body.nickname,
        uuid: crypto.randomUUID(),
    }
    console.log(req.body)
    res.locals.user = req.session.user;
    const socket = io("http://localhost:3000/");
    socket.on("connect", () => { 
        req.session.user.socketID = socket.id;
        console.log(socket.id)
        res.redirect(`/game`);
        socket.emit("createUser", req.session.user)
    });
});

module.exports = router;