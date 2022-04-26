const mongoose = require('mongoose');
const Game = mongoose.model('Game');
const { response } = require('express');

module.exports = app => {

    //Routes
    app.post('/createGame', async (req, res) => {
        
        let response = {}

        const { name, users, numberOfPlayers } = req.body;
        if (users === null || users.length < 1) {
            response.code = 1;
            response.msg = "No players found";
            res.send(response);
            return;
        }

        var newGame = new Game({
            name: name,
            stars: ["a", "b"],
            numberOfPlayers: numberOfPlayers,
            users: users,
            actualTurn: -1
        })
        await newGame.save();
        response.code = 0;
        response.msg = "Game Created";
        response.inviteCode = ""; //Math.random().toString(16)
        res.send(response);
        return;
    });
}