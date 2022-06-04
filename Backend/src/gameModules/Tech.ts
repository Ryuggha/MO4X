export abstract class Tech {
    name: string;
    tier: number;
    weight: number;

    constructor(name: string, tier: number, weight: number) {
        this.name = name;
        this.tier = tier;
        this.weight = weight;
    }
}

export abstract class ShipModule extends Tech {
    energyRequirement: number;

    constructor (name: string, tier: number, weight: number, energyRequirement: number) {
        super(name, tier, weight);
        this.energyRequirement = energyRequirement;
    }
}

export class BuildingModule extends Tech {
    constructor (name: string, tier: number, weight: number) {
        super(name, tier, weight);
    }
}

export abstract class BattleShipModule extends ShipModule {
    constructor (name: string, tier: number, weight: number, energyRequirement: number) {
        super(name, tier, weight, energyRequirement);
    }
}

export class BasicWeapon extends BattleShipModule{
    damage: number; 
    shotDelay: number; // In Seconds
    
    constructor (name: string, tier: number, weight: number, energyRequirement: number, damage: number, shotDelay: number) {
        super(name, tier, weight, energyRequirement);        
        this.damage = damage;
        this.shotDelay = shotDelay;
    }
}

export class BasicHull extends BattleShipModule {
    hp: number;
    constructor (name: string, tier: number, weight: number, energyRequirement: number, hp: number) {
        super(name, tier, weight, energyRequirement);
        this.hp = hp;
    }
}

export class BasicThruster extends BattleShipModule {
    cellsPerSecond: number;
    constructor (name: string, tier: number, weight: number, energyRequirement: number, cellsPerSecond: number) {
        super(name, tier, weight, energyRequirement);
        this.cellsPerSecond = cellsPerSecond;
    }
}

export class ShipEmpireLogistics extends ShipModule {
    constructor (name: string, tier: number, weight: number, energyRequirement: number) {
        super(name, tier, weight, energyRequirement);
    }
}

export class BuildingEmpireLogistics extends BuildingModule {
    constructor (name: string, tier: number, weight: number) {
        super(name, tier, weight);
    }
}

export class BasicShipReactor extends ShipEmpireLogistics{
    moduleEnergy: number;
    energyOutput: number;

    constructor (name: string, tier: number, weight: number, energyRequirement: number, moduleEnergy: number, energyOutput: number) {
        super(name, tier, weight, energyRequirement);
        this.moduleEnergy = moduleEnergy;
        this.energyOutput = energyOutput;
    }
}

export class BasicShipCamuflage extends ShipEmpireLogistics {
    camuflageLevel: number;
    constructor (name: string, tier: number, weight: number, energyRequirement: number,camuflageLevel: number) {
        super(name, tier, weight, energyRequirement);
        this.camuflageLevel = camuflageLevel;
    }
}

export class BasicShipDetector extends ShipEmpireLogistics {
    detectionLevel: number;
    constructor (name: string, tier: number, weight: number, energyRequirement: number, detectionLevel: number) {
        super(name, tier, weight, energyRequirement);
        this.detectionLevel = detectionLevel;
    }
}

export class BasicPlanetaryCamuflage extends BuildingModule {
    camuflageLevel: number;
    constructor (name: string, tier: number, weight: number, camuflageLevel: number) {
        super(name, tier, weight);
        this.camuflageLevel = camuflageLevel;
    }
}

export class BasicPlanetaryDetector extends BuildingModule {
    detectionLevel: number;
    constructor (name: string, tier: number, weight: number, detectionLevel: number) {
        super(name, tier, weight);
        this.detectionLevel = detectionLevel;
    }
}

export abstract class abstractEnergyGainBuilding extends BuildingModule {
    constructor (name: string, tier: number, weight: number) {
        super(name, tier, weight);
    }

    abstract getEnergyPerTurn(): number;
}

export class basicEnergyGainBuilding extends abstractEnergyGainBuilding {
    energyPerTurn: number;
    constructor (name: string, tier: number, weight: number, energyPerTurn: number) {
        super(name, tier, weight);
        this.energyPerTurn = energyPerTurn;
    }
    getEnergyPerTurn(): number {
        return this.energyPerTurn;
    }
}

export class solarEnergyGainBuilding extends abstractEnergyGainBuilding {
    orbitalLuminosity: number = -1;
    solarMultiplier: number = 0;
    constructor (name: string, tier: number, weight: number, solarMultiplier: number) {
        super(name, tier, weight);
        this.solarMultiplier = solarMultiplier;
    }
    getEnergyPerTurn(): number {
        if (this.orbitalLuminosity < 0) {
            console.error(this.name + " have not been initialized with orbitalLuminosity.");
            return -1;
        } 
        else {
            return this.orbitalLuminosity * this.solarMultiplier;
        }
    }

    setOrbitalLuminosity(orbitalLuminosity: number) {
        this.orbitalLuminosity = orbitalLuminosity;
    }
}