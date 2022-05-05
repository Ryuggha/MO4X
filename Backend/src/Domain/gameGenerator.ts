import Random from "../gameModules/Random";
import SpaceLocation from "../gameModules/SpaceLocation";
import Vector2 from "../gameModules/Vector2";

let numberOfStars = 100;
let minimumVoidDistance = 1;
let maximumVoidDistance = 3;

export function createStellarMap (): SpaceLocation[] {
    let starMap: SpaceLocation[] = [];
    
    let starsLeft = numberOfStars;

    starMap.push(new SpaceLocation(new Vector2(0, 0)));
    starsLeft--;

    while (starsLeft > 0) {
        for (const location of starMap) { // 1 Attempt to create a Neighbour for each star
            if (starsLeft > 0) {
                let possibleLocation = location.location.plus(createVectorWithMaxModuleVoidDistance());

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
            else break;
        }   
    }

    return starMap;
}

function createVectorWithMaxModuleVoidDistance(): Vector2 {
    let aux: Vector2;
    do {
        aux = new Vector2(Random.randomFloat(-maximumVoidDistance, maximumVoidDistance), Random.randomFloat(-maximumVoidDistance, maximumVoidDistance));
    } while (aux.magnitude() < minimumVoidDistance && aux.magnitude() > maximumVoidDistance);
    return aux;
}