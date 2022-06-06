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
    investigationTechnologies: [{
        type: String,
        default: []
    }],
    investigationTechnologiesDescription: [{
        type: String,
        default: []
    }],
    technologyBeingInvestigated: {
        type: String,
        default: "",
    },
    turnsToFinishInvestigation: {
        type: Number,
        get: (v: number) => Math.round(v),
        set: (v: number) => Math.round(v),
        alias: 'i',
        required: true,
        default: -1,
    },
    maxTierOfInvestigation: [{
        type: Number,
        get: (v: number) => Math.round(v),
        set: (v: number) => Math.round(v),
        alias: 'i',
        required: true,
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
    investigationTechnologies: [string],
    investigationTechnologiesDescription: [string],
    technologyBeingInvestigated: string,
    turnsToFinishInvestigation: number,
    maxTierOfInvestigation: [number],
    // Rest of Things
}