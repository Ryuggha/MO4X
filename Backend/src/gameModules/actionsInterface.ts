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
}
