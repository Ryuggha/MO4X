const mongoose = require('mongoose');
const Game = mongoose.model('Game');
const Account = mongoose.model('Account');
const { response } = require('express');

const maxPlayers = 16;

module.exports = app => {

    //Routes
    app.post('/createGame', async (req, res) => {
        
        let response = {}

        const { name, users, numberOfPlayers } = req.body;
        if (users == null || users.length < 1) {
            response.code = 1;
            response.msg = "No players found";
            res.send(response);
            return;
        }

        if (numberOfPlayers > maxPlayers) {
            response.code = 2;
            response.msg = "Games have a maximum of "+maxPlayers + " players: " + numberOfPlayers + " found"; 
            res.send(response);
            return;
        }

        var inviteCode;
        var searchBool = false;
        while (!searchBool) {
            inviteCode = Math.random().toString(36).substring(2, 10);
            var a = await Game.findOne({actualTurn: -1, inviteCode: inviteCode});
            if (a == null) searchBool = true;
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

    app.post('/joinGame', async (req, res) => {
        
        let response = {};

        const { userId, inviteCode } = req.body;
        if (userId == null || inviteCode == null) {
            response.code = 1;
            response.msg = "Bad Request";
            res.send(response);
            return;
        }
                
        var game = await Game.findOne({inviteCode: inviteCode})
        if (game == null) {
            response.code = 2;
            response.msg = "Game not found for code "+ inviteCode;
            res.send(response);
            return;
        }

        if (game.numberOfPlayers <= game.users.length) {
            response.code = 3;
            response.msg = "Game already full";
            res.send(response);
            return;
        }

        var user = await Account.findById(mongoose.Types.ObjectId(userId), 'username _id');
        if (user == null) {
            response.code = 4;
            response.msg = "No such user with that ID";
            res.send(response);
            return;
        }

        if (await game.users.find(x => x._id === user._id) != null) {
            response.code = 5;
            response.msg = "User already in game";
            res.send(response);
            return;
        }

        game.users.push(user._id);
        await game.save();

        response.code = 0;
        response.msg = "Join Successful";
        response.gameName = game.name;
        res.send(response);

        return;
    });

    app.post('getGames', async (req, res) => {
        
        let response = {};

        
    });
}