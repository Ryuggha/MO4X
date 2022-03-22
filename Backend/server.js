const express = require('express');
const keys = require('./config/keys.js')

const app = express();

// Setting Up DB
const mongoose = require('mongoose');
mongoose.connect(keys.mongoURI, {useNewUrlParser: true, useUnifiedTopology: true});

//Setip database models
require('./model/Account')
const Account = mongoose.model('accounts');

// Routes
app.get('/account', async (req, res) => {

    const { reqUsername, reqPassword} = req.query;
    if (reqUsername == null || reqPassword == null) {
        res.send("Invalid Credentials");
        return;
    }

    var userAccount = await Account.findOne( {username : reqUsername} );
    if (userAccount == null) {
        var newAccount = new Account({
            username: reqUsername,
            password: reqPassword,

            lastAuthentication: Date.now()
        });
        await newAccount.save();

        res.send(newAccount);
        return;
    } else {
        if (reqPassword == userAccount.password) {
            userAccount.lastAuthentication = Date.now();
            await userAccount.save();
            res.send(userAccount)
            return;
        }
    }
});

// Listen
const port = keys.port;
app.listen(port, () => {
    console.log("Listening on " + port);
})
