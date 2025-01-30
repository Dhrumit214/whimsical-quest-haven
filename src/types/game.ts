export interface Tile {
  id: number;
  value: number;
  position: number;
  isCorrect?: boolean;
  isAnimating?: boolean;
}

export interface GameState {
  tiles: Tile[];
  moves: number;
  gameStarted: boolean;
  gameCompleted: boolean;
  gridSize: number;
  moveHistory: number[][];
  currentHistoryIndex: number;
}

export interface MoveDirection {
  from: number;
  to: number;
}

export interface Card {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
}