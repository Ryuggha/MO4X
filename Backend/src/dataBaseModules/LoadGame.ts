import mongoose from "mongoose";
import accountSchemaInterface from "../model/AccountModel";
import gameSchemaInterface from "../model/GameModel";
import OrbitSchemaInterface from "../model/OrbitModel";
import PlanetSchemaInterface from "../model/PlanetModel";
import StarSchemaInterface from "../model/StarModel";
import ObjectId from "./ObjectId";
const AccountModel = mongoose.model('Account');
const StarModel = mongoose.model('Star');
const OrbitModel = mongoose.model('Orbit');
const PlanetModel = mongoose.model('Planet');

export default async function LoadGame(game: gameSchemaInterface): Promise<any> {

    console.log("Pending of Implementation: It has to load only what the player may need");

    let userMap = new Map<string, string>();

    let accounts = await AccountModel.find({_id: {$in: game.users}}) as accountSchemaInterface[];

    for (const account of accounts) {
        userMap.set(account._id.toString(), account.username);
    }

    let r = new GameResponse(game);
    await r.init(game, userMap);
    return r;

}

class GameResponse {
    name: string;
    _id: string;
    numberOfPlayers: number;
    actualTurn: number;
    stars: StarResponse[];

    constructor (game: gameSchemaInterface) {
        this.name = game.name == null? "" : game.name;
        this._id = game._id;
        this.numberOfPlayers = game.numberOfPlayers;
        this.actualTurn = game.actualTurn == null? -2: game.actualTurn;
        this.stars = [];
    }

    async init (game: gameSchemaInterface, userMap: Map<string, string>) {
        let auxStars = await StarModel.find({_id: {$in: game.stars}}) as StarSchemaInterface[];

        let orbitIdList: ObjectId[] = [];

        for (const star of auxStars) {
            orbitIdList = orbitIdList.concat(star.orbits);
        }

        let orbitInterfaces = await OrbitModel.find({_id: {$in: orbitIdList}}) as OrbitSchemaInterface[];

        let orbitMap = new Map<string, OrbitSchemaInterface>(
             orbitInterfaces.map(o => {
                 return [o._id.toString(), o]
             }));
        let planetIdList: ObjectId[] = [];

        for (const orbit of orbitMap.values()) {
            if (orbit.planet != null) planetIdList.push(orbit.planet);
        }

        let planetMap = new Map<string, PlanetSchemaInterface>(
            (await PlanetModel.find({_id: {$in: planetIdList}}) as PlanetSchemaInterface[]).map(o => {
                return [o._id.toString(), o]
            })); 
        
        // Populate

        for (const star of auxStars) {
            let starResponse = new StarResponse(star, userMap);
            
            for (const orbit of star.orbits) {
                
                let auxOrbit = orbitMap.get(orbit.toString());
                if (auxOrbit != null) {
                    let orbitResponse = new OrbitResponse(starResponse, auxOrbit);
                    
                    
                    if (auxOrbit.planet != null && planetMap.get(auxOrbit.planet.toString()) != null) {
                        orbitResponse.planet = new PlanetResponse(planetMap.get(auxOrbit.planet.toString())!);
                    }
                    
                    starResponse.orbits.push(orbitResponse);
                }
            }

            this.stars.push(starResponse);
        }
    }
}

class StarResponse {
    _id: string;
    name: string;
    xPos: number;
    yPos: number;
    starType: string;
    mass: number;
    radius: number;
    energyEmission = 0;
    orbits: OrbitResponse[];
    owner = "";

    constructor (star: StarSchemaInterface, userMap: Map<string, string>) {
            this._id = star._id.toString();
            this.name = star.name;
            this.xPos = star.xPos;
            this.yPos = star.yPos;
            this.starType = star.starType;
            this.mass = star.mass;
            this.radius = star.radius;
            this.energyEmission = (star.energyQ * star.mass) / star.radius;
            this.orbits = [];
            let userId = star.userController;
            if (userId == null) this.owner = "";
            else {
                let auxUsernameFromMap = userMap.get(userId.toString());
                this.owner = auxUsernameFromMap != null? auxUsernameFromMap : "";
            }
    }
}

class OrbitResponse {
    index: number;
    energyRecieved = 0;
    planet?: PlanetResponse;

    constructor (star: StarResponse, orbit: OrbitSchemaInterface) {
        this.index = orbit.index;
        this.energyRecieved = (orbit.orbitalQ * star.mass) / star.radius;
    }
}

class PlanetResponse {
    _id: string;
    name: string;
    planetType: string;
    mass: number;
    radius: number;
    energy = 0;
    buildings: string[] = [];
    technologies: string[] = [];
    investigationTechnologies: string[];
    investigationTechnologiesDescription: string[];
    technologyBeingInvestigated: string;
    turnsToFinishInvestigation: number;
    possibleBuildingNames: string[];
    possibleBuildingEnergies: number[];
    possibleBuildingTurns: number[];
    turnsToFinishBuilding: number[];

    constructor (planet: PlanetSchemaInterface) {
        this._id = planet._id.toString();
        this.name = planet.name == null ? "" : planet.name;
        this.planetType = planet.planetType;
        this.mass = planet.mass;
        this.radius = planet.radius;
        this.energy = planet.energy == null ? 0 : planet.energy;
        if (planet.buildings != null) {
            this.buildings = planet.buildings;
        }
        if (planet.technologies != null) {
            this.technologies = planet.technologies;
        }
        this.investigationTechnologies = planet.investigationTechnologies;
        this.investigationTechnologiesDescription = planet.investigationTechnologiesDescription;
        this.technologyBeingInvestigated = planet.technologyBeingInvestigated;
        this.turnsToFinishInvestigation = planet.turnsToFinishInvestigation;
        this.possibleBuildingNames = planet.possibleBuildingNames;
        this.possibleBuildingEnergies = planet.possibleBuildingEnergies;
        this.possibleBuildingTurns = planet.possibleBuildingTurns;
        this.turnsToFinishBuilding = planet.turnsToFinishBuilding;
    }
}