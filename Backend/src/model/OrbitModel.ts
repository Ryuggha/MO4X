import mongoose from "mongoose";
const { Schema } = mongoose;

const orbitSchema = new Schema({
    index: { //integer
        type: Number,
        get: (v: number) => Math.round(v),
        set: (v: number) => Math.round(v),
        alias: 'i',
        required: true,
    },
    orbitalQ: Number,
    planet: {
        type: mongoose.Types.ObjectId, ref: 'Planet',
        requred: false
    }
});

mongoose.model('Orbit', orbitSchema);

export default interface OrbitSchemaInterface extends mongoose.Document {
    index: number,
    orbitalQ: number,
    planet: mongoose.Types.ObjectId,
}
