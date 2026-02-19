import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ServiceApi from "../../serviceApi/serviceApi";
import { 
  GameGetInfoResult, 
  GamePlayer, 
  GameStartResult, 
  GameState, 
  MoveResult, 
  MoveVector, 
  Board 
} from "../../serviceApi/models/models";
import BoardComponent from "../BoardComponent";
import delay from "delay";
import { Link } from "react-router-dom";
import { GameLocalStorageHelper } from "../../GameLocalStorageHelper";

function Game(props: { 
                        skipJoinGameLink: boolean, 
                        api: {
                                startGameEndpoint: (firstPlayerCode: string) => Promise<GameStartResult>
                                moveEndpoint: (playerCode: string, previousBoardStateId: string, move: MoveVector) => Promise<MoveResult>
                             }
                      }) {
    const { skipJoinGameLink, api } = props;
    const { id } = useParams();
    const [ gameInfo, setGameInfo ] = useState<GameGetInfoResult | null>(null);
    const gameState = gameInfo?.state;
    const storage = new GameLocalStorageHelper(localStorage)

    const {playerCode, role} = storage.getPlayerCodeAndRole(id as string);

    if (!playerCode)
      throw new Error("player code not found");

    if (gameState === GameState.Running && !gameInfo?.boardState.board)
      throw new Error("board is null");

    useEffect(() => {
      if (!id)
        return;
      const getData = async () => {
        if (gameState === GameState.SecondPlayerReadyToPlay && role === GamePlayer.FirstPlayer) {
          const startGameResult = await api.startGameEndpoint(playerCode)

          if (!startGameResult.success)
            throw new Error(startGameResult.message);

          if (!startGameResult.awaitableMove)
            throw new Error("awaitable move unknown");
          
          if (!startGameResult.boardState)
            throw new Error("boardState is null");
          
          setGameInfo({
            success: startGameResult.success,
            message: startGameResult.message,
            awaitableMove: startGameResult.awaitableMove,
            boardState: startGameResult.boardState,
            state: GameState.Running
          });

          return;
        }

        if (gameInfo?.awaitableMove === role) {
          return;
        }

        if (gameState === GameState.Finished)
          return;

        const newGameInfo = await ServiceApi.GetInfo(id);
        setGameInfo(newGameInfo);

        await delay(300)
      }

      getData().catch(console.error);
    });

    const move = async (vector: MoveVector) => {
      try {
        const moveResult = await api.moveEndpoint(playerCode, gameInfo?.boardState.id as string, vector);
        if(!moveResult.success) {
          throw new Error("move result is not success");
        }

        setGameInfo({
          success: moveResult.success,
          message: moveResult.message,
          awaitableMove: moveResult.awaitableMove,
          boardState: moveResult.newBoardState,
          state: GameState.Running
        })
      }
      catch(error) {
        console.log(error)
      }
    }

    const joinGameLink = document.location.origin + document.location.pathname + "#/joinGame/" + id;
    const copyJoinGameLinkToClipBoard = () => {
      navigator.clipboard.writeText(joinGameLink)
    }

    const createdAndIAmFirstPlayer = gameState === GameState.Created && role === GamePlayer.FirstPlayer
    const createdAndIAmSecondPlayer = gameState === GameState.Created && role === GamePlayer.SecondPlayer
    const allPlayersRegistredAndIAmFirstPlayer = gameState === GameState.AllPlayersRegistred && role === GamePlayer.FirstPlayer
    const allPlayersRegistredAndIAmSecondPlayer = gameState === GameState.AllPlayersRegistred && role === GamePlayer.SecondPlayer
    const secondPlayerReadyToPlayAndIAmFirstPlayer = gameState === GameState.SecondPlayerReadyToPlay && role === GamePlayer.FirstPlayer
    const secondPlayerReadyToPlayAndIAmSecondPlayer = gameState === GameState.SecondPlayerReadyToPlay && role === GamePlayer.SecondPlayer
    const runningOrFinished = gameState === GameState.Running || gameState === GameState.Finished

    return (
        <div>
          { 
            (!gameState && <>Getting info about game</>)
            || (createdAndIAmFirstPlayer && skipJoinGameLink && <>Wait for opponent registration</>)
            || (createdAndIAmFirstPlayer && !skipJoinGameLink && 
                <>Send this link to your opponent: 
                  <br/>
                  { joinGameLink }
                  <br/>
                  <button onClick={copyJoinGameLinkToClipBoard}>Copy</button> 
                  <br/>and wait for his/her registration
                </>
                )
            || (createdAndIAmSecondPlayer && <button>Register in game</button>)
            || (allPlayersRegistredAndIAmFirstPlayer && <>Opponent has registred, waiting for opponent will be ready to play</>)
            || (allPlayersRegistredAndIAmSecondPlayer && <button>I'm ready to play</button>)
            || (secondPlayerReadyToPlayAndIAmFirstPlayer && <>Opponent is ready to play. Starting the game...</>)
            || (secondPlayerReadyToPlayAndIAmSecondPlayer && <>Waiting for start of the game by game creator</>)
            || (runningOrFinished && 
                <>
                  {gameState === GameState.Finished && <>Game over. {gameInfo?.winner === role ? "You won" : "You lose"} <br/><Link to="/">Menu</Link></>}
                  <BoardComponent 
                    board={gameInfo?.boardState?.board as Board} 
                    awaitableMove={gameInfo?.awaitableMove as GamePlayer}
                    role={role}
                    //boardSide={gameInfo.} 
                    makeMove={move}/>
                </>)
          }
        </div>
    );
  }

  export default Game;