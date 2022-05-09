import { Application } from "express";
import mongoose from "mongoose";
import { dropGame } from "./dataBaseModules/dropGame";

export = (app: Application) => {
    app.get('/test', async (req: any, res) => {

        //Start Test Here

        await dropGame(new mongoose.Types.ObjectId('6279420c33f4a4730d6cd9d8'));
        console.log('drop complete...');

        //End of test
        res.send({msg: 'nice'});
        return;
        
    });
}

