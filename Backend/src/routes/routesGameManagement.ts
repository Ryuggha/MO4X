import { Application } from "express";
import mongoose from "mongoose";
import { actionListInterface, moveShip } from "../gameModules/actionsInterface";
import CreateStarSystem from "../dataBaseModules/createStarSystem";
import { dropGame } from "../dataBaseModules/dropGame";
import LoadGame from "../dataBaseModules/LoadGame";
import ObjectId from "../dataBaseModules/ObjectId";
import {createStellarMap} from "../domain/gameGenerator";
import processTurn from "../domain/TurnParser";
const AccountModel = mongoose.model('Account');
import accountSchemaInterface from "../model/AccountModel";
const GameModel = mongoose.model('Game');
import gameSchemaInterface from "../model/GameModel";
import { response } from "./responseInterface";


const maxPlayers = 16;

export = (app: Application) => {

    //Routes

    app.post('/createGame', async (req: any, res) => {

        let response: response = {
            code: -1,
            msg: ""
        }

        const { name, userId, numberOfPlayers } = req.body;
        if (userId == null) {
            response.code = 1;
            response.msg = "No players found";
            res.send(response);
            return;
        }
        var user = await AccountModel.findById(new mongoose.Types.ObjectId(userId), '_id') as accountSchemaInterface;
        if (user == null) {
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

        if (numberOfPlayers < 2) {
            response.code = 3;
            response.msg = "Games have a minimum of 2 players"; 
            res.send(response);
            return;
        }

        var inviteCode;
        var searchBool = false;
        while (!searchBool) {
            inviteCode = Math.random().toString(36).substring(2, 10);
            var a = await GameModel.findOne({actualTurn: -1, inviteCode: inviteCode}) as gameSchemaInterface;
            if (a == null) searchBool = true;
        }

        var newGame = new GameModel({
            name: name,
            numberOfPlayers: numberOfPlayers,
            users: user._id,
            inviteCode: inviteCode,
            stars: [],
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
                
        var game = await GameModel.findOne({inviteCode: inviteCode}) as gameSchemaInterface;
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

        var user = await AccountModel.findById(new mongoose.Types.ObjectId(userId), 'username _id') as accountSchemaInterface;
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

        game.users.push(user._id);
        await game.save();

        response.code = 0;
        response.msg = "Join Successful";
        response.gameName = game.name;
        res.send(response);

        if (game.numberOfPlayers <= game.users.length) {
            let starMap = createStellarMap();
            await CreateStarSystem(starMap, game, game.numberOfPlayers);
            await processTurn(game);
            await game.save();
        }

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

        let games = await GameModel.find({users: new mongoose.Types.ObjectId(userId)}) as gameSchemaInterface[];
        if (games == null) {
            response.code = 1;
            response.msg = "games not found";
            res.send(response);
            return;
        }
        response.games = [];
        let userCache: any = {};
        for (const currentGame of games) {
            let auxUsers = [];
            
            for (const user of currentGame.users) {
                
                let auxUsername = userCache[user.toString()];
                if (auxUsername == null) {
                    auxUsername = (await AccountModel.findById(user, "username") as accountSchemaInterface).username;
                    userCache[user.toString()] = auxUsername.username;
                }
                auxUsers.push(auxUsername);
            }

            response.games.push({
                name: currentGame.name,
                _id: currentGame._id,
                users: auxUsers,
                numberOfPlayers: currentGame.numberOfPlayers,
                inviteCode: currentGame.inviteCode,
                actualTurn: currentGame.actualTurn,
                turnCanBePlayed: getTurnCanBePlayed(new ObjectId(userId), currentGame),
            });
        }
        response.code = 0;
        response.msg = "Games sent";
        res.send(response);
        return;
    });

    app.post('/leaveGame', async (req: any, res) => {
        
        let response: response = {
            code: -1,
            msg: ""
        }

        const { userId, gameId } = req.body;
        if (userId == null || gameId == null) {
            response.code = 1;
            response.msg = "Bad Client Error";
            res.send(response);
            return;
        }

        let user = await AccountModel.findById(new mongoose.Types.ObjectId(userId)) as accountSchemaInterface;
        if (user == null) {
            response.code = 2;
            response.msg = "User Id Unknown";
            res.send(response);
            return;
        }

        let game = await GameModel.findById(new mongoose.Types.ObjectId(gameId)) as gameSchemaInterface;
        if (game == null) {
            response.code = 3;
            response.msg = "Game Id Unknown";
            res.send(response);
            return;
        }

        let i = game.users.indexOf(user._id);
        if (i >= 0) {
            game.users.splice(i, 1);
        }
        await game.save();

        response.code = 0;
        response.msg = "User deleted from game"
        res.send(response);

        if (game.users.length <= 0) {
            await dropGame(game._id);
        }

        return;
    });

    app.post('/loadGame', async (req: any, res) => {
        let response: response = {
            code: -1,
            msg: ""
        }

        const { userId, gameId } = req.body;
        if (userId == null || gameId == null) {
            response.code = 1;
            response.msg = "Bad Client Error";
            res.send(response);
            return;
        }

        let user = await AccountModel.findById(new mongoose.Types.ObjectId(userId)) as accountSchemaInterface;
        if (user == null) {
            response.code = 2;
            response.msg = "User Id Unknown";
            res.send(response);
            return;
        }

        let game = await GameModel.findById(new mongoose.Types.ObjectId(gameId)) as gameSchemaInterface;
        if (game == null) {
            response.code = 3;
            response.msg = "Game Id Unknown";
            res.send(response);
            return;
        }
        
        response.code = 0;
        response.msg = "Game Loaded Successfully";

        response.game = await LoadGame(game);

        response.game.turnCanBePlayed = getTurnCanBePlayed(user._id, game);
        res.send(response);

        return;
    });

    app.post('/endTurn', async (req: any, res) => {
        let response: response = {
            code: -1,
            msg: "",
        };

        const actionList = JSON.parse(req.body.actionList) as actionListInterface;
        
        let game = await GameModel.findById(new ObjectId(actionList.gameId)) as gameSchemaInterface;

        if (getTurnCanBePlayed(new ObjectId(actionList.userId), game)) {
            game.turnCacheList.push(req.body.actionList);
            await game.save();
        }
        

        if (game.turnCacheList != null && game.users != null && game.turnCacheList.length >= game.users.length) {
            await processTurn(game);
        }
        

        res.send(response);
        return;
    });

    function getTurnCanBePlayed(userId: ObjectId, game: gameSchemaInterface): boolean {
        let turnCanBePlayed = game.actualTurn != null ? game.actualTurn >= 0 : false;
        if (turnCanBePlayed && game.turnCacheList != null) {
            for (let turnIndex = 0; turnIndex < game.turnCacheList.length; turnIndex++) {
                let jsonTurn = JSON.parse(game.turnCacheList[turnIndex]) as actionListInterface;
                if (userId.equals(new ObjectId(jsonTurn.userId))) {
                    turnCanBePlayed = false;
                    break;
                }
            }
        }
        return turnCanBePlayed;
    }
}