const mongoose = require('mongoose');
const { Schema } = mongoose;

const gameSchema = new Schema({
    stars: Array,
    users: Array,
    turnCacheList: {
        type: Array,
        default: []
    },
    actualTurn: int
});

mongoose.model('Account', accountSchema);
