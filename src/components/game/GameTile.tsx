import React from "react";
import { Button } from "@/components/ui/button";
import { Tile } from "@/types/game";

interface GameTileProps {
  tile: Tile;
  gridSize: number;
  isSelected: boolean;
  onClick: () => void;
  disabled: boolean;
}

const GameTile: React.FC<GameTileProps> = ({
  tile,
  gridSize,
  isSelected,
  onClick,
  disabled,
}) => {
  const getPositionStyle = () => {
    const row = Math.floor(tile.position / gridSize);
    const col = tile.position % gridSize;
    return {
      transform: `translate(${col * 100}%, ${row * 100}%)`,
      transition: 'transform 0.3s ease-in-out',
      position: 'absolute' as const,
      width: `calc(100% / ${gridSize})`,
      height: `calc(100% / ${gridSize})`,
    };
  };

  return (
    <Button
      onClick={onClick}
      className={`
        w-full h-20 text-3xl font-bold 
        transition-all duration-300
        hover:scale-105 relative tile
        ${tile.value === 0 ? "invisible" : ""}
        ${
          isSelected
            ? "ring-2 ring-yellow-400"
            : tile.isAnimating
            ? "animate-scale-in"
            : tile.isCorrect
            ? "bg-green-500 hover:bg-green-600"
            : "bg-game-primary hover:bg-game-primary/90"
        }
        rounded-lg shadow-md
      `}
      disabled={disabled}
      style={getPositionStyle()}
    >
      {tile.value || ""}
    </Button>
  );
};

export default GameTile;