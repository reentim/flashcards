import { Link } from 'wouter-preact';
import { PencilSquareIcon } from '@heroicons/react/24/outline';

import './index.css';

export const EditDeckButton = ({ deckId }: { deckId: string }) => {
  return (
    <Link className="editDeckButton" to={`/decks/${deckId}/edit`}>
      <PencilSquareIcon className="icon" /> Edit
    </Link>
  );
};
