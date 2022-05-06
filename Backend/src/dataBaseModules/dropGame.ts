import mongoose from "mongoose";
import gameSchemaInterface from "../model/GameModel";
import OrbitSchemaInterface from "../model/OrbitModel";
import StarSchemaInterface from "../model/StarModel";
const GameSchema = mongoose.model("Game");
const StarSchema = mongoose.model('Star');
const OrbitSchema = mongoose.model('Orbit');
const PlanetSchema = mongoose.model('Planet');

export async function dropGame(id: mongoose.Types.ObjectId) {
    
    let game = await GameSchema.findById(id) as gameSchemaInterface;
    if (game == null) return;
    let stars = await StarSchema.find({ '_id': { $in: game.stars } }) as StarSchemaInterface[];
    
    for (const star of stars) {
        let orbits = await OrbitSchema.find({ '_id': { $in: star.orbits}}) as OrbitSchemaInterface[];

        for (const orbit of orbits) {
            if (orbit.planet != undefined) {
                console.log("Ships deletion not compleated");
                await PlanetSchema.findByIdAndDelete(orbit.planet);
            }
        }

        await OrbitSchema.deleteMany({ '_id': { $in: star.orbits}});
    }

    await StarSchema.deleteMany({ '_id': { $in: game.stars } });

    game.delete();

}