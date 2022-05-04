import StarType from "./starType";
import Random from './random';
import { randomInt } from "crypto";
import Lerp from "./lerp";
import Planet from "./planet";

interface starInfo {
    prefix: string,
    weight: number,
    massMin: number,
    massMax: number,
    diameterMin: number,
    diameterMax: number,
    energyQuoficient: number,
    orbitalSlots: number[], //Absolute quoficient
}

class Star {

    static starMap = new Map<StarType, starInfo>([
        [StarType.RedDwarf,  {
            prefix: "RD",
            weight: 45,
            massMin: 0.5,
            massMax: 1.15,
            diameterMin: 0.7,
            diameterMax: 4.15,
            energyQuoficient: 0.04,
            orbitalSlots: [0.004, 0.0025, 0.0016, 0.0011, 0.0008, 0.0006, 0.0005, 0.0004, 0.0003, 0.00027, 0.00023, 0.0002],          
        }],
        [StarType.YellowDwarf,  {
            prefix: "YD",
            weight: 23,
            massMin: 1.8,
            massMax: 2.1,
            diameterMin: 6,
            diameterMax: 7.7,
            energyQuoficient: 3.16,
            orbitalSlots: [0.039, 0.026, 0.019, 0.014, 0.01, 0.008, 0.007, 0.006],          
        }],
        [StarType.BlueGiant,  {
            prefix: "BG",
            weight: 3,
            massMin: 40,
            massMax: 200,
            diameterMin: 50,
            diameterMax: 100,
            energyQuoficient: 30000,
            orbitalSlots: [1.2, 0.7, 0.4, 0.2],          
        }],
        [StarType.RedGiant,  {
            prefix: "RG",
            weight: 10,
            massMin: 0.6,
            massMax: 15,
            diameterMin: 60,
            diameterMax: 800,
            energyQuoficient: 20000,
            orbitalSlots: [0.014, 0.009, 0.006, 0.0045],          
        }],
        [StarType.NeutronStar,  {
            prefix: "NS",
            weight: 2,
            massMin: 2,
            massMax: 4,
            diameterMin: 0.0001,
            diameterMax: 0.0005,
            energyQuoficient: 0.0004,
            orbitalSlots: [0.000026, 0.00001],          
        }],
        [StarType.BlackHole,  {
            prefix: "BH",
            weight: 1,
            massMin: 6,
            massMax: 10,
            diameterMin: 0.00001,
            diameterMax: 0.00001,
            energyQuoficient: 0.0000001,
            orbitalSlots: [0.00000001],          
        }],
        [StarType.BlockHoleAccDisc,  {
            prefix: "BH",
            weight: 1,
            massMin: 6,
            massMax: 10,
            diameterMin: 0.00001,
            diameterMax: 0.00001,
            energyQuoficient: 0.01,
            orbitalSlots: [0.002, 0.0006],          
        }],
        [StarType.BinarySystem,  {
            prefix: "BS",
            weight: 15,
            massMin: 1,
            massMax: 2.5,
            diameterMin: 0.7,
            diameterMax: 4.15,
            energyQuoficient: 1,
            orbitalSlots: [0.02, 0.013, 0.01, 0.007, 0.005, 0.004],          
        }],
    ]);

    readonly name: string = "Unnamed Star";
    readonly mass: number = -1; // in 1*10^30Kg
    readonly radius: number = -1; // in 1*10^8m
    readonly energyQuoficient: number = -1;
    readonly type: StarType = StarType.RedDwarf;
    readonly orbits: Orbit[] = [];

    constructor (name?: string, mass?: number, radius?: number, type?: StarType) {
        
        if (type == null) {
            let totalWeight = 0;
            for (const i of Star.starMap.values()) {
                totalWeight += i.weight;
            }

            let rndmTypeValue = Random.randomFloat(0, totalWeight);
            let actualWeight = 0;
            for (const key of Star.starMap.keys()) {
                let aux = Star.starMap.get(key);
                if (aux != null) {
                    actualWeight += aux.weight;
                    if (rndmTypeValue < actualWeight) {
                        this.type = key;
                        break;
                    }
                }
            }
            
        } else {
            this.type = type;
        }

        let starInfo = Star.starMap.get(this.type);
        if (starInfo == null) { return; }

        if (name == null) {
            this.name = starInfo.prefix;
            for (let i = 0; i < 6; i++) {
                this.name += randomChar();
            }
        } else {
            this.name = name;
        }

        let r = Random.randomPerOne();

        if (mass == null) {
            this.mass = Lerp(starInfo.massMin, starInfo.massMax, 0, 1, r);
        } else {
            this.mass = mass;
        }

        if (radius == null) {
            this.radius = Lerp(starInfo.diameterMin, starInfo.diameterMax, 0, 1, r);
        } else {
            this.radius = radius;
        }

        this.energyQuoficient = starInfo.energyQuoficient;

        this.orbits = [];

        for (let i = 0; i < starInfo.orbitalSlots.length; i++) {
            this.orbits.push(new Orbit(this, i, starInfo.orbitalSlots[i]));
        }
    }

    
}

class Orbit {
    readonly planet?: Planet;
    readonly star: Star;
    readonly orbitIndex: number;
    readonly orbitEnergyQuoficient: number;

    constructor (star: Star, orbitIndex: number, orbitEnergyQuoficient: number) {
        this.star = star;
        this.orbitIndex = orbitIndex;
        this.orbitEnergyQuoficient = orbitEnergyQuoficient;
    }
}

function randomChar(): string {
    const characters = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    if (Random.radnomPerCent() < 75) {
        return numbers.charAt(Random.randomInt(0, numbers.length - 1));
    }
    else {
        return characters.charAt(Random.randomInt(0, characters.length - 1));
    }
}

export default Star;
