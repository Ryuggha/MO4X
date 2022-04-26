const mongoose = require('mongoose');
const { Schema } = mongoose;

const gameSchema = new Schema({
    name: String,
    numberOfPlayers: { //integer
        type: Number,
        get: v => Math.round(v),
        set: v => Math.round(v),
        alias: 'i'
    },
    users: Array,
    inviteCode: String,
    stars: Array,
    turnCacheList: {
        type: Array,
        default: []
    },
    actualTurn: {
        type: Number,
        get: v => Math.round(v),
        set: v => Math.round(v),
        alias: 'i'
    }
});

mongoose.model('Game', gameSchema);
