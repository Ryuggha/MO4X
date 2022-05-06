import mongoose  from "mongoose";
const { Schema } = mongoose;

const gameSchema = new Schema({
    name: String,
    numberOfPlayers: { //integer
        type: Number,
        get: (v: number) => Math.round(v),
        set: (v: number) => Math.round(v),
        alias: 'i',
        required: true,
    },
    users: [{
        type: mongoose.Types.ObjectId, ref: 'Account',
        default: [],
    }],
    inviteCode: String,
    stars: Array,
    turnCacheList: {
        type: Array,
        default: []
    },
    actualTurn: {
        type: Number,
        get: (v: number) => Math.round(v),
        set: (v: number) => Math.round(v),
        alias: 'i'
    }
});

mongoose.model('Game', gameSchema);

export default interface gameSchemaInterface extends mongoose.Document {
    name?: string,
    numberOfPlayers: number,
    users: mongoose.Types.ObjectId[],
    inviteCode?: string,
    stars?: mongoose.Types.ObjectId[],
    //turnCacheList: turn[],
    actualTurn?: number
};