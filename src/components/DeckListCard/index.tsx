import { Link } from 'wouter-preact';

import DeckModel from '../../deckModel';

import { EditDeckButton } from '../EditDeckButton';

import './index.css';

export const DeckListCard = ({ deck }: { deck: DeckModel }) => {
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
