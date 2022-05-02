class Vector2 {
    static zero = new Vector2(0, 0);
    static down = new Vector2(0, -1);
    static up = new Vector2(0, 1);
    static right = new Vector2(1, 0);
    static left = new Vector2(-1, 0);
    static one = new Vector2(1, 1);
    
    constructor(x, y) {
        this.Set(x, y);
    }

    magnitude() {
        let r = Math.sqrt((this.x * this.x) + (this.y * this.y));
        return r;
    }

    normalized() {
        let magnitude = this.magnitude();
        let r = new Vector2(this.x / magnitudeVector, this.y / magnitude);
    }

    toString() {
        return "Vector2(" + this.x + ", " + this.y + ")";
    }

    Set(x, y) {
        if (isNaN(x) || isNaN(y)) {
            throw "Not a Number";
        }
        this.x = x;
        this.y = y;
    }

    scaled(value) {
        if (isNaN(value)) { throw "Not a Number"; }
        let r = new Vector2(this.x = value, this.y = value);
        return r;
    }
}

module.exports = Vector2;
