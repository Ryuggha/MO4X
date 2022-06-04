import Lerp from "./Lerp";
import PlanetType from "./PlannetType";
import Random from "./Random";
import { Tech } from "./Tech";
import TechFactory from "./TechFactory";

interface planetInfo {
    prefix: string,
    weight: number,
    massMin: number,
    massMax: number,
    diamaterMin: number,
    diamaterMax: number,
}

export default class Planet {
    static planetMap = new Map<PlanetType, planetInfo>([
        [PlanetType.terrestrial, {
            prefix: "EPT::",
            weight: 50,
            massMin: 0.02,
            massMax: 10,
            diamaterMin: 1000,
            diamaterMax: 13000,
        }],
        [PlanetType.gaseous, {
            prefix: "EPG::",
            weight: 50,
            massMin: 20,
            massMax: 3000,
            diamaterMin: 20000,
            diamaterMax: 150000
        }],
    ]);

    readonly name: string = "Unnamed Planet";
    readonly mass: number = -1;
    readonly radius: number = -1;
    readonly typeOfPlanet: PlanetType = PlanetType.terrestrial;
    buildings: string[] = [];
    technologies: Tech[] = [];

    constructor (homePlanet?: boolean, typeOfPlanet?: PlanetType, name?: string, mass?: number, radius?: number) {
        if (homePlanet) {
            typeOfPlanet = PlanetType.terrestrial;
            this.colonizePlanet();
        }
        if (typeOfPlanet == null) {
            let totalWeight = 0;
            for (const i of Planet.planetMap.values()) {
                totalWeight += i.weight;
            }

            let rndmTypeValue = Random.randomFloat(0, totalWeight);
            let actualWeight = 0;
            for (const key of Planet.planetMap.keys()) {
                actualWeight += Planet.planetMap.get(key)!.weight;
                if (rndmTypeValue < actualWeight) {
                    this.typeOfPlanet = key;
                    break;
                }
            }
        } else {
            this.typeOfPlanet = typeOfPlanet
        }

        let planetInfo = Planet.planetMap.get(this.typeOfPlanet);
        if (planetInfo == null) { return; }

        if (name == null) {
            if (homePlanet) {
                this.name = "Terra::";
                for (let i = 0; i < 3; i++) {
                    this.name += Random.randomCelestialObjectNameChar();
                }
            }
            else {
                this.name = planetInfo.prefix;
                for (let i = 0; i < 10; i++) {
                    this.name += Random.randomCelestialObjectNameChar();
                }
            }
            
        } else {
            this.name = name;
        }

        let r = Random.randomPerOne();

        if (mass == null) {
            this.mass = Lerp(planetInfo.massMin, planetInfo.massMax, 0, 1, r);
        } else {
            this.mass = mass;
        }

        if (radius == null) {
            this.radius = Lerp(planetInfo.diamaterMin, planetInfo.diamaterMax, 0, 1, r);
        } else {
            this.radius = radius;
        }
    }

    colonizePlanet() {
        let hangar = TechFactory({name: "Hangar"});
        if (hangar != null) {
            this.technologies.push(hangar);
            this.buildings.push(hangar.name);
        }

        let thermalPanels = TechFactory({name: "Thermal Panels"});
        if (thermalPanels != null) {
            this.technologies.push(thermalPanels);
            this.buildings.push(thermalPanels.name);
        }
    }
}

