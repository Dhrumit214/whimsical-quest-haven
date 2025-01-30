import { Button } from "@/components/ui/button";
import { Lightbulb } from "lucide-react";

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
    </div>
  );
};

export default GameControls;