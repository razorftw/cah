const express = require('express');
const router = express.Router();
const { io } = require("socket.io-client");
const socket = io("http://localhost:3000/");

router.get('/', function(req, res) {
    res.render("api.ejs");
});

function callAPIResponse(res, route) {
    socket.emit("getApiResponses")
    socket.once("retrieveApiResponses", (response) => { 
        res.json(response[route]);
    })
}
router.get('/users', function(req, res) {
    callAPIResponse(res, "/users")
    
});
router.get('/games', function(req, res) {
    callAPIResponse(res, "/games")
});
module.exports = router;