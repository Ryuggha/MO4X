const mongoose = require('mongoose');
const { Schema } = mongoose;

const accountSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: String,
    lastAuthentication: Date,
});

mongoose.model('Account', accountSchema);
