class Vector2 {
    static zero () { return new Vector2(0, 0); }
    static down () { return new Vector2(0, -1); }
    static up () { return new Vector2(0, 1); }
    static right () { return new Vector2(1, 0); }
    static left () { return new Vector2(-1, 0); }
    static one () { return new Vector2(1, 1); }
    
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    magnitude(): number {
        let r = Math.sqrt((this.x * this.x) + (this.y * this.y));
        return r;
    }

    normalized(): Vector2 {
        let magnitude = this.magnitude();
        let r = new Vector2(this.x / magnitude, this.y / magnitude);
        return r;
    }

    toString(): string {
        return "Vector2(" + this.x + ", " + this.y + ")";
    }

    Set(x: number, y: number): void {
        if (isNaN(x) || isNaN(y)) {
            throw "Not a Number";
        }
        this.x = x;
        this.y = y;
    }

    scaled(value: number): Vector2 {
        if (isNaN(value)) { throw "Not a Number"; }
        let r = new Vector2(this.x *= value, this.y *= value);
        return r;
    }

    minus(other: Vector2): Vector2 {
        return new Vector2(this.x - other.x, this.y - other.y);
    }

    plus(other: Vector2): Vector2 {
        return new Vector2(this.x + other.x, this.y + other.y);
    }
}

export default Vector2;