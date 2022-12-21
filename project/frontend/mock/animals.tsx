import { pan1, pan2, pan3 } from "./pans"
import {specieKruk, specieLew, specieLisPolarny, specieZebra} from "./spieces"

export const animal1={
    id:1,
    name:"Leon",
    birthDate: new Date(),
    arrivalDate: new Date(),
    spiece: specieLew,
    pan: pan1,
    treatments: []
}

export const animal2={
    id:2,
    name:"Tiko",
    birthDate: new Date(),
    arrivalDate: new Date(),
    spiece: specieLew,
    pan: pan1,
    treatments: []
}
export const animal3={
    id:3,
    name:"Zebrucha",
    birthDate: new Date(),
    arrivalDate: new Date(),
    spiece: specieZebra,
    pan: pan2,
    treatments: []
}
export const animal4={
    id:4,
    name:"Białas",
    birthDate: new Date(),
    arrivalDate: new Date(),
    spiece: specieLisPolarny,
    pan: pan3,
    treatments: []
}
export const animal5={
    id:5,
    name:"Czarnuch",
    birthDate: new Date(),
    arrivalDate: new Date(),
    spiece: specieKruk,
    pan: pan2,
    treatments: []
}