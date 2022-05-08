import { Application } from "express";
import mongoose from "mongoose";
import { dropGame } from "./dataBaseModules/dropGame";

export = (app: Application) => {
    app.get('/test', async (req: any, res) => {

        //Start Test Here

        await dropGame(new mongoose.Types.ObjectId('627705b6f843ae8f17cf762a'));
        console.log('drop complete...');

        //End of test
        res.send({msg: 'nice'});
        return;
        
    });
}

