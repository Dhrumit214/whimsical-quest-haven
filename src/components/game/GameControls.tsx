import React from "react";
import { Button } from "@/components/ui/button";
import { Lightbulb, ArrowLeft, ArrowRight, Hand } from "lucide-react";

interface GameControlsProps {
  onUndo: () => void;
  onRedo: () => void;
  onHint: () => void;
  onPowerUp: () => void;
  onNewGame: () => void;
  canUndo: boolean;
  canRedo: boolean;
  powerUpActive: boolean;
  gameCompleted: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({
  onUndo,
  onRedo,
  onHint,
  onPowerUp,
  onNewGame,
  canUndo,
  canRedo,
  powerUpActive,
  gameCompleted,
}) => {
  return (
    <>
      <div className="flex gap-4 mb-4">
        <Button
          onClick={onUndo}
          disabled={!canUndo}
          className="flex-1 bg-gray-500 hover:bg-gray-600"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Undo
        </Button>
        <Button
          onClick={onRedo}
          disabled={!canRedo}
          className="flex-1 bg-gray-500 hover:bg-gray-600"
        >
          Redo
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>

      <div className="flex gap-4">
        <Button
          onClick={onHint}
          className="flex-1 bg-game-secondary hover:bg-game-secondary/90 text-white"
          disabled={gameCompleted}
        >
          <Lightbulb className="mr-2 h-5 w-5" />
          Show Hint
        </Button>
        <Button
          onClick={onPowerUp}
          className={`flex-1 ${
            powerUpActive
              ? "bg-yellow-500 hover:bg-yellow-600"
              : "bg-game-secondary hover:bg-game-secondary/90"
          } text-white`}
          disabled={gameCompleted}
        >
          <Hand className="mr-2 h-5 w-5" />
          {powerUpActive ? "Cancel Switch" : "Switch Tiles"}
        </Button>
        <Button
          onClick={onNewGame}
          className="flex-1 bg-game-accent hover:bg-game-accent/90 text-white"
        >
          {gameCompleted ? "Play Again" : "New Game"}
        </Button>
      </div>
    </>
  );
};

export default GameControls;