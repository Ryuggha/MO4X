import Lerp from "./Lerp";
import PlanetType from "./PlannetType";
import Random from "./Random";

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
            massMin: 0.3,
            massMax: 50,
            diamaterMin: 750,
            diamaterMax: 3250,
        }],
        [PlanetType.gaseous, {
            prefix: "EPG::",
            weight: 50,
            massMin: 60,
            massMax: 3000,
            diamaterMin: 5000,
            diamaterMax: 50000
        }],
    ]);

    readonly name: string = "Unnamed Planet";
    readonly mass: number = -1;
    readonly radius: number = -1;
    readonly typeOfPlanet: PlanetType = PlanetType.terrestrial;

    constructor (name?: string, mass?: number, radius?: number, typeOfPlanet?: PlanetType) {
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
            this.name = planetInfo.prefix;
            for (let i = 0; i < 10; i++) {
                this.name += Random.randomCelestialObjectNameChar();
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
}

