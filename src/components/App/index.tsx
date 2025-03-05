import { Switch, Route } from 'wouter-preact';
import { useEffect, useState } from 'preact/hooks';

import DeckModel from '../../deckModel';

import { DeckList } from '../DeckList';
import { Deck } from '../Deck';
import { EditDeck } from '../EditDeck';
import { NewDeck } from '../NewDeck';

import './index.css';

export const App = () => {
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      await DeckModel.prepareInbuilt();
      setHasLoaded(true);
    })();
  }, []);

  return (
    hasLoaded && (
      <>
        <Switch>
          <Route path="/decks" component={DeckList} />
          <Route path="/decks/new" component={NewDeck} />
          <Route path="/decks/:id" component={Deck} />
          <Route path="/decks/:id/edit" component={EditDeck} />
          <Route path="/" component={DeckList} />
        </Switch>
      </>
    )
  );
};
