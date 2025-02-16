import Storage from './storage';

interface DeckOptions {
  id: string;
  name: string;
  cards: CardsData;
}

export type CardsData = Array<[number, string, string]>;

interface ParsedDeckJSON {
  name: string;
  cards: {
    [key: string]: string;
  };
}

export default class DeckData {
  id: string;
  name: string;
  cards: CardsData;

  constructor(props: DeckOptions) {
    const { id, name, cards } = props;

    this.id = id;
    this.name = name;
    this.cards = cards;
  }

  static all(): Array<DeckData> {
    const ids = Storage.get('decks') || [];

    return ids.map((id: string) => this.find(id));
  }

  static find(id: string | undefined): DeckData | undefined {
    const deck = id && Storage.get(`deck_${id}`);

    return deck && new this({ id: id, name: deck.name, cards: deck.cards });
  }

  static prepareInbuilt() {
    if (!Storage.get('decks')) {
      (async () => {
        const response = await fetch('/decks/worldFlags.json');
        const file = await response.json();

        this.saveNew(file);
      })();
    }
  }

  static saveNew(data: ParsedDeckJSON) {
    const id = crypto.randomUUID();
    const transformedData = {
      ...data,
      cards: Object.entries(data.cards).map((e, i) => [i + 1, ...e]),
    };

    Storage.append('decks', id);
    Storage.set(`deck_${id}`, transformedData);
  }

  get size() {
    return Object.keys(this.cards).length;
  }
}
