import { Application } from "express";
import { dropGame } from "./dataBaseModules/dropGame";

export = (app: Application) => {
    app.get('/test', async (req: any, res) => {

        //Start Test Here



        //End of test
        res.send();
        return;
        
    });
}

