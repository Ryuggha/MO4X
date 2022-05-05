import Star from "./Star";
import Vector2 from "./Vector2";

export default class SpaceLocation {

    readonly location: Vector2;
    readonly star: Star;

    constructor (location: Vector2, star?: Star) {
        this.location = location;
        this.star = star == undefined? new Star() : star;
    }

    toString(): string {
        return ("( " + this.location.x + " / " + this.location.y + " ): " + this.star.name);
    }
}