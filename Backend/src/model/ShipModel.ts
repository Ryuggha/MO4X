import mongoose from "mongoose";
const { Schema } = mongoose;

const shipSchema = new Schema({
    name: String,
    type: Number,
    modules: [{
        type: String,
        default: [],
    }]
});

mongoose.model('Ship', shipSchema);

export default interface ShipSchemaInterface extends mongoose.Document {
    name?: string,
    type: number,
    modules: string[],
}