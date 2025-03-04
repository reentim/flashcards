import Storage from './storage';
import ResponseData from './responseData';
import CardSet from './cardSet';

export interface DeckProps {
  id: string;
  name: string;
  cards: CardsData;
  nextId: number;
  settings?: DeckSettings;
}

export type CardsData = {
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
  nextId: number;
  cardSet: CardSet;

  constructor(props: DeckProps) {
    const { id, name, cards, nextId } = props;

    this.id = id;
    this.name = name;
    this.cards = cards;
    this.settings = Storage.get(`deck_${id}_settings`) || {
      markAsLearntAfter: 3,
    };
    this.cardSet = new CardSet(this);
    this.nextId = nextId || 1;
  }

  static all(): Array<DeckData> {
    const ids = Storage.get('deckIds') || [];

    return ids.map((id: string) => this.find(id));
  }

  static find(id: string | undefined): DeckData | undefined {
    const data = id && Storage.get(`deck_${id}`);

    return (
      data &&
      new this({
        id: id,
        name: data.name,
        cards: data.cards,
        nextId: data.nextId,
      })
    );
  }

  static async prepareInbuilt() {
    if (!Storage.get('deckIds')) {
      const inbuiltDecks = ['worldFlags', 'riverCities', 'russianNouns'];

      const fetchPromises = inbuiltDecks.map(async (deck) => {
        const response = await fetch(`/decks/${deck}.json`);
        const file = await response.json();

        this.saveNew(file);
      });

      await Promise.all(fetchPromises);
    }
  }

  static saveNew(data: ParsedDeckJSON) {
    const id = crypto.randomUUID();
    const cards = Object.fromEntries(
      Object.entries(data.cards).map((e, i) => [i + 1, [...e]])
    );

    const transformedData = {
      ...data,
      cards: cards,
      nextId:
        Math.max(...Object.keys(cards).map((key: string) => parseInt(key))) + 1,
    };

    Storage.append('deckIds', id);
    Storage.set(`deck_${id}`, transformedData);

    return this.find(id);
  }

  get size() {
    return Object.keys(this.cards).length;
  }

  delete() {
    const ids = Storage.get('deckIds') || [];

    Storage.set(
      'deckIds',
      ids.filter((id: string) => id !== this.id)
    );
    Storage.remove(`deck_${this.id}`);
  }

  save(args: DeckProps) {
    const { name, cards, settings } = args;
    let { nextId } = args;

    if (Object.keys(cards).length > Object.keys(this.cards).length) {
      nextId += 1;
    }

    this.cards = cards;
    this.name = name;
    this.nextId = nextId;
    Storage.set(`deck_${this.id}`, { name, cards, nextId });

    if (settings) {
      this.settings = settings;
      Storage.set(`deck_${this.id}_settings`, settings);
    }
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
