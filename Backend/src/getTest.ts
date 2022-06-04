import { Application } from "express";
import mongoose from "mongoose";
import { dropGame } from "./dataBaseModules/dropGame";
import ObjectId from "./dataBaseModules/ObjectId";
const GameSchema = mongoose.model("Game");

export = (app: Application) => {
    app.get('/test', async (req: any, res) => {

        //Start Test Here

        await dropGame(new ObjectId("629a40d181d002ab182e7441"));





        //End of test
        res.send({msg: 'nice'});
        return;
    });
}

