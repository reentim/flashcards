import Storage from './storage';
import ResponseData from './responseData';
import CardSet from './cardSet';

interface DeckOptions {
  id: string;
  name: string;
  cards: CardsData;
}

type CardsData = {
  [id: string]: [string, string];
};

interface ParsedDeckJSON {
  name: string;
  cards: {
    [key: string]: string;
  };
}

interface DeckSettings {
  markAsLearntAfter: number;
}

export default class DeckData {
  id: string;
  name: string;
  cards: CardsData;
  settings: DeckSettings;
  cardSet: CardSet;

  constructor(props: DeckOptions) {
    const { id, name, cards } = props;

    this.id = id;
    this.name = name;
    this.cards = cards;
    this.settings = Storage.get(`deck_${id}_options`) || {
      markAsLearntAfter: 3,
    };
    this.cardSet = new CardSet(this);
  }

  static all(): Array<DeckData> {
    const ids = Storage.get('deckIds') || [];

    return ids.map((id: string) => this.find(id));
  }

  static find(id: string | undefined): DeckData | undefined {
    const deck = id && Storage.get(`deck_${id}`);

    return deck && new this({ id: id, name: deck.name, cards: deck.cards });
  }

  static prepareInbuilt() {
    if (!Storage.get('deckIds')) {
      const decks = ['worldFlags', 'russianNouns'];

      decks.forEach((deck) => {
        (async () => {
          const response = await fetch(`/decks/${deck}.json`);
          const file = await response.json();

          this.saveNew(file);
        })();
      });
    }
  }

  static saveNew(data: ParsedDeckJSON) {
    const id = crypto.randomUUID();
    const transformedData = {
      ...data,
      cards: Object.fromEntries(
        Object.entries(data.cards).map((e, i) => [i + 1, [...e]])
      ),
    };

    Storage.append('deckIds', id);
    Storage.set(`deck_${id}`, transformedData);
  }

  get size() {
    return Object.keys(this.cards).length;
  }

  responses() {
    return (Storage.get(`deck_${this.id}_responseIds`) || []).map(
      (id: string) => ResponseData.find(id)
    );
  }

  lastResponse() {
    const id = Storage.get(`deck_${this.id}_responseIds`)?.at(-1);

    if (id) {
      return ResponseData.find(id);
    }
  }
}
