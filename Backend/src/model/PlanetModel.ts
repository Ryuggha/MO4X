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
    },
    
    technologies: [{
        type: String,
        default: [],
    }],
    buildings: [{
        type: String,
        default: [],
    }],

    //Ships
});

mongoose.model('Planet', planetSchema);

export default interface PlanetSchemaInterface extends mongoose.Document {
    name?: string,
    planetType: string,
    mass: number,
    radius: number,
    energy?: number,
    technologies: [string],
    buildings: [string],
    // Rest of Things
}