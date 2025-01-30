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

export interface Card {
  id: number;
  value: string | number;
  isFlipped: boolean;
  isMatched: boolean;
}