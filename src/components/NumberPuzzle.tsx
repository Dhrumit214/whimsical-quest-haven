import React, { useState, useEffect } from "react";
import { GameState } from "@/types/game";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import GameBoard from "./game/GameBoard";
import GameControls from "./game/GameControls";

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
  const [powerUpActive, setPowerUpActive] = useState(false);
  const [selectedTile, setSelectedTile] = useState<number | null>(null);

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

  const findBestMove = (attemptCount = 0) => {
    if (attemptCount > 1) return null;

    const emptyTile = gameState.tiles.find((tile) => tile.value === 0);
    if (!emptyTile) return null;

    const movableTiles = gameState.tiles.filter((tile) =>
      canMoveTile(tile.position, emptyTile.position)
    );

    let bestTile = null;
    let bestScore = -Infinity;

    movableTiles.forEach((tile) => {
      if (previousHints.has(tile.position)) {
        return;
      }

      const currentRow = Math.floor(tile.position / gameState.gridSize);
      const currentCol = tile.position % gameState.gridSize;
      const targetRow = Math.floor((tile.value - 1) / gameState.gridSize);
      const targetCol = (tile.value - 1) % gameState.gridSize;
      const currentDistance = Math.abs(currentRow - targetRow) + Math.abs(currentCol - targetCol);

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

    if (!bestTile && previousHints.size > 0 && attemptCount === 0) {
      setPreviousHints(new Set());
      return findBestMove(attemptCount + 1);
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

  const handleTilePowerUp = (tilePosition: number) => {
    if (!powerUpActive) return;

    if (selectedTile === null) {
      setSelectedTile(tilePosition);
      toast.info("Now click where you want to place this tile");
    } else {
      const newTiles = gameState.tiles.map(tile => {
        if (tile.position === selectedTile) {
          return { 
            ...tile, 
            position: tilePosition,
            isAnimating: true 
          };
        }
        if (tile.position === tilePosition) {
          return { 
            ...tile, 
            position: selectedTile,
            isAnimating: true 
          };
        }
        return tile;
      });

      setGameState({
        ...gameState,
        tiles: newTiles,
        moves: gameState.moves + 1,
      });

      setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          tiles: prev.tiles.map(tile => ({
            ...tile,
            isAnimating: false
          }))
        }));
      }, 300);

      setPowerUpActive(false);
      setSelectedTile(null);
      toast.success("Tiles switched successfully!");
    }
  };

  const moveTile = (tilePosition: number) => {
    if (!gameState.gameStarted || gameState.gameCompleted) return;

    if (powerUpActive) {
      handleTilePowerUp(tilePosition);
      return;
    }

    const emptyTile = gameState.tiles.find((tile) => tile.value === 0);
    if (!emptyTile) return;

    if (!canMoveTile(tilePosition, emptyTile.position)) return;

    setHintTile(null);
    setPreviousHints(new Set());

    const newTiles = gameState.tiles.map((tile) => {
      if (tile.position === tilePosition) {
        return { ...tile, position: emptyTile.position, isAnimating: true };
      }
      if (tile.value === 0) {
        return { ...tile, position: tilePosition, isAnimating: true };
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

    setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        tiles: prev.tiles.map(tile => ({
          ...tile,
          isAnimating: false
        }))
      }));
    }, 300);

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

        <GameBoard
          gameState={gameState}
          selectedTile={selectedTile}
          gameCompleted={gameState.gameCompleted}
          onTileClick={moveTile}
        />

        <GameControls
          onUndo={undoMove}
          onRedo={redoMove}
          onHint={showHint}
          onPowerUp={() => {
            setPowerUpActive(!powerUpActive);
            setSelectedTile(null);
            if (!powerUpActive) {
              toast.info("Select a tile to move it anywhere!");
            }
          }}
          onNewGame={() => initializeGame(gameState.gridSize)}
          canUndo={gameState.currentHistoryIndex > 0}
          canRedo={gameState.currentHistoryIndex < gameState.moveHistory.length - 1}
          powerUpActive={powerUpActive}
          gameCompleted={gameState.gameCompleted}
        />
      </div>
    </div>
  );
};

export default NumberPuzzle;
