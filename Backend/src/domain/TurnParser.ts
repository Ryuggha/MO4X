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
import Random from "../gameModules/Random";
import disciplineEnum from "../gameModules/disciplineEnum";
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

    
    await processPassiveBuildings(game);

    if (game.actualTurn != null) game.actualTurn++;
    game.turnCacheList = [];
    await game.save();

}

async function processPassiveBuildings(game: gameSchemaInterface) {
    let allStars = await StarModel.find({_id: {$in: game.stars}}) as StarSchemaInterface[];
    let orbitIds: ObjectId[] = [];
    for (const s of allStars) {
        orbitIds = orbitIds.concat(s.orbits);
    }

    let allOrbits = await OrbitModel.find({_id: {$in: orbitIds}}) as OrbitSchemaInterface[];
    let planetIds: ObjectId[] = [];
    for (const o of allOrbits) {
        if (o.planet) planetIds.push(o.planet);
    }

    let planetsWithBuildings = await PlanetModel.find(
        {$and: [
            {buildings: { $exists: true, $not: {$size: 0} } },
            {_id: {$in: planetIds}}
        ]}) as PlanetSchemaInterface[];

    processEnergyGain(planetsWithBuildings, allOrbits, allStars);
    processTechInvestigation(planetsWithBuildings);

    for (const planet of planetsWithBuildings) await planet.save();
}

function processEnergyGain(planetsWithBuildings: PlanetSchemaInterface[], allOrbits: OrbitSchemaInterface[], allStars: StarSchemaInterface[]) {
    let basicStorageCapacity = 500; // Storage Capacity if no other Storages.
    
    for (const planet of planetsWithBuildings) {
        let extraEnergy = 0;
        if (planet.energy != null? planet.energy <= basicStorageCapacity: true) {
            if (planet.buildings != null) {
                for (const buildingString of planet.buildings) {
                    let building = TechFactory({name: buildingString});
                    if (building instanceof abstractEnergyGainBuilding) {
                        if (building instanceof solarEnergyGainBuilding) {
                            let orbit = allOrbits.find(o => {return o.planet?.equals(planet._id)});
                            let star = allStars.find(s => {return s.orbits.filter(o => {return orbit?._id.equals(o)}).length >= 1});
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

            if (planet.energy > basicStorageCapacity) planet.energy = basicStorageCapacity;
        }
    }
}

function processTechInvestigation(planetsWithBuildings: PlanetSchemaInterface[]) {
    for (const planet of planetsWithBuildings) {
        if (planet.technologyBeingInvestigated != null && planet.technologyBeingInvestigated != "") {
            planet.turnsToFinishInvestigation--;
            if (planet.turnsToFinishInvestigation <= 0) {
                planet.turnsToFinishInvestigation = -1;
                let s = planet.technologyBeingInvestigated;
                planet.technologyBeingInvestigated = "";
                planet.technologies.push(s);

                let tech = TechFactory({name: s});
                if (tech != null) {
                    let disInt = 2;
                    if (tech?.discipline === disciplineEnum.SpaceCombat) disInt = 0;
                    if (tech?.discipline === disciplineEnum.ResourceAcquisition) disInt = 1;
                    if (planet.maxTierOfInvestigation[disInt] && planet.maxTierOfInvestigation[disInt] < tech.tier) planet.maxTierOfInvestigation[disInt] = tech.tier;
                }
            }
        }

        if (planet.technologyBeingInvestigated == null || planet.technologyBeingInvestigated == "") {
            for (let i = 0; i < planet.investigationTechnologies.length; i++) {
                if (planet.investigationTechnologies[i] == null || planet.investigationTechnologies[i] === "") {
                    let maxTier = planet.maxTierOfInvestigation[i]
                    maxTier = (maxTier==null || maxTier<1) ? 1 : maxTier;
                    let discipline = disciplineEnum.EmpireLogistics;
                    if (i === 0) discipline = disciplineEnum.SpaceCombat;
                    if (i === 1) discipline = disciplineEnum.ResourceAcquisition;

                    let auxTech;
                    let found = false;
                    let iterations = 50;
                    console.log({discipline: discipline, tier: Random.randomInt(1, maxTier)});
                    while (!found) {
                        auxTech = TechFactory({discipline: discipline, tier: Random.randomInt(1, maxTier)});
                        if (auxTech && !planet.technologies.includes(auxTech.name)) {
                            found = true;
                        }
                        else auxTech = null;
                        iterations--;
                        if (iterations <= 0) found = true;
                    }
                    console.log(auxTech);
                    console.log("-.--------------");
                    if (auxTech) {
                        planet.investigationTechnologies[i] = auxTech.name;
                        planet.investigationTechnologiesDescription[i] = getTimeToInvestigateInPlanet(auxTech.tier, planet) + " turns";
                    }
                    else {
                        planet.investigationTechnologies[i] = "";
                        planet.investigationTechnologiesDescription[i] = "";
                    }
                }
            }
        }
    }
}

function getTimeToInvestigateInPlanet(tier: number, planet: PlanetSchemaInterface) : number {
    if (tier === 1) return 10;
    if (tier === 2) return 20;
    else return 40;
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
