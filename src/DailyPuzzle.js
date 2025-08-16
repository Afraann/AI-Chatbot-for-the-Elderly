import React, { useState, useEffect } from "react";
import "./DailyPuzzle.css";

const puzzles = [
  {
    id: 1,
    question: "What has keys but can't open locks?",
    answer: "A piano",
  },
  {
    id: 2,
    question: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?",
    answer: "An echo",
  },
  {
    id: 3,
    question: "What can travel around the world while staying in the corner?",
    answer: "A stamp",
  },
  {
    id: 4,
    question: "What has a head, a tail, but no body?",
    answer: "A coin",
  },
  {
    id: 5,
    question: "What gets wetter as it dries?",
    answer: "A towel",
  },
];

function DailyPuzzle() {
  const [currentPuzzle, setCurrentPuzzle] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Generate a unique puzzle for each day based on the current date
    const today = new Date();
    const puzzleIndex = today.getDate() % puzzles.length; // Cycle through puzzles based on the day of the month
    setCurrentPuzzle(puzzles[puzzleIndex]);
  }, []);

  const handleSubmitAnswer = () => {
    if (!userAnswer.trim()) return; // Don't submit if the input is empty

    const isAnswerCorrect =
      userAnswer.trim().toLowerCase() === currentPuzzle.answer.toLowerCase();
    setIsCorrect(isAnswerCorrect);
    setSubmitted(true);
  };

  return (
    <div className="daily-puzzle-container">
      <h2>🧩 Daily Puzzle</h2>
      {currentPuzzle && (
        <div className="puzzle-card">
          <p className="puzzle-question">{currentPuzzle.question}</p>
          
          {!submitted ? (
            <>
              <input
                type="text"
                placeholder="Type your answer here..."
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="answer-input"
              />
              <button onClick={handleSubmitAnswer} className="submit-answer-btn">
                Submit Answer
              </button>
            </>
          ) : (
            <div className={`answer-feedback ${isCorrect ? "correct" : "incorrect"}`}>
              {isCorrect ? (
                <p>✅ Correct! Well done!</p>
              ) : (
                <p>❌ Incorrect. The correct answer was: {currentPuzzle.answer}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default DailyPuzzle;
