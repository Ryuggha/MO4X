import { Application } from "express";
import mongoose from "mongoose";
import { actionListInterface, changeStarName, moveShip } from "./gameModules/actionsInterface";
import { dropGame } from "./dataBaseModules/dropGame";
import ObjectId from "./dataBaseModules/ObjectId";
import processTurn from "./domain/TurnParser";
import gameSchemaInterface from "./model/GameModel";
const GameSchema = mongoose.model("Game");

export = (app: Application) => {
    app.get('/test', async (req: any, res) => {

        //Start Test Here

        await dropGame(new ObjectId("629c023500ffcb192d96c26f"));
        
        await dropGame(new ObjectId("629c031400ffcb192d975691"));

        //End of test
        res.send({msg: 'nice'});
        return;
    });
}

