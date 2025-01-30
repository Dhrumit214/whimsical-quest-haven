import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { GameState, Tile } from "@/types/game";
import GameControls from "./GameControls";
import { toast } from "sonner";

const NumberPuzzle = () => {
  const [gameState, setGameState] = useState<GameState>({
    tiles: [],
    moves: 0,
    gameStarted: false,
    gameCompleted: false,
    gridSize: 3,
  });

  const initializeGame = () => {
    const totalTiles = gameState.gridSize * gameState.gridSize;
    const initialTiles: Tile[] = Array.from({ length: totalTiles - 1 }, (_, i) => ({
      id: i + 1,
      value: i + 1,
      position: i,
    }));
    
    // Add empty tile
    initialTiles.push({ id: totalTiles, value: 0, position: totalTiles - 1 });
    
    // Shuffle tiles
    const shuffledTiles = [...initialTiles]
      .sort(() => Math.random() - 0.5)
      .map((tile, index) => ({ ...tile, position: index }));

    setGameState({
      ...gameState,
      tiles: shuffledTiles,
      moves: 0,
      gameStarted: true,
      gameCompleted: false,
    });
  };

  const checkWin = (tiles: Tile[]) => {
    return tiles.every((tile) => tile.value === 0 || tile.position === tile.value - 1);
  };

  const canMoveTile = (tilePosition: number, emptyPosition: number) => {
    const row1 = Math.floor(tilePosition / gameState.gridSize);
    const col1 = tilePosition % gameState.gridSize;
    const row2 = Math.floor(emptyPosition / gameState.gridSize);
    const col2 = emptyPosition % gameState.gridSize;
    
    return (
      (Math.abs(row1 - row2) === 1 && col1 === col2) ||
      (Math.abs(col1 - col2) === 1 && row1 === row2)
    );
  };

  const moveTile = (tilePosition: number) => {
    if (!gameState.gameStarted || gameState.gameCompleted) return;

    const emptyTile = gameState.tiles.find((tile) => tile.value === 0);
    if (!emptyTile) return;

    if (!canMoveTile(tilePosition, emptyTile.position)) return;

    const newTiles = gameState.tiles.map((tile) => {
      if (tile.position === tilePosition) {
        return { ...tile, position: emptyTile.position };
      }
      if (tile.value === 0) {
        return { ...tile, position: tilePosition };
      }
      return tile;
    });

    const isComplete = checkWin(newTiles);

    setGameState({
      ...gameState,
      tiles: newTiles,
      moves: gameState.moves + 1,
      gameCompleted: isComplete,
    });

    if (isComplete) {
      toast.success("Congratulations! You solved the puzzle!", {
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    initializeGame();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-md">
        <GameControls
          moves={gameState.moves}
          score={0}
          onReset={initializeGame}
          gameCompleted={gameState.gameCompleted}
        />
        
        <div
          className="grid gap-2"
          style={{
            gridTemplateColumns: `repeat(${gameState.gridSize}, minmax(0, 1fr))`,
          }}
        >
          {gameState.tiles.map((tile) => {
            const row = Math.floor(tile.position / gameState.gridSize);
            const col = tile.position % gameState.gridSize;
            
            return (
              <Button
                key={tile.id}
                onClick={() => moveTile(tile.position)}
                className={`w-full h-20 text-2xl font-bold transition-all duration-300 transform hover:scale-105 ${
                  tile.value === 0
                    ? "invisible"
                    : "bg-game-primary hover:bg-game-primary/90"
                }`}
                style={{
                  gridRow: row + 1,
                  gridColumn: col + 1,
                }}
                disabled={gameState.gameCompleted}
              >
                {tile.value || ""}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NumberPuzzle;