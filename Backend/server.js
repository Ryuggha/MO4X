const express = require('express');
const app = express();
const keys = require('./config/keys.js')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const argon = require('argon2-ffi').argon2i;
const crypto = require('crypto');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false}));

// Setting Up DB
mongoose.connect(keys.mongoURI, {useNewUrlParser: true, useUnifiedTopology: true});

//Setup database models
require('./model/Account');
require('./model/Game');

//Setup the Routes
require('./routes/routesAuthentication')(app);
require('./routes/routesGameManagement')(app);

// Listen
const port = keys.port;
app.listen(port, () => {
    console.log("Listening on port: " + port);
})
