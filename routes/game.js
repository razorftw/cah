// routes/games.js
const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const tempGameArray = [{
    host: "razor",
    hostUUID: "fdgsfdgdf",
    gameUUID: crypto.randomUUID(),
    password: false,
    maxPlayers: 10,
    maxSpectators: 10, // SPECTATORS WILL NOT BE ADDED TILL LATER ON
    progress: "Not Started", // Not Started, In Progress
    players: ["razor"],
    spectators: [], // SPECTATORS WILL NOT BE ADDED TILL LATER ON
    goal: 10,
    cardPacks: [],
}, {
    host: "razor",
    hostUUID: "gfdghsdfgdf",
    gameUUID: crypto.randomUUID(),
    password: true,
    maxPlayers: 10,
    maxSpectators: 10, // SPECTATORS WILL NOT BE ADDED TILL LATER ON
    progress: "Not Started", // Not Started, In Progress
    players: ["razor", "razor"],
    spectators: [], // SPECTATORS WILL NOT BE ADDED TILL LATER ON
    goal: 15,
    cardPacks: [],
}];

router.get("/", (req, res) => {
    errorCodes = require("../assets/errorCodes.json")
    const error = req.query.error;
    //console.log(errorCodes[error])
    const input = { currentUser: "Razor", gameArray: tempGameArray };
    if (error) input.error = errorCodes[error];
    //console.log(input)
    res.render("gameMenu.ejs", input);
})

router.post("/join/:gameType", (req, res) => {
    //console.log(req.query)
})

router.param("gameType", (req, res, next, gameType) => {
    if (!["spectate", "normal", "locked"].includes(gameType.toLowerCase())) {
        return res.redirect("http://localhost:3000/game?error=invaild_gametype");
    }
    next()
});

// router.post('/new', async (req, res) => {
//   // Get the current user
//   const user = req.session.user;
//   if (!user) {
//     // If there is no logged in user, redirect to the login page
//     res.redirect('/login');
//     return;
//   }

//   // Get the game properties from the request body
//   const { maxPlayers, pointsGoal, maxSpectators, cardPacks } = req.body;

//   // Generate a unique game id
//   let gameUUID;
//   do {
//     gameUUID = crypto.randomBytes(16).toString('hex');
//   } while (await Game.exists({ gameUUID }));

//   // Create a new game with the unique id and the specified properties
//   const newGame = new Game({
//     host: user._id,
//     gameUUID,
//     maxPlayers,
//     pointsGoal,
//     maxSpectators,
//     players: [user._id],
//     spectators: [],
//     cardPacks
//   });
//   newGame.save((err) => {
//     if (err) {
//       res.sendStatus(500);
//       return;
//     }
//     res.redirect(`/game/${gameId}`);
//   });
// });

module.exports = router;
