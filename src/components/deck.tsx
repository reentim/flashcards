import { useParams, useLocation } from 'wouter-preact';
import { useState, useEffect, useRef } from 'preact/hooks';

import DeckData from '../deckData';
import { IterableCardsData } from '../cardSet';
import ResponseData from '../responseData';

import { Card } from './card';

import './deck.css';

type DeckMetaData = {
  name: string;
  size: number;
} | null;

type SatisfactionData = {
  [cardId: string]: 0 | 1;
};

export const Deck = () => {
  const [index, setIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [satisfaction, setSatisfaction] = useState<SatisfactionData>({});
  const [cardsData, setCardsData] = useState<IterableCardsData | null>(null);
  const [deckMetaData, setDeckMetaData] = useState<DeckMetaData>(null);
  const [responseId, setResponseId] = useState<string | null>(null);
  const [learnableCardIds, setLearnableCardIds] = useState<Array<string>>([]);
  const [learntCount, setLearntCount] = useState(0);

  const [_location, setLocation] = useLocation();

  const remainingCount = (deckMetaData?.size || 0) - index - learntCount;
  const cardsRemainingSummary = [
    learntCount > 0 && `${learntCount} learnt`,
    `${remainingCount} to review`,
  ]
    .filter((val) => val)
    .join(', ');
  const answerCount = Object.values(satisfaction).length;
  const satisfiedCount = Object.values(satisfaction).filter(
    (value) => value === 1
  ).length;

  const deckId = useParams().id;
  const cardData = {
    id: cardsData?.at(index)?.at(0) as number,
    term: cardsData?.at(index)?.at(1) as string,
    definition: cardsData?.at(index)?.at(2) as string,
  };
  const refs = useRef({
    isRevealed: isRevealed,
    index: index,
    cardData: cardData,
    responseId: responseId,
    learntCount: learntCount,
    learnableCardIds: learnableCardIds,
  });

  useEffect(() => {
    const deck = DeckData.find(deckId);

    if (deck) {
      setCardsData(deck.cardSet.orderedCards());
      setLearnableCardIds(Array.from(deck.cardSet.learnableCardIds()));
      setDeckMetaData({ name: deck.name, size: deck.size });
      setLearntCount(deck.cardSet.learntCardIds().size);
    } else {
      setLocation('/');
    }

    setResponseId(crypto.randomUUID());
  }, []);

  useEffect(() => {
    refs.current.index = index;
    refs.current.isRevealed = isRevealed;
    refs.current.cardData = cardData;
    refs.current.responseId = responseId;
    refs.current.learntCount = learntCount;
    refs.current.learnableCardIds = learnableCardIds;
  }, [
    index,
    isRevealed,
    cardData,
    responseId,
    learntCount,
    learnableCardIds,
  ]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleKeyDown = (event: KeyboardEvent) => {
    const revealKeys = ['ArrowUp', 'ArrowDown', 'Enter', ' '];

    if (revealKeys.includes(event.key)) {
      revealDefinition();
    } else if (refs.current.isRevealed) {
      switch (event.key) {
        case 'ArrowLeft':
          saveResponse({ satisfaction: 0, cardId: refs.current.cardData.id });
          break;
        case 'ArrowRight':
          saveResponse({ satisfaction: 1, cardId: refs.current.cardData.id });
          break;
      }
    }
  };

  const revealDefinition = () => {
    setIsRevealed(true);
  };

  const isCardLearnable = (cardId: number) => {
    return refs.current.learnableCardIds.includes(`${cardId}`)
  }

  const saveResponse = (props: { satisfaction: 0 | 1; cardId: number }) => {
    const { satisfaction: value, cardId } = props;

    if (value === 1 && isCardLearnable(cardId)) {
      setLearntCount(refs.current.learntCount + 1);
    }

    setSatisfaction(Object.assign(satisfaction, { [cardId]: value }));
    ResponseData.saveNew({
      id: refs.current.responseId!,
      deckId: deckId!,
      satisfaction: satisfaction,
    });
    selectNextCard();
  };

  const selectNextCard = () => {
    setIndex(refs.current.index + 1);
    setIsRevealed(false);
  };

  const metaDataUi = (
    <div className="metaData">
      <h3>
        {deckMetaData?.name} &bull; {cardsRemainingSummary}
        {answerCount > 0 && (
          <>
            &nbsp;&bull; {satisfiedCount}/{answerCount}
          </>
        )}
      </h3>
    </div>
  );

  const deckUi = (
    <>
      {metaDataUi}
      <Card
        isRevealed={isRevealed}
        term={cardData.term}
        definition={cardData.definition}
      />
    </>
  );

  return <section className="deck">{deckUi}</section>;
};
