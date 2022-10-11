import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ServiceApi from "../../serviceApi/serviceApi";
import { GameGetInfoResult, GamePlayer, GameStartResult, GameState, MoveResult, MoveVector, Board } from "../../serviceApi/models/models";
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

    if(playerCode === null)
      throw new Error("player code not found");

    if(gameState == GameState.Running && gameInfo?.boardState.board === undefined)
      throw new Error("board is null");

    useEffect(() => {
      if(id === undefined)
        return;
      const getData = async () => {
        if(gameState == GameState.SecondPlayerReadyToPlay && role == GamePlayer.FirstPlayer){
          const startGameResult = await api.startGameEndpoint(playerCode)

          if(!startGameResult.success)
            throw new Error(startGameResult.message);

          if(startGameResult.awaitableMove == null)
            throw new Error("awaitable move unknown");
          
          if(startGameResult.boardState == null)
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

        if(gameInfo?.awaitableMove === role){
          return;
        }

        if(gameState === GameState.Finished)
          return;

        const newGameInfo = await ServiceApi.GetInfo(id);
        setGameInfo(newGameInfo);

        await delay(300)
      }

      getData().catch(console.error);
    });

    const move = async (vector: MoveVector) => {
      try{
        const moveResult = await api.moveEndpoint(playerCode, gameInfo?.boardState.id as string, vector);
        if(!moveResult.success){
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
      catch(error){
        console.log(error)
      }
    }

    const joinGameLink = document.location.origin + document.location.pathname + "#/joinGame/" + id;
    const copyJoinGameLinkToClipBoard = () => {
      navigator.clipboard.writeText(joinGameLink)
    }
    
    return (
        <div>
          { 
            gameState === undefined && <>Getting info about game</> 
            || gameState === GameState.Created && role === GamePlayer.FirstPlayer && skipJoinGameLink && <>Wait for opponent registration</> 
            || gameState === GameState.Created && role === GamePlayer.FirstPlayer && !skipJoinGameLink && 
              <>Send this link to your opponent: 
                <br/>
                { joinGameLink }
                <br/>
                <button onClick={copyJoinGameLinkToClipBoard}>Copy</button> 
                <br/>and wait for his/her registration</>
            || gameState === GameState.Created && role === GamePlayer.SecondPlayer && <button>Register in game</button>
            || gameState === GameState.AllPlayersRegistred && role === GamePlayer.FirstPlayer && <>Opponent has registred, waiting for opponent will be ready to play</> 
            || gameState === GameState.AllPlayersRegistred && role === GamePlayer.SecondPlayer && <button>I'm ready to play</button>
            || gameState === GameState.SecondPlayerReadyToPlay && role === GamePlayer.FirstPlayer && <>Opponent is ready to play. Starting the game...</>
            || gameState === GameState.SecondPlayerReadyToPlay && role === GamePlayer.SecondPlayer && <>Waiting for start of the game by game creator</>
            || gameState === GameState.Running && <BoardComponent 
                                                      board={gameInfo?.boardState?.board as Board} 
                                                      awaitableMove={gameInfo?.awaitableMove as GamePlayer}
                                                      role={role} 
                                                      makeMove={move}/>
            || gameState === GameState.Finished && <>Game over. {gameInfo?.winner == role? "You won": "You lose"} <br/><Link to="/">Menu</Link></>
          }
        </div>
    );
  }

  export default Game;