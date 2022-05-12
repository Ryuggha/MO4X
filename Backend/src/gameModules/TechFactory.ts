import { BasicHull, BasicPlanetaryCamuflage, BasicPlanetaryDetector, BasicShipCamuflage, BasicShipDetector, BasicShipReactor, BasicThruster, BasicWeapon, Tech } from "./Tech";

interface TechFactoryOptions {
    name?: string,
    tier?: number;
}

export default function TechFactory (options: TechFactoryOptions): Tech | null {
    let name = options.name != null ? options.name : "";
    let tier = options.tier != null ? options.tier : -1;

    return TechFactoryImplementation(name, tier);
}

function TechFactoryImplementation (name: string, tier: number): Tech | null {
    
    if (name != null) {
        if (name === "Ion Laser") return new BasicWeapon(name, 1, 10, 3, 1, 5);
        if (name === "Plasma Laser") return new BasicWeapon(name, 2, 10, 6, 3, 5);
        if (name === "PlaAntimatter Laser") return new BasicWeapon(name, 3, 10, 10, 10, 5);

        if (name === "Steel Shield") return new BasicHull(name, 1, 10, 0, 5);
        if (name === "Energy Shield") return new BasicHull(name, 2, 10, 1, 15);
        if (name === "Magnetic Shield") return new BasicHull(name, 3, 10, 4, 50);

        if (name === "Ion Thrusters") return new BasicThruster(name, 1, 10, 3, 0.5);
        if (name === "Plasma Thrusters") return new BasicThruster(name, 2, 10, 6, 1);
        if (name === "Antimatter Thrusters") return new BasicThruster(name, 3, 10, 9, 2);

        if (name === "Combustion Reactor") return new BasicShipReactor(name, 1, 10, 0, 9, 1);
        if (name === "Fusion Reactor") return new BasicShipReactor(name, 2, 10, 0, 18, 2);
        if (name === "Antimatter Reactor") return new BasicShipReactor(name, 3, 10, 0, 30, 4);

        if (name === "AntiRadar") return new BasicShipCamuflage(name, 1, 10, 10, 5); 
        if (name === "Luminar Mirror") return new BasicShipCamuflage(name, 2, 10, 20, 10);
        if (name === "Gravity Mirror") return new BasicShipCamuflage(name, 3, 5, 40, 15);
        if (name === "Defractor Image") return new BasicPlanetaryCamuflage(name, 1, 10, 4);
        if (name === "Luminar Mirage") return new BasicPlanetaryCamuflage(name, 2, 5, 9);
        if (name === "Planar Shift") return new BasicPlanetaryCamuflage(name, 3, 2, 14);

        if (name === "Electro Detector") return new BasicShipDetector(name, 1, 5, 10, 5);
        if (name === "Wave Detector") return new BasicShipDetector(name, 2, 5, 20, 10);
        if (name === "Planar Detector") return new BasicShipDetector(name, 3, 2, 40, 15);
        if (name === "Radio Detector") return new BasicPlanetaryDetector(name, 1, 5, 4);
        if (name === "Laser Interferometer") return new BasicPlanetaryDetector(name, 2, 2, 9);
        if (name === "Antimatter Detector") return new BasicPlanetaryDetector(name, 3, 1, 14);
    }
    

    return null;

}

