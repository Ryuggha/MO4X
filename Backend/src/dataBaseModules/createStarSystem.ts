import mongoose from "mongoose";
import PlanetType from "../gameModules/PlannetType";
import SpaceLocation from "../gameModules/SpaceLocation";
import StarType from "../gameModules/StarType";
import gameSchemaInterface from "../model/GameModel";
import OrbitSchemaInterface from "../model/OrbitModel";
import PlanetSchemaInterface from "../model/PlanetModel";
import StarSchemaInterface from "../model/StarModel";
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
                    planetType: planetTypeToString(orbit.planet.typeOfPlanet),
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
            starType: starTypeToString(l.star.type),
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

function starTypeToString(t: StarType): string {
    if (t === StarType.RedDwarf) return 'RedDwarf'
    if (t === StarType.YellowDwarf) return 'YellowDwarf'
    if (t === StarType.BlueGiant) return 'BlueGiant'
    if (t === StarType.RedGiant) return 'RedGiant'
    if (t === StarType.NeutronStar) return 'NeutronStar'
    if (t === StarType.BlackHole) return 'BlackHole'
    if (t === StarType.BlockHoleAccDisc) return 'BlockHoleAccDisc'
    if (t === StarType.BinarySystem) return 'BinarySystem'
    return "Unknown StarType";
}

function planetTypeToString(t: PlanetType): string {
    if (t === PlanetType.terrestrial) return 'terrestrial'
    if (t === PlanetType.gaseous) return 'gaseous'
    return "Unknown PlanetType"
}