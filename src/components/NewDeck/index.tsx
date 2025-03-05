import { useLocation } from 'wouter-preact';

import DeckModel from '../../deckModel';

export const NewDeck = () => {
  const [_location, setLocation] = useLocation();

  const deck = DeckModel.saveNew({
    name: 'New deck',
    cards: {},
  });

  if (deck) {
    setLocation(`/decks/${deck.id}/edit`, { replace: true });
  }

  return <h3>Something went wrong...</h3>;
};
