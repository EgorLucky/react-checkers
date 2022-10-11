class GameCreateDTO{
    myCheckerColor!: string;
    opponentCheckerColor!: string;
    checkerCellColor!: string;
    nonPlayableCellColor!: string;
    myBoardSide!: string
}

class GameCreateResult{
    id!: string;
    firstPlayerCode!: string;
}

type GameRegisterSecondPlayerResult = {
    success: boolean
    message: string;
    code: string | null;
}

type SetReadyToPlayResult = {
    success: boolean
    message: string
}

class GameStartResult{
    success!: boolean
    message!: string
    awaitableMove?: GamePlayer
    boardState?: BoardState
}

class BoardState{
    id!: string
    gameId!: string
    board!: Board
    createDateTime!: Date
    previousBoardStateId!: string
}

class Board{
    checkerCellColor!: string
    nonPlayableCellColor!: string
    cells!: Array<Cell>
}

class Cell{
    color!: string
    checker!: Checker
    coordinate!: CellCoordinate
}

class Checker{
    color!: string
    boardSide!: BoardSide
    role!: CheckerRole
    possibleMoves?: Array<Move>
}


class Move{
    moveVector!: MoveVector
    capturableCheckerCoordinate?: CellCoordinate
}

class GameGetInfoResult{
    success!: boolean
    message!: string
    state!: GameState
    boardState!: BoardState
    awaitableMove!: GamePlayer|null 
    winner?: GamePlayer 
}

class MoveResult{
    success!: boolean;
    message!: string;
    newBoardState!: BoardState;
    awaitableMove!: GamePlayer|null
}

class MoveVector{
    from!: CellCoordinate;
    to!: CellCoordinate;
}

class CellCoordinate{
    horizontal!: BoardHorizontalCoordinates;
    vertical!: BoardVerticalCoordinates;
}

enum BoardHorizontalCoordinates{ A = "A", B = "B", C = "C", D = "D", E = "E", F = "F", G = "G", H = "H" }

enum BoardVerticalCoordinates { One = "One", Two = "Two", Three = "Two", Four = "Four", Five = "Five", Six = "Six", Seven = "Seven", Eight = "Eight" }

enum BoardSide { FirstSide = "FirstSide", SecondSide = "SecondSide"}

enum GamePlayer { FirstPlayer = "FirstPlayer", SecondPlayer = "SecondPlayer" }

enum CheckerRole { Men = "Men", King = "King" }

enum GameState { 
    Created = "Created",
    AllPlayersRegistred = "AllPlayersRegistred",
    SecondPlayerReadyToPlay = "SecondPlayerReadyToPlay",
    Running = "Running",
    Finished = "Finished"
}

export {
    BoardSide,
    GamePlayer,
    GameState,
    GameCreateDTO,
    GameCreateResult,
    GameGetInfoResult,
    MoveVector,
    MoveResult,
    GameStartResult,
    Board,
    BoardVerticalCoordinates,
    Cell,
    BoardHorizontalCoordinates,
    Checker
};
export type { GameRegisterSecondPlayerResult, SetReadyToPlayResult };
