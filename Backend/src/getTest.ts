import { Application } from "express";
import mongoose from "mongoose";
import { dropGame } from "./dataBaseModules/dropGame";

export = (app: Application) => {
    app.get('/test', async (req: any, res) => {

        //Start Test Here

        await dropGame(new mongoose.Types.ObjectId('627491cc61c06145d77d783f'));

        //End of test
        res.send();
        return;
        
    });
}

