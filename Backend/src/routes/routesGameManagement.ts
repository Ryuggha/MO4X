import { Application } from "express";
import mongoose from "mongoose";
import gameGenerator from "../Domain/gameGenerator";
const AccountModel = mongoose.model('Account');
import account from "../model/Account";
const GameModel = mongoose.model('Game');
import game from "../model/Game";
import { response } from "./responseInterface";


const maxPlayers = 16;

export = (app: Application) => {

    //Routes

    app.post('/createGame', async (req: any, res) => {

        let response: response = {
            code: -1,
            msg: ""
        }

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
            var a = await GameModel.findOne({actualTurn: -1, inviteCode: inviteCode}) as game;
            if (a == null) searchBool = true;
        }

        var newGame = new GameModel({
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

    app.post('/joinGame', async (req: any, res) => {
        
        let response: response = {
            code: -1,
            msg: ""
        }

        const { userId, inviteCode } = req.body;
        if (userId == null || inviteCode == null) {
            response.code = 1;
            response.msg = "Bad Request";
            res.send(response);
            return;
        }
                
        var game = await GameModel.findOne({inviteCode: inviteCode}) as game;
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

        var user = await AccountModel.findById(new mongoose.Types.ObjectId(userId), 'username _id') as account;
        if (user == null) {
            response.code = 4;
            response.msg = "No such user with that ID";
            res.send(response);
            return;
        }

        if (game.users.find(x => x._id.equals(user._id)) != null) {
            response.code = 5;
            response.msg = "User already in game";
            res.send(response);
            return;
        }

        response.code = 0;
        response.msg = "Join Successful";
        response.gameName = game.name;
        res.send(response);

        if (game.numberOfPlayers <= game.users.length) {
            gameGenerator.createStellarMap();
        }

        game.users.push(user._id);
        await game.save();

        return;
    });

    app.post('/getGames', async (req: any, res) => {

        let response: response = {
            code: -1,
            msg: ""
        }

        const { userId } = req.body;
        if (userId == null) {
            response.code = 2;
            response.msg = "Bad Client Error";
            res.send(response);
            return;
        }

        let games = await GameModel.find({users: new mongoose.Types.ObjectId(userId)}, "name users inviteCode actualTurn _id numberOfPlayers") as game[];
        if (games == null) {
            response.code = 1;
            response.msg = "games not found";
            res.send(response);
            return;
        }
        response.games = [];
        let auxUsers = [];

        for (const currentGame of games) {
            
            let userCache: any = {};

            for (const user of currentGame.users) {
                let auxUserString = user.toString();
                let auxUsername = userCache[user.toString()];
                if (auxUsername == null) {
                    auxUsername = await AccountModel.findById(user, "username") as account;
                    userCache[user.toString()] = auxUsername.username;
                }
                auxUsers.push(auxUsername.username);
            }
            response.games.push({
                name: currentGame.name,
                _id: currentGame._id,
                users: auxUsers,
                numberOfPlayers: currentGame.numberOfPlayers,
                inviteCode: currentGame.inviteCode,
                actualTurn: currentGame.actualTurn
            });
        }
        response.code = 0;
        response.msg = "Games sent";
        res.send(response);
        return;
    });
}