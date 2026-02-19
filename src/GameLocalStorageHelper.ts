import { GamePlayer } from "./serviceApi/models/models";

export class GameLocalStorageHelper {
  constructor(localStorage: Storage) {
    this.localStorage = localStorage;
  }
  private localStorage!: Storage;
  private getPlayerCodeKey = (gameId: string) => "gameId" + gameId;
  private getRoleKey = (gameId: string) => "role" + gameId;

  savePlayerCode = (playerCode: string, gameId: string) => {
    const key = this.getPlayerCodeKey(gameId);
    this.localStorage.setItem(key, playerCode);
  };
  savePlayerRole = (role: GamePlayer, gameId: string) => {
    const key = this.getRoleKey(gameId);
    this.localStorage.setItem(key, role);
  };
  savePlayerCodeAndRole = (
    playerCode: string,
    role: GamePlayer,
    gameId: string,
  ) => {
    this.savePlayerCode(playerCode, gameId);
    this.savePlayerRole(role, gameId);
  };

  getPlayerCode = (gameId: string) => {
    const key = this.getPlayerCodeKey(gameId);
    return this.localStorage.getItem(key);
  };
  getPlayerRole = (gameId: string) => {
    const key = this.getRoleKey(gameId);
    return this.localStorage.getItem(key) as GamePlayer;
  };
  getPlayerCodeAndRole = (gameId: string) => ({
    playerCode: this.getPlayerCode(gameId),
    role: this.getPlayerRole(gameId),
  });
}
