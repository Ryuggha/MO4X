import { Application } from "express";
import mongoose from "mongoose";
import { dropGame } from "./dataBaseModules/dropGame";

export = (app: Application) => {
    app.get('/test', async (req: any, res) => {

        //Start Test Here

        await dropGame(new mongoose.Types.ObjectId('62955179aed20f153a922a1e'));
        console.log('drop complete...');

        //End of test
        res.send({msg: 'nice'});
        return;
        
    });
}

