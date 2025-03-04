import { Link } from 'wouter-preact';
import { PlusCircleIcon } from '@heroicons/react/24/outline';

import { DeckListCard } from './deckListCard';

import DeckData from '../deckData';

import './deckList.css';

export const DeckList = () => {
  const newDeckCard = (
    <Link to="/decks/new" className="deckListCard new">
      <h3>New Deck</h3>
      <PlusCircleIcon className="icon lg" />
    </Link>
  );
  const decks = [
    newDeckCard,
    DeckData.all().map((deck) => {
      return <DeckListCard key={deck.id} deck={deck} />;
    }),
  ];

  return <section className="deckList">{decks}</section>;
};
