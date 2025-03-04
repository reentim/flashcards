import './index.css';

interface CardProps {
  term: string;
  definition: string;
  isRevealed: boolean;
  satisfaction?: 'satisfied' | 'dissatisfied';
  hidden?: boolean;
}

export const Card = ({
  isRevealed,
  term,
  definition,
  satisfaction,
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

  return (
    <div className={classes}>
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
