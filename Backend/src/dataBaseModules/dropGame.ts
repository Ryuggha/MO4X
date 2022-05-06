import mongoose from "mongoose";
import gameSchemaInterface from "../model/GameModel";
import OrbitSchemaInterface from "../model/OrbitModel";
import StarSchemaInterface from "../model/StarModel";
const GameSchema = mongoose.model("Game");
const StarSchema = mongoose.model('Star');
const OrbitSchema = mongoose.model('Orbit');
const PlanetScema = mongoose.model('Planet');

export async function dropGame(id: mongoose.Types.ObjectId) {
    
    let game = await GameSchema.findById(id) as gameSchemaInterface;
    if (game == null) return;
    for (const starId of game.stars!) {
        
        let star = await StarSchema.findById(starId) as StarSchemaInterface;

        for (const orbitId of star.orbits) {
            let orbit = await OrbitSchema.findById(orbitId) as OrbitSchemaInterface;
            if (orbit.planet != undefined) {
                console.log("Ships deletion not compleated");
                await (await PlanetScema.findById(orbit.planet))?.delete();
            }
            await orbit.delete();
        }

        await star.delete();

    }

    game.delete();
}