import { shuffle } from 'lodash';

import Storage from './storage';
import ResponseData from './responseData';

interface DeckOptions {
  id: string;
  name: string;
  cards: CardsData;
}

type CardsData = {
  [id: string]: [string, string];
};

type IterableCard = [number, string, string];
export type IterableCardsData = Array<IterableCard>;

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

  constructor(props: DeckOptions) {
    const { id, name, cards } = props;

    this.id = id;
    this.name = name;
    this.cards = cards;
    this.settings = Storage.get(`deck_${id}_options`) || {
      markAsLearntAfter: 3,
    };
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

  orderedCards(): IterableCardsData {
    const allAnswers: Array<[string, number][]> = this.responses().map(
      (response: ResponseData) => Object.entries(response.satisfaction)
    );
    const learntCardIds = new Set(
      Object.entries(
        allAnswers.reduce(
          (acc, response) => {
            response.forEach(([cardId, value]) => {
              acc[cardId] = value === 0 ? 0 : (acc[cardId] || 0) + value;
            });
            return acc;
          },
          {} as { [key: string]: number }
        )
      )
        .filter(
          ([_cardId, streak]) => streak >= this.settings.markAsLearntAfter
        )
        .map(([cardId, _streak]) => cardId)
    );
    const cardIds = new Set(Object.keys(this.cards)).difference(learntCardIds);
    const previouslyCorrectCardIds = new Set(
      allAnswers
        .flat(1)
        .filter(([_cardId, satisfaction]) => satisfaction === 1)
        .map(([cardId, _satisfaction]) => cardId)
    ).intersection(cardIds);
    const previouslyIncorrectCardIds = new Set(
      allAnswers
        .flat(1)
        .filter(([_cardId, satisfaction]) => satisfaction === 0)
        .map(([cardId, _satisfaction]) => cardId)
    )
      .difference(previouslyCorrectCardIds)
      .intersection(cardIds);
    const previouslyUnansweredCardIds = cardIds.difference(
      previouslyCorrectCardIds.union(previouslyIncorrectCardIds)
    );

    return [
      previouslyCorrectCardIds,
      previouslyIncorrectCardIds,
      previouslyUnansweredCardIds,
    ]
      .flatMap((set) => shuffle(Array.from(set)) as Array<string>)
      .map((id: string) => [parseInt(id), ...this.cards[id]]);
  }
}
