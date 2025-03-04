import { useLocation } from 'wouter-preact';

import DeckData from '../../deckData';

export const NewDeck = () => {
  const [_location, setLocation] = useLocation();

  const deck = DeckData.saveNew({
    name: 'New deck',
    cards: {},
  });

  if (deck) {
    setLocation(`/decks/${deck.id}/edit`, { replace: true });
  }

  return <h3>Something went wrong...</h3>;
};
