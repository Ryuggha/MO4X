import mongoose from "mongoose";
import StarType from "./gameModules/StarType";

let stars = [
    {id: 0, orbits: [0, 1, 2, 3, 4]},
    {id: 1, orbits: [0, 1, 2, 3, 6]},
    {id: 2, orbits: [0, 1, 2, 3, 13]},
] 

console.log(stars.filter(s => {return s.orbits.filter(o => {return 6 == o}).length >= 1}));