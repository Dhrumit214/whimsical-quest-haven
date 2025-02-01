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
        w-full h-20 text-4xl font-bold 
        transition-all duration-300
        hover:scale-105 relative tile
        ${tile.value === 0 ? "invisible" : ""}
        ${
          isSelected
            ? "ring-2 ring-yellow-400 bg-[#D946EF] hover:bg-[#D946EF]/90"
            : tile.isAnimating
            ? "animate-scale-in"
            : tile.isCorrect
            ? "bg-emerald-500 hover:bg-emerald-600"
            : "bg-[#0EA5E9] hover:bg-[#0EA5E9]/90"
        }
        rounded-lg shadow-lg
        text-white
        border-none
        transform hover:-translate-y-1
      `}
      disabled={disabled}
      style={getPositionStyle()}
    >
      {tile.value || ""}
    </Button>
  );
};

export default GameTile;