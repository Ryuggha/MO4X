import mongoose from "mongoose";
let PlanetType = require("../gameModules/PlannetType");
import SpaceLocation from "../gameModules/SpaceLocation";
let StarType = require("../gameModules/StarType");
import gameSchemaInterface from "../model/GameModel";
import OrbitSchemaInterface from "../model/OrbitModel";
const GameModel = mongoose.model('Game');
const StarModel = mongoose.model('Star');
const OrbitModel = mongoose.model('Orbit');
const PlanetModel = mongoose.model('Planet');

export default async function CreateStarSystem (starMap: SpaceLocation[], game: gameSchemaInterface) {
    let starIdArray: mongoose.Types.ObjectId[] = [];
    for (const l of starMap) {
        
        let starOrbitsIdArray: mongoose.Types.ObjectId[] = [];

        for (const orbit of l.star.orbits) {
            let orbitModel = new OrbitModel({
                index: orbit.orbitIndex,
                orbitalQ: orbit.orbitEnergyQuoficient
            }) as OrbitSchemaInterface;

            if (orbit.planet != null) {
                let planetModel = new PlanetModel({
                    name: orbit.planet.name,
                    planetType: PlanetType[orbit.planet.typeOfPlannet],
                    mass: orbit.planet.mass,
                    radius: orbit.planet.radius
                });
                orbitModel.planet = (await planetModel.save())._id;
            }

            starOrbitsIdArray.push((await orbitModel.save()).id);
        }

        let model = new StarModel({
            name: l.star.name,
            xPos: l.location.x,
            yPos: l.location.y,
            mass: l.star.mass,
            radius: l.star.radius,
            energyQ: l.star.energyQuoficient,
            starType: StarType[l.star.type],
            orbits: starOrbitsIdArray,
        });

        if (game.stars == null) game.stars = [];
        game.stars.push((await model.save())._id);
    }

    await game.save();
}