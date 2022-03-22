const express = require('express');
const keys = require('./config/keys.js')

const app = express();

const mongoose = require('mongoose');
mongoose.connect(keys.mongoURI, {useNewUrlParser: true, useUnifiedTopology: true});

const port = keys.port;
app.listen(port, () => {
    console.log("Listening on " + port);
})
