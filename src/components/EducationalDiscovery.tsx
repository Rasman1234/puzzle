import { useState } from 'react';
import type { EducationalDiscovery } from '../data/v4Content';
import { exploreTopic } from '../lib/playerProgress';
import { playClickSound } from '../lib/audio';

interface EducationalDiscoveryProps {
  title: string;
  fact: string;
  discovery: EducationalDiscovery | null;
  packImageId?: string;
}

export function EducationalDiscovery({
  title,
  fact,
  discovery,
  packImageId,
}: EducationalDiscoveryProps) {
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);

  const handleQuiz = (index: number) => {
    if (quizAnswered || !discovery) return;
    playClickSound();
    setSelected(index);
    setQuizAnswered(true);
    if (packImageId) exploreTopic(packImageId);
  };

  return (
    <div className="educational-discovery">
      <div className="fun-fact-card" role="note" aria-label={`Fun fact about ${title}`}>
        <p className="fun-fact-label">📚 Fun Fact!</p>
        <p className="fun-fact-title">{title}</p>
        <p className="fun-fact-text">{fact}</p>
      </div>

      {discovery && (
        <>
          <div className="did-you-know">
            <p className="fun-fact-label">💡 Did You Know?</p>
            <p className="fun-fact-text">{discovery.didYouKnow}</p>
          </div>

          {!quizAnswered ? (
            <div className="mini-quiz" role="group" aria-label="Mini quiz">
              <p className="quiz-question">{discovery.quiz.question}</p>
              {discovery.quiz.options.map((opt, i) => (
                <button
                  key={opt}
                  type="button"
                  className="btn quiz-option"
                  onClick={() => handleQuiz(i)}
                >
                  {opt}
                </button>
              ))}
            </div>
          ) : (
            <p className="quiz-feedback positive" role="status">
              {selected === discovery.quiz.correctIndex
                ? '🌟 Wonderful! You got it!'
                : `🌈 ${discovery.quiz.encouragement}`}
            </p>
          )}
        </>
      )}
    </div>
  );
}
