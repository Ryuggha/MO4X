import mongoose from "mongoose";
import accountSchemaInterface from "../model/AccountModel";
import gameSchemaInterface from "../model/GameModel";
import OrbitSchemaInterface from "../model/OrbitModel";
import PlanetSchemaInterface from "../model/PlanetModel";
import StarSchemaInterface from "../model/StarModel";
const GameModel = mongoose.model('Game');
const StarModel = mongoose.model('Star');
const OrbitModel = mongoose.model('Orbit');
const PlanetModel = mongoose.model('Planet');

export default async function LoadGame(user: accountSchemaInterface, game: gameSchemaInterface): Promise<any> {

    console.log("Pending of Implementation: It has to load only what the player may need");
    let r = new GameResponse(game);
    await r.init(game);
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

    async init (game: gameSchemaInterface) {
        let auxStars = await StarModel.find({_id: {$in: game.stars}}) as StarSchemaInterface[];

        for (const star of auxStars) {
            let aux = new StarResponse(star);
            await aux.init(star);
            this.stars.push(aux);
        }
    }

    addStar(star: StarResponse) {
        this.stars.push(star);
    }
}

class StarResponse {
    name: string;
    xPos: number;
    yPos: number;
    starType: string;
    mass: number;
    radius: number;
    energyEmission = 0;
    orbits: OrbitResponse[];

    constructor (star: StarSchemaInterface) {
            this.name = star.name;
            this.xPos = star.xPos;
            this.yPos = star.yPos;
            this.starType = star.starType;
            this.mass = star.mass;
            this.radius = star.radius;
            this.energyEmission = Math.round((star.energyQ * star.mass) / star.radius);
            this.orbits = [];
    }

    async init(star: StarSchemaInterface) {
        let auxOrbits = await OrbitModel.find({_id: {$in: star.orbits}}) as OrbitSchemaInterface[];

        for (const orbit of auxOrbits) {
            let aux = new OrbitResponse(this, orbit);
            await aux.init(orbit);
            this.orbits.push(aux);
        }
    }
}

class OrbitResponse {
    index: number;
    energyRecieved = 0;
    planet?: PlanetResponse;

    constructor (star: StarResponse, orbit: OrbitSchemaInterface) {
        this.index = orbit.index;
        this.energyRecieved = Math.round((orbit.orbitalQ * star.mass) / star.radius);
    }

    async init(orbit: OrbitSchemaInterface) {
        let aux = await PlanetModel.findById(orbit.planet) as PlanetSchemaInterface;
        if (aux != null) {
            this.planet = new PlanetResponse(aux);
        }
        
    }
}

class PlanetResponse {
    name: string;
    planetType: string;
    mass: number;
    radius: number;
    energy = 0;

    constructor (planet: PlanetSchemaInterface) {
        this.name = planet.name == null ? "" : planet.name;
        this.planetType = planet.planetType;
        this.mass = planet.mass;
        this.radius = planet.radius;
        this.energy = planet.energy == null ? 0 : planet.energy;
    }
}