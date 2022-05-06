import mongoose  from "mongoose";
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

export default interface accountSchemaInterface extends mongoose.Document {
    username: string,
    password: string,
    email?: string,
    lastAuthentication?: number
}
