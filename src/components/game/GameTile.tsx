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
        w-full h-20 text-2xl font-bold 
        transition-all duration-300
        hover:scale-105 relative tile
        shadow-md hover:shadow-xl
        transform hover:translate-y-[-2px]
        ${tile.value === 0 ? "invisible" : ""}
        ${
          isSelected
            ? "bg-[#E6B800] text-amber-50 ring-2 ring-yellow-400"
            : tile.isAnimating
            ? "animate-scale-in"
            : tile.isCorrect
            ? "bg-gradient-to-br from-[#2F4F2F] to-[#1B2E1B] text-green-100"
            : "bg-gradient-to-br from-[#4A3B8C] to-[#2C1B6E] text-indigo-100 hover:from-[#5A4B9C] hover:to-[#3C2B7E]"
        }
        rounded-lg
        font-['Nunito']
        active:transform active:scale-95
        before:absolute before:inset-0 before:rounded-lg before:shadow-inner before:pointer-events-none
      `}
      disabled={disabled}
      style={getPositionStyle()}
    >
      {tile.value || ""}
    </Button>
  );
};

export default GameTile;