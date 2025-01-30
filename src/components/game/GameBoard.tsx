import React from "react";
import GameTile from "./GameTile";
import { GameState } from "@/types/game";

interface GameBoardProps {
  gameState: GameState;
  selectedTile: number | null;
  gameCompleted: boolean;
  onTileClick: (position: number) => void;
}

const GameBoard: React.FC<GameBoardProps> = ({
  gameState,
  selectedTile,
  gameCompleted,
  onTileClick,
}) => {
  return (
    <div className="relative p-6 bg-white rounded-xl shadow-lg mb-4">
      <div
        className="tile-grid"
        style={{
          gridTemplateColumns: `repeat(${gameState.gridSize}, minmax(0, 1fr))`,
          width: "100%",
          height: "300px",
          position: "relative",
        }}
      >
        {gameState.tiles.map((tile) => (
          <GameTile
            key={tile.id}
            tile={tile}
            gridSize={gameState.gridSize}
            isSelected={selectedTile === tile.position}
            onClick={() => onTileClick(tile.position)}
            disabled={gameCompleted}
          />
        ))}
      </div>
    </div>
  );
};

export default GameBoard;