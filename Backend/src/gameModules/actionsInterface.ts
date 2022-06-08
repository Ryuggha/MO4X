export interface actionListInterface {
    gameId: string,
    userId: string,
    actionList: actionInterface[],
};

export interface actionInterface {
    code: number,
};

export interface moveShip extends actionInterface {
    shipId: string,
    targetStarId: string,
};

export interface changeStarName extends actionInterface {
    starId: string,
    newName: string,
};

export interface selectTechnology extends actionInterface {
    starId: string,
    planetId: string,
    technologyName: string,
};

export interface buildBuilding extends actionInterface {
    starId: string,
    planetId: string,
    buildingName: string,
}
