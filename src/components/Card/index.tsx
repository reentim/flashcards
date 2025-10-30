import './index.css';

interface CardProps {
  term: string;
  definition: string;
  isRevealed: boolean;
  satisfaction?: 'satisfied' | 'dissatisfied';
  hidden?: boolean;
  responseHandler?: Function;
  cardId?: number;
  onReveal?: Function;
}

export const Card = ({
  isRevealed,
  term,
  definition,
  satisfaction,
  cardId,
  responseHandler,
  onReveal,
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

  let touchStart = { x: 0, y: 0 };
  let touchEnd = { x: 0, y: 0 };

  const handleTouchStart = (event: TouchEvent) => {
    event.preventDefault();
    touchStart = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY,
    };
  };

  const handleTouchEnd = (event: TouchEvent) => {
    event.preventDefault();

    if (!responseHandler) {
      return;
    }

    touchEnd = {
      x: event.changedTouches[0].clientX,
      y: event.changedTouches[0].clientY,
    };

    const swipeDistance = {
      x: touchEnd.x - touchStart.x,
      y: touchEnd.y - touchStart.y,
    };

    if (!isRevealed) {
      if (swipeDistance.y > 25) {
        onReveal && onReveal();
      }
    } else {
      if (swipeDistance.x > 25) {
        responseHandler({ satisfaction: 1, cardId: cardId });
      } else if (swipeDistance.x < -25) {
        responseHandler({ satisfaction: 0, cardId: cardId });
      }
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
