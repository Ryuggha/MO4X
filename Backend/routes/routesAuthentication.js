const mongoose = require('mongoose');
const Account = mongoose.model('Account');

const argon = require('argon2-ffi').argon2i;
const crypto = require('crypto');
const { response } = require('express');

const passwordRegex = new RegExp("(?=.*[A-Za-z])(?=.*[0-9])(?=.{5,32})");

module.exports = app => {

    // Routes
    app.post('/login', async (req, res) => {
        
        let response = {}

        const { reqUsername, reqPassword } = req.body;
        if (reqUsername === null || reqPassword === null) {
            response.code = 1;
            response.msg = "Invalid Credentials"
            res.send(response);
            return;
        }

        let userAccount = await Account.findOne({ username: reqUsername }, 'username password');
        if (userAccount === null) {
            response.code = 1;
            response.msg = "Invalid Credentials"
            res.send(response);
            return;
        } else {
            argon.verify(userAccount.password, reqPassword).then(async (success) => {
                if (success) {
                    userAccount.lastAuthentication = Date.now();
                    await userAccount.save();
                    response.code = 0;
                    response.msg = "LogIn Successful";
                    response.gameAccount =  (({_id ,username}) => ({_id, username}))(userAccount);
                    res.send(response);
                    return;
                }
                else {
                    response.code = 1;
                    response.msg = "Invalid Credentials"
                    res.send(response);
                    return;
                }
            });
        }
    });

    app.post('/singin', async (req, res) => {
        
        let response = {}

        const {username, password, email} = req.body;
        if (email === null) {
            response.code = 1;
            response.msg = "Invalid Credentials"
            res.send(response);
            return;
        }

        if (username === null || username.length < 3 || username.length > 24) {
            response.code = 1;
            response.msg = "Invalid Credentials"
            res.send(response);
            return;
        }

        if (!passwordRegex.test(password)) {
            response.code = 4;
            response.msg = "Unsafe Password"
            res.send(response);
            return;
        }

        let findEmailAccountOnDB = await Account.findOne({ email: email }, 'email')
        if (findEmailAccountOnDB !== null) {
            response.code = 2;
            response.msg = "This email already exists"
            res.send(response);
            return;
        }

        let findUsernameAccountOnDB = await Account.findOne({ username: username }, 'username')
        if (findUsernameAccountOnDB !== null) {
            response.code = 3;
            response.msg = "This username already exists"
            res.send(response);
            return;
        }
        
        // Generate a unique access token
        crypto.randomBytes(32, function(err, salt) {
            argon.hash(password, salt).then(async (hash) => {

                var newAccount = new Account({
                    username: username,
                    password: hash,
                    email: email,
                    lastAuthentication: Date.now(),
                });
                await newAccount.save();
                response.code = 0;
                response.msg = "Sing In Successful"
                response.gameAccount = (({username}) => ({username}))(newAccount);
                res.send(response);
                return;
            });
        });
        
        return;
    })
}

