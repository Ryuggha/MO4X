import mongoose from "mongoose";
import accountSchemaInterface from "../model/AccountModel";
import gameSchemaInterface from "../model/GameModel";
const GameModel = mongoose.model('Game');
const StarModel = mongoose.model('Star');
const OrbitModel = mongoose.model('Orbit');
const PlanetModel = mongoose.model('Planet');

export default async function LoadGame(user: accountSchemaInterface, game: gameSchemaInterface): Promise<any> {
    let stars = StarModel.find({'_id': {$in: game.stars}});
}