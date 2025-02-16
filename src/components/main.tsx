import { render } from 'preact';

import '../styles/index.css';

import { App } from './app';

import DeckData from '../deckData';

DeckData.prepareInbuilt();

render(<App />, document.getElementById('app')!);
