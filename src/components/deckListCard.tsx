import { Link } from 'wouter-preact';

import DeckData from '../deckData';

import './deckListCard.css';
import { PencilSquareIcon } from '@heroicons/react/24/outline';

export const DeckListCard = ({ deck }: { deck: DeckData }) => {
  return (
    <div className="deckListCard">
      <h3>
        <Link to={`/decks/${deck.id}`}>{deck.name}</Link>
      </h3>
      {deck.size} cards
      <Link className="editDeckListCard" to={`/decks/${deck.id}/edit`}>
        <PencilSquareIcon className="icon" />
      </Link>
    </div>
  );
};
