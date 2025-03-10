import { useParams, useLocation } from 'wouter-preact';
import { useState, useEffect, useRef, useLayoutEffect } from 'preact/hooks';
import {
  ArrowPathIcon,
  TrashIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

import DeckModel, { CardsData } from '../../deckModel';

import { CloseButton } from '../CloseButton';

import './index.css';

type NewCard = {
  term: string;
  definition: string;
};

export const EditDeck = () => {
  const { id: deckId } = useParams();
  const [_location, setLocation] = useLocation();
  const [deckModel, setDeckModel] = useState<DeckModel | null>(null);
  const [cards, setCards] = useState<CardsData | null>(null);
  const [hasDirtyChanges, setHasDirtyChanges] = useState<boolean | null>(null);
  const [deletedCardIds, setDeletedCardIds] = useState<Array<string>>([]);
  const [newCard, setNewCard] = useState<NewCard>({ term: '', definition: '' });

  const nextIdRef = useRef(0);
  const handleSaveTimeoutIdRef = useRef<number | null>(null);
  const newCardTermRef = useRef<HTMLTextAreaElement>(null);
  const deckNameRef = useRef<HTMLInputElement>(null);
  const newCardRef = useRef<NewCard>({ term: '', definition: '' });
  const deckModelRef = useRef<DeckModel | null>(null);
  const cardsRef = useRef<CardsData | null>(null);

  const deck = DeckModel.find(deckId);

  useEffect(() => {
    deckModelRef.current = deckModel;
    cardsRef.current = cards;
  }, [deckModel, cards]);

  useEffect(() => {
    newCardRef.current = newCard;
  }, [newCard]);

  useEffect(() => {
    if (deck) {
      setDeckModel(deck);
      setCards(deck.cards);
      nextIdRef.current = deck.nextId;
    } else {
      setLocation('/');
    }
  }, []);

  useLayoutEffect(() => {
    if (deckNameRef.current?.value === 'New deck') {
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

    if (deckModelRef.current) {
      deckModelRef.current[field] = value;
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
    const latestDeckModel = deckModelRef.current;
    const latestCards = cardsRef.current;

    if (latestDeckModel && latestCards) {
      const updatedDeckModel = {
        ...latestDeckModel,
        ...{
          name: latestDeckModel.name,
          cards: latestCards,
        },
      };

      latestDeckModel.save(updatedDeckModel);
      setHasDirtyChanges(false);
    }
  };

  const saveStatusIndicator = (
    <div
      class={`saveStatusIndicator ${hasDirtyChanges === false ? 'saved' : ''}`}
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
      <CloseButton returnTo="/" />
      <div className="cardGrid">
        {saveStatusIndicator}
        <div className="gridRow deckNameRow">
          <div className="gridCell deckName col-span-3">
            <input
              type="text"
              ref={deckNameRef}
              value={deckModel?.name}
              onInput={(event) => updateDeck('name', event.currentTarget.value)}
            />
          </div>
        </div>
        <div className="gridHeader">
          <div>Front</div>
          <div>Back</div>
          <div></div>
        </div>
      </div>
      <div className="cardGrid newCard">
        <div className="gridRow">
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
      </div>
      <div className="cardGrid editableCards">
        {cards &&
          Object.entries(cards)
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
                    className="sm danger deleteCard"
                    onClick={(_event) => deleteCard(cardId)}
                  >
                    <TrashIcon className="icon" />
                  </button>
                </div>
              </div>
            ))}
      </div>
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
