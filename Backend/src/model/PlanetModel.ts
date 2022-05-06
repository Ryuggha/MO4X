import mongoose from "mongoose";
const { Schema } = mongoose;

const planetSchema = new Schema({
    name: String,
    planetType: {
        type: String,
        enum: [ 'terrestrial',
            'gaseous']
    },
    mass: Number,
    radius: Number,
    energy: {
        type: Number,
        default: 0,
    }
    //Ships
    //Techs
    //Buildings
});

mongoose.model('Planet', planetSchema);

export default interface PlanetSchemaInterface extends mongoose.Document {
    name?: string,
    planetType: string,
    mass: number,
    radius: number,
    energy?: number,
    // Rest of Things
}