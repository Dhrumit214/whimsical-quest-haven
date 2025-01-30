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
      <div className="flex gap-8 text-xl bg-white p-4 rounded-lg shadow-md w-full justify-center">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-600">Moves:</span>
          <span className="font-bold text-game-primary">{moves}</span>
        </div>
      </div>
      <Button
        onClick={onReset}
        className="bg-game-accent hover:bg-game-accent/90 text-white w-full py-3 rounded-lg shadow-md transition-all duration-300"
      >
        {gameCompleted ? "Play Again" : "New Game"}
      </Button>
    </div>
  );
};

export default GameControls;