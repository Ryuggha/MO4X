import express from 'express';
const app = express();
import keys from './config/keys';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import { ConnectionOptions } from 'tls';

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// Setting Up DB
mongoose.connect(keys.mongoURI, {useNewUrlParser: true, useUnifiedTopology: true} as ConnectionOptions);

// Setup database models
require('./model/Account');
require('./model/Game');

//Setup the Routes
require('./routes/routesAuthentication')(app);
require('./routes/routesGameManagement')(app);

// Listen
const port = keys.port;
app.listen(port, () => {
    console.log("Listening on port: " + port);
});