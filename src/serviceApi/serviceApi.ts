import { GameCreateDTO, GameCreateResult, GameStartResult, MoveVector, MoveResult, GameGetInfoResult } from "./models/models";

class ServiceApi{
    static host = "https://checker-game-api.egorluckydevdomain.ru";

    static async GameCreateWithHuman(dto: GameCreateDTO){
        return ServiceApi.GameCreate(dto, "/game/create")
    }

    static async GameCreateWithBot(dto: GameCreateDTO){
        return ServiceApi.GameCreate(dto, "/game/createWithBot")
    }

    static async GameCreate(dto: GameCreateDTO, path: string){
        const response = await fetch(this.host + path, {
            body: JSON.stringify(dto),
            headers:{
                "content-type": "application/json"
            },
            method: "POST"
        });

        if(!response.ok){
            const text = await response.text();
            throw new Error(text);
        }

        const json = await response.json();
        const result = json as GameCreateResult;

        return result;
    }

    static GameStartWithHuman(firstPlayerCode: string){
        return ServiceApi.GameStart(firstPlayerCode, "/game/start")
    }

    static GameStartWithBot(firstPlayerCode: string){
        return ServiceApi.GameStart(firstPlayerCode, "/game/startWithBot")
    }

    static async GameStart(firstPlayerCode: string, path: string){
        const response = await fetch(this.host + path, {
            body: JSON.stringify(firstPlayerCode),
            headers:{
                "content-type": "application/json"
            },
            method: "POST"
        });

        if(!response.ok && response.status != 400){
            const text = await response.text();
            throw new Error(text);
        }

        const json = await response.json();
        const result = json as GameStartResult;

        return result;
    }


    static async MoveWithHuman(playerCode: string, previousBoardStateId: string, move: MoveVector){
        return ServiceApi.Move(playerCode, previousBoardStateId, move, "/game/move");
    }

    static async MoveWithBot(playerCode: string, previousBoardStateId: string, move: MoveVector){
        return ServiceApi.Move(playerCode, previousBoardStateId, move, "/game/moveWithBot");
    }

    static async Move(playerCode: string, previousBoardStateId: string, move: MoveVector, path: string){
        const response = await fetch(this.host + path, {
            body: JSON.stringify(move),
            headers:{
                "content-type": "application/json",
                playerCode: playerCode,
                previousBoardStateId: previousBoardStateId
            },
            method: "POST"
        });

        if(!response.ok){
            const text = await response.text();
            throw new Error(text);
        }

        const json = await response.json();
        const result = json as MoveResult;

        return result;
    }

    static async GetInfo(gameId: string){
        const response = await fetch(this.host + "/game/getInfo?gameId=" + gameId);

        if(response.ok || response.status == 400){
            const json = await response.json();

            return json as GameGetInfoResult;
        }
        else{
            const text = await response.text();
            throw new Error(text);
        }
    }
}

export default ServiceApi; 