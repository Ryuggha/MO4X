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

        var inviteCode;
        var searchBool = false;
        while (!searchBool) {
            inviteCode = Math.random().toString(36).substring(2, 10);
            var a = await Game.findOne({actualTurn: -1, inviteCode: inviteCode});
            if (a === null) searchBool = true;
        }

        var newGame = new Game({
            name: name,
            numberOfPlayers: numberOfPlayers,
            users: users,
            inviteCode: inviteCode,
            stars: ["a", "b"],
            actualTurn: -1
        })
        await newGame.save();
        response.code = 0;
        response.msg = "Game Created";
        response.inviteCode = inviteCode;
        res.send(response);
        return;
    });
}