import {
  GameCreateDTO,
  GameCreateResult,
  GameStartResult,
  MoveVector,
  MoveResult,
  GameGetInfoResult,
  GameRegisterSecondPlayerResult,
  SetReadyToPlayResult,
} from "./models/models";

class ServiceApi {
  static host = "https://checker-game-api.egorluckydevdomain.ru";

  static async GameCreateWithHuman(dto: GameCreateDTO) {
    return ServiceApi.GameCreate(dto, "/game/create");
  }

  static async GameCreateWithBot(dto: GameCreateDTO) {
    return ServiceApi.GameCreate(dto, "/game/createWithBot");
  }

  static async GameCreate(dto: GameCreateDTO, path: string) {
    return ServiceApi.fetchApi<GameCreateResult>(
      path,
      "POST",
      dto,
      {
        "content-type": "application/json",
      },
      [200],
    );
  }

  static async RegisterSecondPlayer(gameId: string) {
    return ServiceApi.fetchApi<GameRegisterSecondPlayerResult>(
      "/game/registerSecondPlayer",
      "POST",
      gameId,
      {
        "content-type": "application/json",
      },
      [200, 400],
    );
  }

  static async ReadyToPlay(playerCode: string) {
    return ServiceApi.fetchApi<SetReadyToPlayResult>(
      "/game/readyToPlay",
      "POST",
      null,
      {
        "content-type": "application/json",
        playerCode: playerCode,
      },
      [200, 400],
    );
  }

  static GameStartWithHuman(firstPlayerCode: string) {
    return ServiceApi.GameStart(firstPlayerCode, "/game/start");
  }

  static GameStartWithBot(firstPlayerCode: string) {
    return ServiceApi.GameStart(firstPlayerCode, "/game/startWithBot");
  }

  static async GameStart(firstPlayerCode: string, path: string) {
    return ServiceApi.fetchApi<GameStartResult>(
      path,
      "POST",
      firstPlayerCode,
      {
        "content-type": "application/json",
      },
      [200, 400],
    );
  }

  static async MoveWithHuman(
    playerCode: string,
    previousBoardStateId: string,
    move: MoveVector,
  ) {
    return ServiceApi.Move(
      playerCode,
      previousBoardStateId,
      move,
      "/game/move",
    );
  }

  static async MoveWithBot(
    playerCode: string,
    previousBoardStateId: string,
    move: MoveVector,
  ) {
    return ServiceApi.Move(
      playerCode,
      previousBoardStateId,
      move,
      "/game/moveWithBot",
    );
  }

  static async Move(
    playerCode: string,
    previousBoardStateId: string,
    move: MoveVector,
    path: string,
  ) {
    return ServiceApi.fetchApi<MoveResult>(
      path,
      "POST",
      move,
      {
        "content-type": "application/json",
        playerCode: playerCode,
        previousBoardStateId: previousBoardStateId,
      },
      [200],
    );
  }

  static async GetInfo(gameId: string) {
    return ServiceApi.fetchApi<GameGetInfoResult>(
      "/game/getInfo?gameId=" + gameId,
      "GET",
      null,
      {},
      [200, 400],
    );
  }

  static async fetchApi<T>(
    path: string,
    method: string,
    body: any,
    headers: Record<string, string>,
    awaitableStatusCodes: number[],
  ) {
    const response = await fetch(this.host + path, {
      body: body && JSON.stringify(body),
      headers: headers,
      method: method,
    });

    if (!awaitableStatusCodes.includes(response.status)) {
      const text = await response.text();
      throw new Error(text);
    }

    const json = await response.json();
    const result = json as T;

    return result;
  }
}

export default ServiceApi;
