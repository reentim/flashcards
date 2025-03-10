import { Link } from 'wouter-preact';
import { PlusCircleIcon } from '@heroicons/react/24/outline';

import { DeckListCard } from '../DeckListCard';

import DeckModel from '../../deckModel';

import './index.css';

export const DeckList = () => {
  const newDeckCard = (
    <Link to="/decks/new" className="deckListCard new">
      <h3>New Deck</h3>
      <PlusCircleIcon className="icon lg" />
    </Link>
  );
  const decks = [
    newDeckCard,
    DeckModel.all().map((deck) => {
      return <DeckListCard key={deck.id} deck={deck} />;
    }),
  ];

  return <section className="deckList">{decks}</section>;
};
