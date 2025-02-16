import { Switch, Route } from 'wouter-preact';

import { DeckList } from './deckList';
import { Deck } from './deck';

import './app.css';

export const App = () => {
  return (
    <>
      <Switch>
        <Route path="/decks" component={DeckList} />
        <Route path="/decks/:id" component={Deck} />
      </Switch>
    </>
  );
};
