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
            ? "bg-[#FEF7CD] text-amber-700 ring-2 ring-yellow-400"
            : tile.isAnimating
            ? "animate-scale-in"
            : tile.isCorrect
            ? "bg-gradient-to-br from-[#F2FCE2] to-[#D4E8C1] text-green-700"
            : "bg-gradient-to-br from-[#E5DEFF] to-[#C5B8FF] text-indigo-700 hover:from-[#E8E2FF] hover:to-[#CAC0FF]"
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