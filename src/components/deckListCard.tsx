import { Link } from 'wouter-preact';

import DeckData from '../deckData';

import './deckListCard.css';

export const DeckListCard = ({ deck }: { deck: DeckData }) => {
  return (
    <div className="deckListCard">
      <h3>
        <Link to={`/decks/${deck.id}`}>{deck.name}</Link>
      </h3>
      {deck.size} cards
    </div>
  );
};
