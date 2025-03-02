import { Link } from 'wouter-preact';
import { PlusCircleIcon } from '@heroicons/react/24/outline';

import { DeckListCard } from './deckListCard';

import DeckData from '../deckData';

import './deckList.css';

export const DeckList = () => {
  const decks = [
    <div className="deckListCard new">
      <h3>
        <Link to="/decks/new">New Deck</Link>
      </h3>
      <PlusCircleIcon className="icon lg" />
    </div>,
    DeckData.all().map((deck) => {
      return <DeckListCard key={deck.id} deck={deck} />;
    }),
  ];

  return <section className="deckList">{decks}</section>;
};
