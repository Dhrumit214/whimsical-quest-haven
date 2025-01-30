import { useState, useEffect } from "react";
import { Card as CardType } from "@/types/game";
import Card from "./Card";
import GameControls from "./GameControls";
import { useToast } from "@/components/ui/use-toast";

const CARD_VALUES = ["🎮", "🎲", "🎯", "🎨", "🎭", "🎪", "🎢", "🎡"];

const MemoryGame = () => {
  const { toast } = useToast();
  const [cards, setCards] = useState<CardType[]>([]);
  const [flippedCards, setFlippedCards] = useState<CardType[]>([]);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);

  const initializeGame = () => {
    const shuffledCards = [...CARD_VALUES, ...CARD_VALUES]
      .sort(() => Math.random() - 0.5)
      .map((value, index) => ({
        id: index,
        value,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffledCards);
    setFlippedCards([]);
    setMoves(0);
    setScore(0);
    setGameCompleted(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const handleCardClick = (clickedCard: CardType) => {
    if (flippedCards.length === 2) return;

    const newCards = cards.map((card) =>
      card.id === clickedCard.id ? { ...card, isFlipped: true } : card
    );
    setCards(newCards);
    setFlippedCards([...flippedCards, clickedCard]);
  };

  useEffect(() => {
    if (flippedCards.length === 2) {
      setMoves((prev) => prev + 1);

      if (flippedCards[0].value === flippedCards[1].value) {
        setCards((prevCards) =>
          prevCards.map((card) =>
            card.id === flippedCards[0].id || card.id === flippedCards[1].id
              ? { ...card, isMatched: true }
              : card
          )
        );
        setScore((prev) => prev + 10);
        toast({
          title: "Match found!",
          description: "+10 points",
          duration: 1500,
        });
      } else {
        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((card) =>
              card.id === flippedCards[0].id || card.id === flippedCards[1].id
                ? { ...card, isFlipped: false }
                : card
            )
          );
        }, 1000);
      }
      setTimeout(() => setFlippedCards([]), 1000);
    }
  }, [flippedCards, toast]);

  useEffect(() => {
    if (cards.length > 0 && cards.every((card) => card.isMatched)) {
      setGameCompleted(true);
      toast({
        title: "Congratulations!",
        description: `You completed the game in ${moves} moves!`,
        duration: 3000,
      });
    }
  }, [cards, moves, toast]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-game-primary/10 to-game-secondary/10">
      <h1 className="text-4xl font-bold mb-8 text-game-primary">Memory Game</h1>
      <GameControls
        moves={moves}
        score={score}
        onReset={initializeGame}
        gameCompleted={gameCompleted}
      />
      <div className="grid grid-cols-4 gap-4 p-4 rounded-xl bg-white/50 backdrop-blur-sm shadow-xl">
        {cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            onCardClick={handleCardClick}
            disabled={flippedCards.length === 2}
          />
        ))}
      </div>
    </div>
  );
};

export default MemoryGame;