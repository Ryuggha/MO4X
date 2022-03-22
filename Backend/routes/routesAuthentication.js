const mongoose = require('mongoose');
const Account = mongoose.model('accounts');

module.exports = app => {

    // Routes
    app.get('/account', async (req, res) => {

        const { reqUsername, reqPassword } = req.query;
        if (reqUsername == null || reqPassword == null) {
            res.send("Invalid Credentials");
            return;
        }

        var userAccount = await Account.findOne({ username: reqUsername });
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
            else {
                res.send("Invalid Credentials");
                return;
            }
        }
    });
}

