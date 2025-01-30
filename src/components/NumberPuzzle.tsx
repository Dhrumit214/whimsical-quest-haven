import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { GameState, Tile } from "@/types/game";
import GameControls from "./GameControls";
import { toast } from "sonner";
import { Lightbulb, ArrowLeft, ArrowRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const NumberPuzzle = () => {
  const [gameState, setGameState] = useState<GameState>({
    tiles: [],
    moves: 0,
    gameStarted: false,
    gameCompleted: false,
    gridSize: 3,
    moveHistory: [],
    currentHistoryIndex: -1,
  });
  const [hintTile, setHintTile] = useState<number | null>(null);
  const [previousHints, setPreviousHints] = useState<Set<number>>(new Set());

  const initializeGame = (size: number = gameState.gridSize) => {
    const totalTiles = size * size;
    const initialTiles: Tile[] = Array.from({ length: totalTiles - 1 }, (_, i) => ({
      id: i + 1,
      value: i + 1,
      position: i,
      isCorrect: true,
    }));
    
    initialTiles.push({ id: totalTiles, value: 0, position: totalTiles - 1 });
    
    const shuffledTiles = [...initialTiles]
      .sort(() => Math.random() - 0.5)
      .map((tile, index) => ({ 
        ...tile, 
        position: index,
        isCorrect: tile.value === 0 ? false : index === tile.value - 1
      }));

    setGameState({
      ...gameState,
      tiles: shuffledTiles,
      moves: 0,
      gameStarted: true,
      gameCompleted: false,
      gridSize: size,
      moveHistory: [],
      currentHistoryIndex: -1,
    });
  };

  const checkWin = (tiles: Tile[]) => {
    return tiles.every((tile) => tile.value === 0 || tile.position === tile.value - 1);
  };

  const findBestMove = () => {
    const emptyTile = gameState.tiles.find((tile) => tile.value === 0);
    if (!emptyTile) return null;

    const movableTiles = gameState.tiles.filter((tile) =>
      canMoveTile(tile.position, emptyTile.position)
    );

    let bestTile = null;
    let bestScore = -Infinity;

    movableTiles.forEach((tile) => {
      // Skip if this tile was recently suggested
      if (previousHints.has(tile.position)) {
        return;
      }

      const currentRow = Math.floor(tile.position / gameState.gridSize);
      const currentCol = tile.position % gameState.gridSize;
      const targetRow = Math.floor((tile.value - 1) / gameState.gridSize);
      const targetCol = (tile.value - 1) % gameState.gridSize;
      const currentDistance = Math.abs(currentRow - targetRow) + Math.abs(currentCol - targetCol);

      // Only consider tiles that aren't in their correct position
      if (currentDistance === 0) {
        return;
      }

      const newRow = Math.floor(emptyTile.position / gameState.gridSize);
      const newCol = emptyTile.position % gameState.gridSize;
      const newDistance = Math.abs(newRow - targetRow) + Math.abs(newCol - targetCol);

      const improvement = currentDistance - newDistance;
      const score = improvement + (currentDistance / 10);

      if (score > bestScore) {
        bestScore = score;
        bestTile = tile;
      }
    });

    // If no good moves found, clear previous hints and try again
    if (!bestTile && previousHints.size > 0) {
      setPreviousHints(new Set());
      return findBestMove();
    }

    return bestTile?.position ?? null;
  };

  const showHint = () => {
    const bestMove = findBestMove();
    if (bestMove !== null) {
      setHintTile(bestMove);
      setPreviousHints(prev => new Set([...prev, bestMove]));
      setTimeout(() => setHintTile(null), 2000);
    }
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

  const getProgressPercentage = () => {
    const correctTiles = gameState.tiles.filter(
      (tile) => tile.value !== 0 && tile.position === tile.value - 1
    ).length;
    return Math.round((correctTiles / (gameState.tiles.length - 1)) * 100);
  };

  const undoMove = () => {
    if (gameState.currentHistoryIndex > 0) {
      const previousMove = gameState.moveHistory[gameState.currentHistoryIndex - 1];
      const newTiles = gameState.tiles.map(tile => {
        if (tile.position === previousMove[0]) {
          return { ...tile, position: previousMove[1] };
        }
        if (tile.position === previousMove[1]) {
          return { ...tile, position: previousMove[0] };
        }
        return tile;
      });

      setGameState({
        ...gameState,
        tiles: newTiles,
        moves: gameState.moves - 1,
        currentHistoryIndex: gameState.currentHistoryIndex - 1,
      });
    }
  };

  const redoMove = () => {
    if (gameState.currentHistoryIndex < gameState.moveHistory.length - 1) {
      const nextMove = gameState.moveHistory[gameState.currentHistoryIndex + 1];
      const newTiles = gameState.tiles.map(tile => {
        if (tile.position === nextMove[0]) {
          return { ...tile, position: nextMove[1] };
        }
        if (tile.position === nextMove[1]) {
          return { ...tile, position: nextMove[0] };
        }
        return tile;
      });

      setGameState({
        ...gameState,
        tiles: newTiles,
        moves: gameState.moves + 1,
        currentHistoryIndex: gameState.currentHistoryIndex + 1,
      });
    }
  };

  const moveTile = (tilePosition: number) => {
    if (!gameState.gameStarted || gameState.gameCompleted) return;

    const emptyTile = gameState.tiles.find((tile) => tile.value === 0);
    if (!emptyTile) return;

    if (!canMoveTile(tilePosition, emptyTile.position)) return;

    setHintTile(null);
    setPreviousHints(new Set());

    const newTiles = gameState.tiles.map((tile) => {
      if (tile.position === tilePosition) {
        return { ...tile, position: emptyTile.position };
      }
      if (tile.value === 0) {
        return { ...tile, position: tilePosition };
      }
      return {
        ...tile,
        isCorrect: tile.value !== 0 && (
          tile.position === tile.value - 1 ||
          (tile.position === tilePosition && emptyTile.position === tile.value - 1)
        )
      };
    });

    const newHistory = gameState.moveHistory.slice(0, gameState.currentHistoryIndex + 1);
    newHistory.push([tilePosition, emptyTile.position]);

    const isComplete = checkWin(newTiles);

    setGameState({
      ...gameState,
      tiles: newTiles,
      moves: gameState.moves + 1,
      gameCompleted: isComplete,
      moveHistory: newHistory,
      currentHistoryIndex: gameState.currentHistoryIndex + 1,
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
        <div className="mb-4">
          <Select
            value={gameState.gridSize.toString()}
            onValueChange={(value) => initializeGame(parseInt(value))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">Easy (2x2)</SelectItem>
              <SelectItem value="3">Medium (3x3)</SelectItem>
              <SelectItem value="4">Hard (4x4)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <GameControls
          moves={gameState.moves}
          score={getProgressPercentage()}
          onReset={initializeGame}
          gameCompleted={gameState.gameCompleted}
        />
        
        <div className="relative p-6 bg-white rounded-xl shadow-lg mb-4">
          <div
            className="grid gap-2"
            style={{
              gridTemplateColumns: `repeat(${gameState.gridSize}, minmax(0, 1fr))`,
            }}
          >
            {gameState.tiles.map((tile) => {
              const row = Math.floor(tile.position / gameState.gridSize);
              const col = tile.position % gameState.gridSize;
              const correctPosition = tile.value - 1;
              const correctRow = Math.floor(correctPosition / gameState.gridSize);
              const correctCol = correctPosition % gameState.gridSize;
              
              return (
                <Button
                  key={tile.id}
                  onClick={() => moveTile(tile.position)}
                  className={`
                    w-full h-20 text-2xl font-bold 
                    transition-all duration-300 transform 
                    hover:scale-105 relative
                    ${tile.value === 0 ? "invisible" : ""}
                    ${
                      hintTile === tile.position
                        ? "bg-game-accent hover:bg-game-accent/90 animate-pulse"
                        : tile.isCorrect
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-game-primary hover:bg-game-primary/90"
                    }
                    rounded-lg shadow-md
                  `}
                  style={{
                    gridRow: row + 1,
                    gridColumn: col + 1,
                  }}
                  disabled={gameState.gameCompleted}
                >
                  {tile.value || ""}
                  {tile.value !== 0 && (
                    <span className="absolute top-1 right-1 text-xs opacity-50">
                      {`${correctRow + 1},${correctCol + 1}`}
                    </span>
                  )}
                </Button>
              );
            })}
          </div>
        </div>

        <div className="flex gap-4 mb-4">
          <Button
            onClick={undoMove}
            disabled={gameState.currentHistoryIndex <= 0}
            className="flex-1 bg-gray-500 hover:bg-gray-600"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Undo
          </Button>
          <Button
            onClick={redoMove}
            disabled={gameState.currentHistoryIndex >= gameState.moveHistory.length - 1}
            className="flex-1 bg-gray-500 hover:bg-gray-600"
          >
            Redo
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        <div className="flex gap-4">
          <Button
            onClick={showHint}
            className="flex-1 bg-game-secondary hover:bg-game-secondary/90 text-white font-medium py-3 rounded-lg shadow-md transition-all duration-300"
            disabled={gameState.gameCompleted}
          >
            <Lightbulb className="mr-2 h-5 w-5" />
            Show Hint
          </Button>
          <Button
            onClick={() => initializeGame(gameState.gridSize)}
            className="flex-1 bg-game-accent hover:bg-game-accent/90 text-white font-medium py-3 rounded-lg shadow-md transition-all duration-300"
          >
            {gameState.gameCompleted ? "Play Again" : "New Game"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NumberPuzzle;
