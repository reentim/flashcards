import { Link } from 'wouter-preact';

import DeckData from '../deckData';

import { EditDeckButton } from './editDeckButton';

import './deckListCard.css';

export const DeckListCard = ({ deck }: { deck: DeckData }) => {
  return (
    <div>
      <Link to={`/decks/${deck.id}`} className="deckListCard">
        <h3>{deck.name}</h3>
        {deck.size} cards
      </Link>
      <EditDeckButton deckId={deck.id} />
    </div>
  );
};
