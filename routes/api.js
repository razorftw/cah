const express = require('express');
const router = express.Router();

var responses = {
    '/users': [{ name: "Brian" }]
}

//api specific routes
router.get('/', function(req, res) {
    res.render("api.ejs");
});

router.get('/users', function(req, res) {
    res.json(responses['/users']);
});
module.exports = router;