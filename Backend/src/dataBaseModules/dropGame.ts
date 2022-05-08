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
    
    let orbitsToDelete: mongoose.Types.ObjectId[] = [];
    let planetsToDelete: mongoose.Types.ObjectId[] = [];

    let orbitIds: mongoose.Types.ObjectId[] = [];
    for (const star of stars) {
        orbitIds = orbitIds.concat(star.orbits);
    }

    let orbits = await OrbitSchema.find({ '_id': { $in: orbitIds}}) as OrbitSchemaInterface[];

    for (const orbit of orbits) {
        if (orbit.planet != undefined) {
            console.log("Ships deletion not compleated");
            planetsToDelete.push(orbit.planet);
        }

        orbitsToDelete.push(orbit._id);
    }

    await PlanetSchema.deleteMany({_id: { $in: planetsToDelete }});

    await OrbitSchema.deleteMany({ '_id': { $in: orbitsToDelete}});

    await StarSchema.deleteMany({ '_id': { $in: game.stars } });

    await game.delete();

}