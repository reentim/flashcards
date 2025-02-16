import { Link } from 'wouter-preact';

import DeckData from '../deckData';

export const DeckList = () => {
  const deckUi = (deck: DeckData) => (
    <li>
      <Link to={`/decks/${deck.id}`}>{deck.name}</Link>
    </li>
  );
  const decksUi = DeckData.all().map((deck) => {
    return <ul>{deckUi(deck)}</ul>;
  });

  return <>{decksUi}</>;
};
