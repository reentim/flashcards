import './card.css';

interface CardProps {
  term: string;
  definition: string;
  isRevealed: boolean;
}

export const Card = ({ isRevealed, term, definition }: CardProps) => {
  return (
    <div className="card">
      <div class="term">{term}</div>
      <div
        class={['definition', isRevealed ? 'reveal' : ''].join(' ')}
      >
        {definition}
      </div>
    </div>
  );
};
