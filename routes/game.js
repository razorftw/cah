// routes/games.js
const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const io = require("socket.io-client");

router.get("/", async (req, res) => {
    if (req.session.user === undefined) return res.redirect("/")
    errorCodes = require("../assets/errorCodes.json")
    const error = req.query.error;
    //console.log(errorCodes[error])
    fetch("http://localhost:3000/api/games")
    .then(response => response.json())
    .then(gameArray => {
        const input = { userID: req.session.user.uuid, gameArray: JSON.stringify(gameArray)};
        if (error) input.error = errorCodes[error];
        res.render("gameMenu.ejs", input);
    });
    
})

router.get("/create", (req, res) => {
    if (req.session.user === undefined) return res.redirect("/")
    host = req.session.user
    const deckFiles = fs.readdirSync(path.join(__dirname, "../publicDecks"))
    var cardsets = {};
    for (deck of deckFiles) {
        deckData = require(`../publicDecks/${deck}`)
        cardsets[deckData.cardsetUUID] = deckData
    }
    const game = {
        host: host.username,
        hostUUID: host.uuid,
        gameUUID: crypto.randomUUID(),
        password: false,
        maxPlayers: 10,
        maxSpectators: 10,
        progress: "Not Started",
        players: [host.username],
        spectators: [],
        goal: 10,
        cardPacks: [],
    }
    const socket = io("http://localhost:3000/", {
        query: {
            socketId: host.socketID
        }
    })
    socket.emit("createGame", game);
    
    res.render("createGame.ejs", { cardsets: cardsets, currentGame: game})
})

router.post("/createGameUpdate", (req, res) => {
    const deckFiles = fs.readdirSync(path.join(__dirname, "../publicDecks"))
    var cardsets = {};
    for (deck of deckFiles) {
        deckData = require(`../publicDecks/${deck}`)
        cardsets[deckData.cardsetUUID] = deckData
    }
    console.log(req.body)
    fetch('http://localhost:3000/api/users')
    .then(response => response.json())
    .then(data => {
        var user = data.find(function(data) {
            return data.uuid === req.body.hostUUID;
        });
        if (user) {
            const socket = io("http://localhost:3000/", {
                query: {
                    socketId: user.socketID
                }
            })
            const updatedValues = {
                password: false,
                maxPlayers: 10,
                maxSpectators: 10,
                //progress: "Not Started",
                goal: 10,
                cardPacks: req.body.card_set,
            }
            socket.emit("updateGameData", req.body.hostUUID, updatedValues, function(updatedGame){
                res.render("createGame.ejs", { cardsets: cardsets, currentGame: updatedGame})
            })
        } 
    })

})

router.post("/join/:gameType", (req, res) => {
    console.log(req.query)
    res.render("joinGame.ejs", req.query)
})

router.param("gameType", (req, res, next, gameType) => {
    if (!["spectate", "normal", "locked"].includes(gameType.toLowerCase())) {
        return res.redirect("http://localhost:3000/game?error=invaild_gametype");
    }
    req.query.gameType = gameType.toLowerCase();
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
