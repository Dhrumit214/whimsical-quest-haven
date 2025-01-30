export interface Tile {
  id: number;
  value: number;
  position: number;
}

export interface GameState {
  tiles: Tile[];
  moves: number;
  gameStarted: boolean;
  gameCompleted: boolean;
  gridSize: number;
}