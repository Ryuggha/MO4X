// Everything always inclusive

export default class Random {

    static randomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max + 1 - min) + min);
    }
    
    static randomFloat(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }
    
    static randomPerOne(): number {
        return Math.random();
    }
    
    static radnomPerCent(): number {
        return Math.random() * 100;
    }
    
    static randomBool(): boolean {
        if (Random.randomInt(0, 1) === 0) return true;
        else return false;
    }

    static randomCelestialObjectNameChar(): string {
        const characters = 'abcdefghijklmnopqrstuvwxyz';
        const numbers = '0123456789';
        if (Random.radnomPerCent() < 75) {
            return numbers.charAt(Random.randomInt(0, numbers.length - 1));
        }
        else {
            return characters.charAt(Random.randomInt(0, characters.length - 1));
        }
    }
    
}