import mongoose from "mongoose";
const AccountModel = mongoose.model('Account');
import account from "../model/Account";  
const argon = require('argon2-ffi').argon2i;
import crypto from 'crypto';
import { Application } from "express";
import { response } from "./responseInterface";

const passwordRegex = new RegExp("(?=.*[A-Za-z])(?=.*[0-9])(?=.{5,32})");

export = (app: Application) => {

    //Routes
    app.post('/login', async (req: any, res) => {

        let response: response = {
            code: -1,
            msg: ""
        }

        const {username, password} = req.body;
        if (username == null || password == null) {
            response.code = 1;
            response.msg = "Invalid Credentials"
            res.send(response);
            return;
        }

        let userAccount = await AccountModel.findOne({ username: username }, 'username password _id') as account;
        if (userAccount == null) {
            response.code = 1;
            response.msg = "Invalid Credentials"
            res.send(response);
            return;
        } else {
            argon.verify(userAccount.password, password).then(async (success: boolean) => {
                if (success) {
                    userAccount.lastAuthentication = Date.now();
                    await userAccount.save();
                    response.code = 0;
                    response.msg = "LogIn Successful";
                    response.gameAccount = (({_id ,username}) => ({_id, username}))(userAccount);
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

        app.post('/singin', async (req, res) => {
        
            console.log("----");
            let response: response = {
                code: -1,
                msg: ""
            }
    
            const {username, password, email} = req.body;
            if (email == null) {
                response.code = 1;
                response.msg = "Invalid Credentials"
                res.send(response);
                return;
            }
    
            if (username == null || username.length < 3 || username.length > 24) {
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
    
            let findEmailAccountOnDB = await AccountModel.findOne({ email: email }, 'email') as account;
            if (findEmailAccountOnDB != null) {
                response.code = 2;
                response.msg = "This email already exists"
                res.send(response);
                return;
            }
    
            let findUsernameAccountOnDB = await AccountModel.findOne({ username: username }, 'username') as account;
            if (findUsernameAccountOnDB != null) {
                response.code = 3;
                response.msg = "This username already exists"
                res.send(response);
                return;
            }
            
            // Generate a unique access token
            crypto.randomBytes(32, function(err, salt) {
                argon.hash(password, salt).then(async (hash: any) => {
    
                    var newAccount = new AccountModel({
                        username: username,
                        password: hash,
                        email: email,
                        lastAuthentication: Date.now(),
                    });
                    await newAccount.save();
                    response.code = 0;
                    response.msg = "Sing In Successful"
                    response.gameAccount = { username: username };
                    res.send(response);
                    return;
                });
            });
            
            return;
        })
    })
}