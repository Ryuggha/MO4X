import mongoose from "mongoose";
import PlanetType from "../gameModules/PlannetType";
import Random from "../gameModules/Random";
import SpaceLocation from "../gameModules/SpaceLocation";
import Star from "../gameModules/Star";
import StarType from "../gameModules/StarType";
import gameSchemaInterface from "../model/GameModel";
import OrbitSchemaInterface from "../model/OrbitModel";
import PlanetSchemaInterface from "../model/PlanetModel";
import StarSchemaInterface from "../model/StarModel";
const StarModel = mongoose.model('Star');
const OrbitModel = mongoose.model('Orbit');
const PlanetModel = mongoose.model('Planet');

export default async function CreateStarSystem (starMap: SpaceLocation[], game: gameSchemaInterface, numberOfPlayers: number) {

    let initialPlayerSystems = setInitialPlayerSystems(starMap, numberOfPlayers);
    let homeSystemsAssigned = 0;

    let orbitsToSave: OrbitSchemaInterface[] = [];
    let planetsToSave: PlanetSchemaInterface[] = [];
    let starsToSave: StarSchemaInterface[] = [];

    for (let l = 0; l < starMap.length; l++) {
        
        let starOrbitsIdArray: mongoose.Types.ObjectId[] = [];

        for (const orbit of starMap[l].star.orbits) {
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
            name: starMap[l].star.name,
            xPos: starMap[l].location.x,
            yPos: starMap[l].location.y,
            mass: starMap[l].star.mass,
            radius: starMap[l].star.radius,
            energyQ: starMap[l].star.energyQuoficient,
            starType: starTypeToString(starMap[l].star.type),
            orbits: starOrbitsIdArray,
        }) as StarSchemaInterface;
        if (initialPlayerSystems.includes(l)) {
            starModel.userController = game.users[homeSystemsAssigned];
            homeSystemsAssigned++;
        }
        
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


function setInitialPlayerSystems(starMap: SpaceLocation[], numberOfPlayers: number): number[] {
    let minimumDistanceBetweenPlayerHomes = 15;

    let homeSystems: number[] = [];

    for (let i = 0; i < numberOfPlayers; i++) {
        let homeSetted = false;
        let numberOfTries = 0;
        let starIndex = -1;

        while (!homeSetted) {
            starIndex = Random.randomInt(0, starMap.length - 1);
            
            homeSetted = true;
            for (let j = 0; j < homeSystems.length; j++) {
                if ((starMap[starIndex].location.minus(starMap[homeSystems[j]].location)).magnitude() < minimumDistanceBetweenPlayerHomes) {
                    
                    homeSetted = false;
                }
            }
            if (!homeSetted) minimumDistanceBetweenPlayerHomes -= 0.01
        }
        let auxLocation = starMap[starIndex].location;
        starMap[starIndex] = new SpaceLocation(auxLocation, new Star(true));
        homeSystems.push(starIndex);  
    }

    return homeSystems;
}
