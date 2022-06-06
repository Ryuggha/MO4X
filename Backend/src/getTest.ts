import { Application } from "express";
import mongoose from "mongoose";
import { actionListInterface, changeStarName, moveShip } from "./gameModules/actionsInterface";
import { dropGame } from "./dataBaseModules/dropGame";
import ObjectId from "./dataBaseModules/ObjectId";
import processTurn from "./domain/TurnParser";
import gameSchemaInterface from "./model/GameModel";
import PlanetSchemaInterface from "./model/PlanetModel";
const GameSchema = mongoose.model("Game");
const PlanetSchema = mongoose.model("Planet");

export = (app: Application) => {
    app.get('/test', async (req: any, res) => {

        //Start Test Here

        await dropGame(new ObjectId("629e3d9af5f147b5d786a474"));
        await dropGame(new ObjectId("629e3f183f85ad2cc9d0476d"));
        await dropGame(new ObjectId("629e3f319002d644f52b7da5"));

        //End of test
        res.send({msg: 'nice'});
        return;
    });
}

