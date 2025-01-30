import { useState, useEffect } from "react";
import { Card as CardType } from "@/types/game";

interface CardProps {
  card: CardType;
  onCardClick: (card: CardType) => void;
  disabled: boolean;
}

const Card = ({ card, onCardClick, disabled }: CardProps) => {
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (card.isFlipped) {
      setIsFlipping(true);
      const timer = setTimeout(() => setIsFlipping(false), 300);
      return () => clearTimeout(timer);
    }
  }, [card.isFlipped]);

  return (
    <div
      onClick={() => !disabled && !card.isMatched && !card.isFlipped && onCardClick(card)}
      className={`relative w-24 h-32 cursor-pointer transition-transform duration-300
        ${disabled ? "cursor-not-allowed" : "hover:scale-105"}
        ${isFlipping ? "animate-card-flip" : ""}
        ${card.isMatched ? "animate-scale-up" : ""}`}
    >
      <div
        className={`absolute w-full h-full rounded-xl transition-all duration-300 transform-gpu backface-visibility-hidden
          ${card.isFlipped || card.isMatched ? "rotate-y-180" : ""}
          ${card.isMatched ? "opacity-60" : ""}`}
      >
        <div className="absolute w-full h-full">
          {/* Front of card */}
          <div
            className={`absolute w-full h-full rounded-xl bg-game-card border-2 border-game-primary
              flex items-center justify-center text-4xl shadow-lg
              ${!card.isFlipped && !card.isMatched ? "visible" : "invisible"}`}
          >
            ?
          </div>
          {/* Back of card */}
          <div
            className={`absolute w-full h-full rounded-xl bg-game-secondary
              flex items-center justify-center text-4xl text-white shadow-lg
              ${card.isFlipped || card.isMatched ? "visible" : "invisible"}`}
          >
            {card.value}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;