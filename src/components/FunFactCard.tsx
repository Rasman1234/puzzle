interface FunFactCardProps {
  title: string;
  fact: string;
}

export function FunFactCard({ title, fact }: FunFactCardProps) {
  return (
    <div className="fun-fact-card" role="note" aria-label={`Fun fact about ${title}`}>
      <p className="fun-fact-label">📚 Fun Fact!</p>
      <p className="fun-fact-title">{title}</p>
      <p className="fun-fact-text">{fact}</p>
    </div>
  );
}
