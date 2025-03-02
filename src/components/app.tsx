import { Switch, Route } from 'wouter-preact';

import { DeckList } from './deckList';
import { Deck } from './deck';
import { EditDeck } from './editDeck';
import { NewDeck } from './newDeck';

import './app.css';

export const App = () => {
  return (
    <>
      <Switch>
        <Route path="/decks" component={DeckList} />
        <Route path="/decks/new" component={NewDeck} />
        <Route path="/decks/:id" component={Deck} />
        <Route path="/decks/:id/edit" component={EditDeck} />
        <Route path="/" component={DeckList} />
      </Switch>
    </>
  );
};
