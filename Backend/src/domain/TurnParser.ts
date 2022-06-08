import mongoose from "mongoose";
import { actionInterface, actionListInterface, buildBuilding, changeStarName, moveShip, selectTechnology } from "../gameModules/actionsInterface";
import ObjectId from "../dataBaseModules/ObjectId";
import accountSchemaInterface from "../model/AccountModel";
import gameSchemaInterface from "../model/GameModel";
import StarSchemaInterface from "../model/StarModel";
import PlanetSchemaInterface from "../model/PlanetModel";
import TechFactory from "../gameModules/TechFactory";
import { abstractEnergyGainBuilding, BuildingModule, solarEnergyGainBuilding } from "../gameModules/Tech";
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
                else if (action.code == 2) await processSelectTechnology(game, user, action as selectTechnology);
                else if (action.code == 3) await processBuildBuilding(game, user, action as buildBuilding);
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

    generatePossibleBuildings(planetsWithBuildings);

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
                    while (!found) {
                        auxTech = TechFactory({discipline: discipline, tier: Random.randomInt(1, maxTier)});
                        if (auxTech && !planet.technologies.includes(auxTech.name)) {
                            found = true;
                        }
                        else auxTech = null;
                        iterations--;
                        if (iterations <= 0) found = true;
                    }
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

function generatePossibleBuildings(planetsWithBuildings: PlanetSchemaInterface[]) {
    for (const planet of planetsWithBuildings) {
        let buildingCache = [];
        let turnsLeftCache = [];
        let energyCache = [];
        let turnsCache = [];

        for (let i = 0; i < planet.possibleBuildingNames.length; i++) {
            if (planet.turnsToFinishBuilding[i] != -1) {
                buildingCache.push(planet.possibleBuildingNames[i]);
                turnsLeftCache.push(planet.turnsToFinishBuilding[i] - 1);
                energyCache.push(planet.possibleBuildingEnergies[i]);
                turnsCache.push(planet.possibleBuildingTurns[i]);
            }
        }

        planet.possibleBuildingNames = buildingCache;
        planet.possibleBuildingTurns = turnsCache;
        planet.possibleBuildingEnergies = energyCache;
        planet.turnsToFinishBuilding = turnsLeftCache;

        for (const tech of planet.technologies) {
            let auxTech = TechFactory({name: tech});
            if (auxTech != null && auxTech instanceof BuildingModule) {
                if (!planet.buildings.includes(auxTech.name) && !planet.possibleBuildingNames.includes(auxTech.name)) {
                    planet.possibleBuildingNames.push(auxTech.name);
                    planet.possibleBuildingTurns.push(getTimeToBuildInPlanet(auxTech.tier, planet));
                    planet.possibleBuildingEnergies.push(auxTech.priceInEnergy);
                    planet.turnsToFinishBuilding.push(-1);
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

function getTimeToBuildInPlanet(tier: number, planet: PlanetSchemaInterface) : number {
    if (tier === 1) return 3;
    if (tier === 2) return 5;
    else return 10;
}

async function processMoveShip(game: gameSchemaInterface, user: accountSchemaInterface, action: moveShip) {
    console.log("ERROR: TurnParser: ProcessMoveShip Not implemented");
}

async function processChangeStarName(game: gameSchemaInterface, user: accountSchemaInterface, action: changeStarName) {
    let star = await StarModel.findById(new ObjectId(action.starId)) as StarSchemaInterface;
    if (starBelongsToPlayer(game, user, star)) {
        star.name = action.newName;
        await star.save();
    }
}

async function processSelectTechnology(game: gameSchemaInterface, user: accountSchemaInterface, action: selectTechnology) {
    let star = await StarModel.findById(new ObjectId(action.starId)) as StarSchemaInterface;
    
    if (starBelongsToPlayer(game, user, star)) {
        let planet = await PlanetModel.findById(new ObjectId(action.planetId)) as PlanetSchemaInterface;
        let indexOfTech = planet.investigationTechnologies.indexOf(action.technologyName);
        if (indexOfTech != -1) {
            let tech = TechFactory({name: planet.investigationTechnologies[indexOfTech]});
            planet.investigationTechnologies[indexOfTech] = "";
            planet.investigationTechnologiesDescription[indexOfTech] = "";
            if (tech != null && !planet.technologies.includes(tech.name)) {
                planet.turnsToFinishInvestigation = getTimeToInvestigateInPlanet(tech.tier, planet);
                planet.technologyBeingInvestigated = tech.name;
            }
        }

        await planet.save();
    }
}

async function processBuildBuilding(game: gameSchemaInterface, user: accountSchemaInterface, action: buildBuilding) {
    let star = await StarModel.findById(new ObjectId(action.starId)) as StarSchemaInterface;

    if (starBelongsToPlayer(game, user, star)) {
        let planet = await PlanetModel.findById(new ObjectId(action.planetId)) as PlanetSchemaInterface;
        let indexOfBuilding = planet.possibleBuildingNames.indexOf(action.buildingName);
        if (indexOfBuilding != -1) {
            let tech = TechFactory({name: action.buildingName});
            if (tech != null && !planet.buildings.includes(tech.name)) {
                if (planet.energy != null && planet.energy >= planet.possibleBuildingEnergies[indexOfBuilding]) {
                    planet.energy -= planet.possibleBuildingEnergies[indexOfBuilding];
                    planet.turnsToFinishBuilding[indexOfBuilding] = getTimeToBuildInPlanet(tech.tier, planet);
                }
            }
        }
        await planet.save();
    }
}

function starBelongsToPlayer (game: gameSchemaInterface, user: accountSchemaInterface, star: StarSchemaInterface): boolean {
    if (game.stars != null && game.stars.includes(star._id)) {
        if (star.userController?.equals(user._id)) {
            return true;
        }
    }
    return false;
}
