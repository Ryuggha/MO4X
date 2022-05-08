import mongoose from "mongoose";
let PlanetType = require("../gameModules/PlannetType");
import SpaceLocation from "../gameModules/SpaceLocation";
let StarType = require("../gameModules/StarType");
import gameSchemaInterface from "../model/GameModel";
import OrbitSchemaInterface from "../model/OrbitModel";
import PlanetSchemaInterface from "../model/PlanetModel";
import StarSchemaInterface from "../model/StarModel";
const GameModel = mongoose.model('Game');
const StarModel = mongoose.model('Star');
const OrbitModel = mongoose.model('Orbit');
const PlanetModel = mongoose.model('Planet');

export default async function CreateStarSystem (starMap: SpaceLocation[], game: gameSchemaInterface) {
    let starIdArray: mongoose.Types.ObjectId[] = [];

    let orbitsToSave: OrbitSchemaInterface[] = [];
    let planetsToSave: PlanetSchemaInterface[] = [];
    let starsToSave: StarSchemaInterface[] = [];

    for (const l of starMap) {
        
        let starOrbitsIdArray: mongoose.Types.ObjectId[] = [];

        for (const orbit of l.star.orbits) {
            let orbitModel = new OrbitModel({
                _id: new mongoose.Types.ObjectId(),
                index: orbit.orbitIndex,
                orbitalQ: orbit.orbitEnergyQuoficient
            }) as OrbitSchemaInterface;

            if (orbit.planet != null) {
                let planetModel = new PlanetModel({
                    _id: new mongoose.Types.ObjectId(),
                    name: orbit.planet.name,
                    planetType: PlanetType[orbit.planet.typeOfPlannet],
                    mass: orbit.planet.mass,
                    radius: orbit.planet.radius
                }) as PlanetSchemaInterface;
                planetsToSave.push(planetModel);

                orbitModel.planet = planetModel._id;
            }

            orbitsToSave.push(orbitModel);

            starOrbitsIdArray.push(orbitModel._id); // delete
        }

        let starModel = new StarModel({
            _id: new mongoose.Types.ObjectId(),
            name: l.star.name,
            xPos: l.location.x,
            yPos: l.location.y,
            mass: l.star.mass,
            radius: l.star.radius,
            energyQ: l.star.energyQuoficient,
            starType: StarType[l.star.type],
            orbits: starOrbitsIdArray,
        }) as StarSchemaInterface;
        starsToSave.push(starModel);

        if (game.stars == null) game.stars = [];
        game.stars.push(starModel._id);
    }

    await PlanetModel.bulkSave(planetsToSave);
    await OrbitModel.bulkSave(orbitsToSave);
    await StarModel.bulkSave(starsToSave);

    await game.save();
}