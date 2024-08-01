import axios from 'axios';
import { useEffect, useState, ChangeEvent } from 'react';
import { Card } from '../../views/cardsList';

interface QueryCardsProps {
  cards: Card[]
  setCards: (card: Card[]) => void
}

export function Input({ cards, setCards }: QueryCardsProps) {
  const [randomPlaceHolder, setRandomPlaceHolder] = useState<string>('');
  const [search, setSearch] = useState<string>('')

  const getRandomPlaceHolder = async function fetchRandomName() {
    const response = await axios.get('https://api.scryfall.com/cards/random');
    setRandomPlaceHolder(response.data.name);
  };

  useEffect(() => {
    getRandomPlaceHolder();
  }, []);

  const handleCardQuery = (event: ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    const oldCards = { ...cards }
    setSearch(query);
    setCards(queryCards)

  }

  const queryCards =
    search.trim() !== ''
      ? cards.filter((card) =>
        card.name.toLowerCase().includes(search.toLowerCase())
      )
      : cards;

  return (
    <div>
      <input
        type="text"
        className="h-10 rounded-md w-full bg-orange-200 border-2 border-orange-800 placeholder-orange-800 placeholder:font-bold placeholder:indent-5 indent-5 placeholder:opacity-50"
        placeholder={randomPlaceHolder}
        onChange={handleCardQuery}
      />
    </div>
  );
}
