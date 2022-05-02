class Vector2 {
    static zero = new Vector2(0, 0);
    static down = new Vector2(0, -1);
    static up = new Vector2(0, 1);
    static right = new Vector2(1, 0);
    static left = new Vector2(-1, 0);
    static one = new Vector2(1, 1);
    
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
        let r = new Vector2(this.x = value, this.y = value);
        return r;
    }
}

export default Vector2;