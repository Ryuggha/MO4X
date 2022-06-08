import disciplineEnum from "./disciplineEnum";
import Random from "./Random";
import { BasicHull, BasicPlanetaryCamuflage, BasicPlanetaryDetector, BasicShipCamuflage, BasicShipDetector, BasicShipReactor, BasicThruster, BasicWeapon, BuildingModule, solarEnergyGainBuilding, Tech } from "./Tech";

interface TechFactoryOptions {
    name?: string,
    tier?: number;
    discipline?: disciplineEnum;
}

interface TechData {
    name: string,
    tier: number,
    discipline: disciplineEnum,
}

function getTechnologies(name?: string): Tech[] {
    
    let r = [];
    let fullList = false;

    if (name == null)  name = "";
    if (name == "") fullList = true;
    
    if (fullList || name === "Ion Laser") r.push( new BasicWeapon("Ion Laser", 1, 10, 3, 1, 5));
    if (fullList || name === "Plasma Laser") r.push( new BasicWeapon("Plasma Laser", 2, 10, 6, 3, 5));
    if (fullList || name === "PlaAntimatter Laser") r.push( new BasicWeapon("PlaAntimatter Laser", 3, 10, 10, 10, 5));

    if (fullList || name === "Steel Shield") r.push( new BasicHull("Steel Shield", 1, 10, 0, 5));
    if (fullList || name === "Energy Shield") r.push( new BasicHull("Energy Shield", 2, 10, 1, 15));
    if (fullList || name === "Magnetic Shield") r.push( new BasicHull("Magnetic Shield", 3, 10, 4, 50));

    if (fullList || name === "Ion Thrusters") r.push( new BasicThruster("Ion Thrusters", 1, 10, 3, 0.5));
    if (fullList || name === "Plasma Thrusters") r.push(  new BasicThruster("Plasma Thrusters", 2, 10, 6, 1));
    if (fullList || name === "Antimatter Thrusters") r.push(  new BasicThruster("Antimatter Thrusters", 3, 10, 9, 2));

    if (fullList || name === "Combustion Reactor") r.push( new BasicShipReactor("Combustion Reactor", 1, 10, 0, 9, 1));
    if (fullList || name === "Fusion Reactor") r.push( new BasicShipReactor("Fusion Reactor", 2, 10, 0, 18, 2));
    if (fullList || name === "Antimatter Reactor") r.push( new BasicShipReactor("Antimatter Reactor", 3, 10, 0, 30, 4));

    if (fullList || name === "AntiRadar") r.push( new BasicShipCamuflage("AntiRadar", 1, 10, 10, 5)); 
    if (fullList || name === "Luminar Mirror") r.push( new BasicShipCamuflage("Luminar Mirror", 2, 10, 20, 10));
    if (fullList || name === "Gravity Mirror") r.push( new BasicShipCamuflage("Gravity Mirror", 3, 5, 40, 15));
    if (fullList || name === "Defractor Image") r.push( new BasicPlanetaryCamuflage("Defractor Image", 1, 10, 4, 200));
    if (fullList || name === "Luminar Mirage") r.push( new BasicPlanetaryCamuflage("Luminar Mirage", 2, 5, 9, 600));
    if (fullList || name === "Planar Shift") r.push( new BasicPlanetaryCamuflage("Planar Shift", 3, 2, 14, 1000));

    if (fullList || name === "Electro Detector") r.push( new BasicShipDetector("Electro Detector", 1, 5, 10, 5));
    if (fullList || name === "Wave Detector") r.push( new BasicShipDetector("Wave Detector", 2, 5, 20, 10));
    if (fullList || name === "Planar Detector") r.push( new BasicShipDetector("Planar Detector", 3, 2, 40, 15));
    if (fullList || name === "Radio Detector") r.push( new BasicPlanetaryDetector("Radio Detector", 1, 5, 4, 300));
    if (fullList || name === "Laser Interferometer") r.push( new BasicPlanetaryDetector("Laser Interferometer", 2, 2, 9, 900));
    if (fullList || name === "Antimatter Detector") r.push( new BasicPlanetaryDetector("Antimatter Detector", 3, 1, 14, 1500));

    if (fullList || name === "Hangar") r.push( new BuildingModule("Hangar", disciplineEnum.EmpireLogistics, 0, 0, 0));
    if (fullList || name === "Command Base") r.push( new BuildingModule("Command Base", disciplineEnum.ResourceAcquisition, 0, 0, 0));

    if (fullList || name === "Thermal Panels") r.push( new solarEnergyGainBuilding("Thermal Panels", 0, 0, 1, 0));
    if (fullList || name === "Solar Panels") r.push( new solarEnergyGainBuilding("Solar Panels", 0, 0, 5, 500));
    if (fullList || name === "Advanced Solar Panels") r.push( new solarEnergyGainBuilding( "Advanced Solar Panels", 0, 0, 10, 1200));
    if (fullList || name === "Solar Power Plant") r.push( new solarEnergyGainBuilding("Solar Power Plant", 0, 0, 20, 2000));

    return r;
}


export default function TechFactory (options: TechFactoryOptions): Tech | null {
    let techArray: Tech[] = [];

    if (options.name != null && options.name != "")  {
        techArray = getTechnologies(options.name);
    }
    else {
        let auxArray = getTechnologies();
        for (const tech of auxArray) {
            let bool = true;
            if (options.tier != null) {
                if (tech.tier !== options.tier) bool = false;
            }
            if (options.discipline != null) {
                if (tech.discipline !== options.discipline) bool = false;
            }
            if (bool) techArray.push(tech);
        }
    }

    if (techArray.length > 0) {
        return techArray[Random.randomInt(0, techArray.length - 1)];
    }
    
    console.log("TechFactory returning random null: " + options);
    return null;
}
