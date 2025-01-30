export interface Card {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface GameState {
  cards: Card[];
  score: number;
  moves: number;
  gameStarted: boolean;
  gameCompleted: boolean;
}