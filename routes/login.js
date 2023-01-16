const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const io = require("socket.io-client");

router.get("/", (req, res) => {
    res.render("login.ejs", { });
    // redirects from '/login' to '/'
});

router.post("/", (req, res) => {
    req.session.loggedIn = true;
    req.session.user = {
        username: req.body.nickname,
        uuid: crypto.randomUUID(),
    }
    res.locals.user = req.session.user;
    res.redirect("/game");
    const socket = io("http://localhost:3000/");
    socket.emit("login", req.session.user)
});

module.exports = router;