import mongoose from "mongoose";
const { Schema } = mongoose;

const starSchema = new Schema({
    name: String,
    xPos: Number,
    yPos: Number,
    starType: {
        type: String,
        enum : ['RedDwarf',
            'YellowDwarf',
            'BlueGiant',
            'RedGiant',
            'NeutronStar',
            'BlackHole',
            'BlockHoleAccDisc',
            'BinarySystem']
    },
    mass: Number,
    radius: Number,
    energyQ: Number,
    orbits: [{
        type: mongoose.Types.ObjectId, ref: 'StarType',
        default: [],
    }],
    userController: {
        type: mongoose.Types.ObjectId, ref: 'Account',
        required: false,
    }
});

mongoose.model('Star', starSchema);

export default interface StarSchemaInterface extends mongoose.Document {
    name: string,
    xPos: number,
    yPos: number,
    starType: string,
    mass: number,
    radius: number,
    energyQ: number,
    orbits: mongoose.Types.ObjectId[],
    userController?: mongoose.Types.ObjectId
}
