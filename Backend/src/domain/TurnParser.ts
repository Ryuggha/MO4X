import mongoose from "mongoose";
import { actionInterface, actionListInterface, changeStarName, moveShip } from "../gameModules/actionsInterface";
import ObjectId from "../dataBaseModules/ObjectId";
import accountSchemaInterface from "../model/AccountModel";
import gameSchemaInterface from "../model/GameModel";
import StarSchemaInterface from "../model/StarModel";
import PlanetSchemaInterface from "../model/PlanetModel";
import TechFactory from "../gameModules/TechFactory";
import { abstractEnergyGainBuilding, solarEnergyGainBuilding } from "../gameModules/Tech";
import OrbitSchemaInterface from "../model/OrbitModel";
import Star from "../gameModules/Star";
const AccountModel = mongoose.model('Account');
const GameModel = mongoose.model('Game');
const StarModel = mongoose.model('Star');
const OrbitModel = mongoose.model('Orbit');
const PlanetModel = mongoose.model('Planet');

let basicEnergyMultiplier = 10000;

export default async function processTurn(game: gameSchemaInterface) {

    if (game.turnCacheList == null) game.turnCacheList = [];
    for (let turnIndex = 0; turnIndex < game.turnCacheList.length; turnIndex++) {
        let actionList = JSON.parse(game.turnCacheList[turnIndex]); 

        if (!game._id.equals(new ObjectId(actionList.gameId))) console.log("Error, this turn does not belong to this game: \n" + actionList);
        else {

            let user = await AccountModel.findById(new ObjectId(actionList.userId)) as accountSchemaInterface;

            for (let i = 0; i < actionList.actionList.length; i++) {
        
                let action = actionList.actionList[i] as actionInterface;
        
                if (action.code == 0) await processMoveShip(game, user, action as moveShip);
                else if (action.code == 1) await processChangeStarName(game, user, action as changeStarName);
            }
        }
    }

    await processEnergyGain(game);

    if (game.actualTurn != null) game.actualTurn++;
    game.turnCacheList = [];
    await game.save();

}

async function processEnergyGain(game: gameSchemaInterface) {
    let basicStorageCapacity = 20000; // Storage Capacity if no other Storages.

    let stars = await StarModel.find({_id: {$in: game.stars}}) as StarSchemaInterface[];
    let orbitIds: ObjectId[] = [];
    for (const s of stars) {
        orbitIds = orbitIds.concat(s.orbits);
    }
    

    let orbits = await OrbitModel.find({_id: {$in: orbitIds}}) as OrbitSchemaInterface[];
    let planetIds: ObjectId[] = [];
    for (const o of orbits) {
        if (o.planet) planetIds.push(o.planet);
    }

    let planetsWithBuildings = await PlanetModel.find(
        {$and: [
            {buildings: { $exists: true, $not: {$size: 0} } },
            {_id: {$in: planetIds}}
        ]}) as PlanetSchemaInterface[];
    
    for (const planet of planetsWithBuildings) {
        let extraEnergy = 0;
        if (planet.buildings != null) {
            for (const buildingString of planet.buildings) {
                let building = TechFactory({name: buildingString});
                if (building instanceof abstractEnergyGainBuilding) {
                    if (building instanceof solarEnergyGainBuilding) {
                        let orbit = orbits.find(o => {return o.planet?.equals(planet._id)});
                        let star = stars.find(s => {return s.orbits.filter(o => {return orbit?._id.equals(o)}).length >= 1});
                        if (star) {
                            let starDomain = Star.ModelToStar(star);
                            building.setOrbitalLuminosity(starDomain.getOrbitalEnergy(orbit?.orbitalQ? orbit?.orbitalQ : 0));
                        }
                        
                    }
                    extraEnergy += building.getEnergyPerTurn() * basicEnergyMultiplier;
                }
            }
        }
        if (planet.energy) planet.energy += extraEnergy;
        else planet.energy = extraEnergy;
        await planet.save();
    }
}

async function processMoveShip(game: gameSchemaInterface, user: accountSchemaInterface, action: moveShip) {
    console.log("ERROR: TurnParser: ProcessMoveShip Not implemented");
}

async function processChangeStarName(game: gameSchemaInterface, user: accountSchemaInterface, action: changeStarName) {
    let star = await StarModel.findById(new ObjectId(action.starId)) as StarSchemaInterface;
    if (game.stars != null && game.stars.includes(star._id)) {
        if (star.userController?.equals(user._id)) {
            star.name = action.newName;
            await star.save();
        }
    }
}
