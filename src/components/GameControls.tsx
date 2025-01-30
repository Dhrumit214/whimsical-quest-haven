import { Button } from "@/components/ui/button";

interface GameControlsProps {
  moves: number;
  score: number;
  onReset: () => void;
  gameCompleted: boolean;
}

const GameControls = ({ moves, onReset, gameCompleted }: GameControlsProps) => {
  return (
    <div className="flex flex-col items-center gap-4 mb-8">
      <div className="flex gap-8 text-xl">
        <div className="flex items-center gap-2">
          <span className="font-bold">Moves:</span>
          <span>{moves}</span>
        </div>
      </div>
      <Button
        onClick={onReset}
        className="bg-game-accent hover:bg-game-accent/90 text-white"
      >
        {gameCompleted ? "Play Again" : "New Game"}
      </Button>
    </div>
  );
};

export default GameControls;