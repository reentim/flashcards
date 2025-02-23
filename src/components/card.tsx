import './card.css';

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
  const classes = ['card', satisfaction].filter((val) => val).join(' ');

  return (
    <div className={classes}>
      <div className="term">{term}</div>
      <div className={['definition', isRevealed ? 'reveal' : ''].join(' ')}>
        {definition}
      </div>
    </div>
  );
};
