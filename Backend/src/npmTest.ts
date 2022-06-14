import mongoose from "mongoose";
import SimplexNoise from "simplex-noise";
import disciplineEnum from "./gameModules/disciplineEnum";
import StarType from "./gameModules/StarType";
import TechFactory from "./gameModules/TechFactory";
import Vector2 from "./gameModules/Vector2";

let a = new SimplexNoise(0);
console.log(a.noise2D(1, 34))