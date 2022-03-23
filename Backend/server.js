const express = require('express');
const app = express();
const keys = require('./config/keys.js')
const mongoose = require('mongoose');

// Setting Up DB
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
