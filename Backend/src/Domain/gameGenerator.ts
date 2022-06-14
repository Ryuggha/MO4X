import SimplexNoise from "simplex-noise";
import Random from "../gameModules/Random";
import SpaceLocation from "../gameModules/SpaceLocation";
import Vector2 from "../gameModules/Vector2";
import lerp from "../gameModules/Lerp";

let numberOfStars = 1000;
let squaredDistance = 1;
let minimumVoidDistance = 0.8;
// let maximumVoidDistance = 5;

export function createStellarMap (): SpaceLocation[] {

    let starMap: SpaceLocation[] = [];
    let noise = new SimplexNoise();
    let starsLeft = numberOfStars;
    let mapSizeRadius = Math.sqrt(numberOfStars) * squaredDistance;

    while (starsLeft > 0) {
        let possibleLocation = new Vector2(Random.randomFloat(-mapSizeRadius, mapSizeRadius), Random.randomFloat(-mapSizeRadius, mapSizeRadius));
        if (possibleLocation.magnitude() <= mapSizeRadius) {
            let noiseValue = getMiddleNoiseValue(noise, possibleLocation, 10);
            if (Random.randomPerOne() - 0.35 > noiseValue) {
                let hasCollided = false;
                for (const possibleCollidingStar of starMap) { // Check no collisions with other stars
                    let module = possibleLocation.minus(possibleCollidingStar.location).magnitude();
                    if (module < minimumVoidDistance) {
                        hasCollided = true;
                        break;
                    }
                }
                if (!hasCollided) {
                    starMap.push(new SpaceLocation(possibleLocation));
                    starsLeft--;
                }
            }
        }
    }

    return starMap;
}

function getNoiseValue(noise: SimplexNoise, vector: Vector2, divider: number): number {
    return noise.noise2D(vector.x / divider, vector.y / divider) * 0.5 + 0.5;
}

function getMiddleNoiseValue(noise: SimplexNoise, vector: Vector2, divider: number): number {
    return Math.abs(noise.noise2D(vector.x / divider, vector.y / divider));
}

/*function createVectorWithMaxModuleVoidDistance(): Vector2 {
    let aux: Vector2;
    do {
        aux = new Vector2(Random.randomFloat(-maximumVoidDistance, maximumVoidDistance), Random.randomFloat(-maximumVoidDistance, maximumVoidDistance));
    } while (aux.magnitude() < minimumVoidDistance && aux.magnitude() > maximumVoidDistance);
    return aux;
}*/