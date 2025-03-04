import { Link, useParams, useLocation } from 'wouter-preact';
import { useState, useEffect, useRef, useLayoutEffect } from 'preact/hooks';
import {
  ArrowPathIcon,
  TrashIcon,
  XMarkIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

import DeckData, { CardsData } from '../deckData';

import './editDeck.css';

type NewCard = {
  term: string;
  definition: string;
};

export const EditDeck = () => {
  const { id: deckId } = useParams();
  const [_location, setLocation] = useLocation();
  const [deckData, setDeckData] = useState<DeckData | null>(null);
  const [cards, setCards] = useState<CardsData | null>(null);
  const [hasDirtyChanges, setHasDirtyChanges] = useState<boolean | null>(null);
  const [deletedCardIds, setDeletedCardIds] = useState<Array<string>>([]);
  const [newCard, setNewCard] = useState<NewCard>({ term: '', definition: '' });

  const nextIdRef = useRef(0);
  const handleSaveTimeoutIdRef = useRef<number | null>(null);
  const newCardTermRef = useRef<HTMLTextAreaElement>(null);
  const deckNameRef = useRef<HTMLInputElement>(null);
  const newCardRef = useRef<NewCard>({ term: '', definition: '' });
  const deckDataRef = useRef<DeckData | null>(null);
  const cardsRef = useRef<CardsData | null>(null);

  const deck = DeckData.find(deckId);

  useEffect(() => {
    deckDataRef.current = deckData;
    cardsRef.current = cards;
  }, [deckData, cards]);

  useEffect(() => {
    newCardRef.current = newCard;
  }, [newCard]);

  useEffect(() => {
    if (deck) {
      setDeckData(deck);
      setCards(deck.cards);
      nextIdRef.current = deck.nextId;
    } else {
      setLocation('/');
    }
  }, []);

  useLayoutEffect(() => {
    const deck = DeckData.find(deckId);

    if (deck?.name === 'New deck') {
      deckNameRef.current?.select();
    }
  });

  const handleNewCardInput = (field: 'term' | 'definition', value: string) => {
    newCardRef.current = {
      ...newCardRef.current,
      [field]: value,
    };
  };

  const addCard = () => {
    setHasDirtyChanges(true);

    setCards((previousCards) => {
      return {
        ...previousCards,
        [nextIdRef.current]: Object.values(newCardRef.current),
      };
    });

    setNewCard({ term: '', definition: '' });

    if (newCardTermRef.current) {
      newCardTermRef.current.focus();
    }

    nextIdRef.current += 1;

    debouncedHandleSave(500);
  };

  const updateDeck = (field: 'name', value: string) => {
    setHasDirtyChanges(true);

    if (deckDataRef.current) {
      deckDataRef.current[field] = value;
    }

    debouncedHandleSave();
  };

  const updateCard = (
    cardId: string,
    field: 'term' | 'definition',
    value: string
  ) => {
    setHasDirtyChanges(true);

    if (cardsRef.current) {
      cardsRef.current = {
        ...cardsRef.current,
        [cardId]: [
          field === 'term' ? value : cardsRef.current[cardId][0],
          field === 'definition' ? value : cardsRef.current[cardId][1],
        ],
      };
    }

    debouncedHandleSave();
  };

  const deleteCard = (cardId: string) => {
    setHasDirtyChanges(true);
    setDeletedCardIds((deletedCardIds) => {
      return [...deletedCardIds, cardId];
    });

    setCards((previousCards) => {
      if (!previousCards) {
        return null;
      }

      const { [cardId]: _, ...otherCards } = previousCards;

      cardsRef.current = otherCards;

      return otherCards;
    });

    handleSave();
  };

  const debouncedHandleSave = (timeout: number = 1000) => {
    if (handleSaveTimeoutIdRef.current) {
      clearTimeout(handleSaveTimeoutIdRef.current);
    }

    handleSaveTimeoutIdRef.current = window.setTimeout(handleSave, timeout);
  };

  const handleSave = () => {
    const latestDeckData = deckDataRef.current;
    const latestCards = cardsRef.current;

    if (latestDeckData && latestCards) {
      const updatedDeckData = {
        ...latestDeckData,
        ...{
          name: latestDeckData.name,
          cards: latestCards,
        },
      };

      latestDeckData.save(updatedDeckData);
      setHasDirtyChanges(false);
    }
  };

  const saveStatusIndicator = (
    <div
      class={`gridCell saveStatusIndicator ${hasDirtyChanges === false ? 'saved' : ''}`}
    >
      {hasDirtyChanges === true && (
        <ArrowPathIcon className="icon arrowSpinner" />
      )}

      {hasDirtyChanges === false && (
        <>
          <CheckCircleIcon className="icon checkSaved" />
        </>
      )}
    </div>
  );

  const handleKeyDown = (event: KeyboardEvent) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault();

      addCard();
    }
  };

  const isDeletedCard = (cardId: string) => deletedCardIds.includes(cardId);

  const handleDeleteDeck = () => {
    if (window.confirm('Permanently delete deck?')) {
      deck?.delete();
      setLocation('/');
    }
  };

  return (
    <section className="editDeck">
      {cards && (
        <div className="cardGrid">
          <div className="closeIcon">
            <Link to="/">
              <XMarkIcon className="icon" />
            </Link>
          </div>
          <div className="gridRow deckNameRow">
            <div className="gridCell deckName col-span-2">
              <input
                type="text"
                ref={deckNameRef}
                value={deckData?.name}
                onInput={(event) =>
                  updateDeck('name', event.currentTarget.value)
                }
              />
            </div>
            {saveStatusIndicator}
          </div>
          <div className="gridHeader">
            <div>Front</div>
            <div>Back</div>
            <div></div>
          </div>
          <div className="gridRow newCard">
            <div className="gridCell">
              <textarea
                rows={5}
                ref={newCardTermRef}
                value={newCard.term}
                onKeyDown={handleKeyDown}
                onInput={(event) =>
                  handleNewCardInput('term', event.currentTarget.value)
                }
              ></textarea>
            </div>
            <div className="gridCell">
              <textarea
                rows={5}
                value={newCard.definition}
                onKeyDown={handleKeyDown}
                onInput={(event) =>
                  handleNewCardInput('definition', event.currentTarget.value)
                }
              ></textarea>
            </div>
            <div className="gridCell">
              <button onClick={addCard}>Add</button>
            </div>
          </div>
          {Object.entries(cards)
            .reverse()
            .map(([cardId, [term, definition]]) => (
              <div
                className={`gridRow ${isDeletedCard(cardId) ? 'deleted' : ''}`}
                key={cardId}
              >
                <div className="gridCell">
                  <textarea
                    onInput={(event) =>
                      updateCard(cardId, 'term', event.currentTarget.value)
                    }
                  >
                    {term}
                  </textarea>
                </div>
                <div className="gridCell">
                  <textarea
                    onInput={(event) =>
                      updateCard(
                        cardId,
                        'definition',
                        event.currentTarget.value
                      )
                    }
                  >
                    {definition}
                  </textarea>
                </div>
                <div className="gridCell">
                  <button
                    class="sm danger"
                    onClick={(_event) => deleteCard(cardId)}
                  >
                    <TrashIcon className="icon" />
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
      <div className="cardGrid">
        <div className="gridRow">
          <div className="gridCell col-span-3">
            <button className="btn danger" onClick={handleDeleteDeck}>
              Delete deck
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
