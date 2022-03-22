const express = require('express');
const keys = require('./config/keys.js')

const app = express();

// Setting Up DB
const mongoose = require('mongoose');
mongoose.connect(keys.mongoURI, {useNewUrlParser: true, useUnifiedTopology: true});

//Setup database models
require('./model/Account');

//Setup the Routes
require('./routes/routesAuthentication')(app);

// Listen
const port = keys.port;
app.listen(port, () => {
    console.log("Listening on " + port);
})
