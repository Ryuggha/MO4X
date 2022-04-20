const mongoose = require('mongoose');
const Account = mongoose.model('accounts');
const { response } = require('express');

module.exports = app => {

    //Routes
    app.post('/createGame', async (req, res) => {
        
        let = response = {}

        const { users } = req.body;
        if (users === null || users.length) {
            response.code = 1;
            response.msg = "No players found";
            res.send(response);
            return;
        }

        var newGame = new Game({
            stars: ["a", "b"],
            users: users,
            actualTurn: -1
        })
        await newGame.save();
        response.code = 0;
        response.msg = "Game Created";
        res.send(response);
        return;
    });
}