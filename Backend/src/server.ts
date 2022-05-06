import express from 'express';
const app = express();
import keys from './config/keys';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import { ConnectionOptions } from 'tls';

import { dropGame } from './dataBaseModules/dropGame';

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// Setting Up DB
mongoose.connect(keys.mongoURI, {useNewUrlParser: true, useUnifiedTopology: true} as ConnectionOptions);

// Setup database models
require('./model/AccountModel');
require('./model/GameModel');
require('./model/StarModel');
require('./model/OrbitModel');
require('./model/PlanetModel');

//Setup the Routes
require('./routes/routesAuthentication')(app);
require('./routes/routesGameManagement')(app);

//Test route
require('./getTest')(app);

// Listen
const port = keys.port;
app.listen(port, () => {
    console.log("Listening on port: " + port);
});
