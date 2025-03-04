import './index.css';

interface CardProps {
  term: string;
  definition: string;
  isRevealed: boolean;
  satisfaction?: 'satisfied' | 'dissatisfied';
  hidden?: boolean;
  responseHandler?: Function;
  cardId?: number;
}

export const Card = ({
  isRevealed,
  term,
  definition,
  satisfaction,
  cardId,
  responseHandler,
}: CardProps) => {
  const isEmojiOnly = /^\p{Emoji}*$/u.test(term);
  const classes = [
    'card',
    satisfaction,
    !satisfaction && 'answering',
    isRevealed ? 'revealed' : '',
    isEmojiOnly ? 'emojiOnly' : '',
  ]
    .filter((val) => val)
    .join(' ');

  let touchStartX = 0;
  let touchEndX = 0;

  const handleTouchStart = (event: TouchEvent) => {
    const touchStart = event.touches[0];
    touchStartX = touchStart.clientX;
  };

  const handleTouchEnd = (event: TouchEvent) => {
    if (!responseHandler) {
      return;
    }

    touchEndX = event.changedTouches[0].clientX;

    const swipeDistance = touchEndX - touchStartX;

    if (swipeDistance > 50) {
      responseHandler({ satisfaction: 1, cardId: cardId });
    } else if (swipeDistance < -50) {
      responseHandler({ satisfaction: 0, cardId: cardId });
    }
  };

  return (
    <div
      className={classes}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="front">
        <div className="term">{term}</div>
      </div>

      <div className="back">
        <div className="term">{term}</div>
        <div className="definition">{definition}</div>
      </div>
    </div>
  );
};
