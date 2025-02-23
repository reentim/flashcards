import { shuffle } from 'lodash';

import DeckData from './deckData';
import ResponseData from './responseData';

export type IterableCard = [number, string, string];

export type IterableCardsData = Array<IterableCard>;

export default class CardSet {
  deck: DeckData;
  allAnswers: Array<[string, number][]>;
  satisfactionStreak: {
    [key: string]: number;
  };

  constructor(deck: DeckData) {
    this.deck = deck;
    this.allAnswers = deck
      .responses()
      .map((response: ResponseData) => Object.entries(response.satisfaction));
    this.satisfactionStreak = this.allAnswers.reduce(
      (acc, response) => {
        response.forEach(([cardId, value]) => {
          acc[cardId] = value === 0 ? 0 : (acc[cardId] || 0) + value;
        });
        return acc;
      },
      {} as { [key: string]: number }
    );
  }

  orderedCards(): IterableCardsData {
    const cardIds = new Set(Object.keys(this.deck.cards)).difference(
      this.learntCardIds()
    );
    const previouslyCorrectCardIds = new Set(
      this.allAnswers
        .flat(1)
        .filter(([_cardId, satisfaction]) => satisfaction === 1)
        .map(([cardId, _satisfaction]) => cardId)
    ).intersection(cardIds);
    const previouslyIncorrectCardIds = new Set(
      this.allAnswers
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
      .flatMap((set) => shuffle(Array.from(set)))
      .map((id: string) => [parseInt(id), ...this.deck.cards[id]]);
  }

  learntCardIds() {
    return this.cardIdsWithStreakMatching(
      (streak: number) => streak >= this.deck.settings.markAsLearntAfter
    );
  }

  learnableCardIds() {
    return this.cardIdsWithStreakMatching(
      (streak: number) => streak === this.deck.settings.markAsLearntAfter - 1
    );
  }

  cardIdsWithStreakMatching(evaluation: Function) {
    return new Set(
      Object.entries(this.satisfactionStreak)
        .filter(([_cardId, streak]) => evaluation.apply(this, [streak]))
        .map(([cardId, _streak]) => cardId)
    );
  }
}
