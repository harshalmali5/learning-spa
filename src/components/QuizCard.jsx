import { useState } from "react";
import { generateQuiz, evaluateAnswer } from "../utils/openai";

export default function QuizCard({ onXpEarned }) {
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("medium");

  const createQuiz = async () => {
    if (!topic.trim()) return;
    
    setIsLoading(true);
    try {
      const newQuiz = await generateQuiz(topic, difficulty);
      setQuiz(newQuiz);
      setCurrentQuestion(0);
      setSelectedAnswer(null);
      setShowResult(false);
      setFeedback(null);
    } catch (error) {
      alert("Failed to generate quiz. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const submitAnswer = async () => {
    if (selectedAnswer === null) return;

    const question = quiz.questions[currentQuestion];
    const isCorrect = selectedAnswer === question.correct;
    
    setIsLoading(true);
    try {
      const evaluation = await evaluateAnswer(
        question.question,
        question.options[selectedAnswer],
        question.options[question.correct],
        question.explanation
      );
      
      setFeedback(evaluation);
      setShowResult(true);
      
      if (onXpEarned) {
        onXpEarned(evaluation.xp);
      }
    } catch (error) {
      setFeedback({
        feedback: "Good effort!",
        xp: isCorrect ? 8 : 2,
        suggestions: "Keep practicing!"
      });
      setShowResult(true);
    } finally {
      setIsLoading(false);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setFeedback(null);
    } else {
      setQuiz(null);
      setTopic("");
    }
  };

  if (!quiz) {
    return (
      <div className="quiz-card">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4 float">🎯</div>
          <h3 className="text-3xl font-bold gradient-text mb-2">Create a Quiz</h3>
          <p className="text-gray-600">Generate custom quizzes on any topic with AI</p>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              📚 Topic
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., JavaScript, Math, History..."
              className="modern-input"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              🎚️ Difficulty
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="modern-input"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          
          <button
            onClick={createQuiz}
            disabled={isLoading || !topic.trim()}
            className="btn-success w-full"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="loading-spinner mr-2"></div>
                Generating Quiz...
              </div>
            ) : (
              "Generate Quiz"
            )}
          </button>
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];

  return (
    <div className="quiz-card">
      {/* Quiz Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold gradient-text">{quiz.title}</h3>
          <div className="text-3xl float">🎯</div>
        </div>
        <p className="text-gray-600 mb-4">{quiz.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </span>
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full capitalize">
            {difficulty}
          </span>
        </div>
      </div>

      {/* Question */}
      <div className="mb-8">
        <h4 className="text-xl font-semibold mb-6 text-gray-800">{question.question}</h4>
        
        <div className="space-y-4">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={showResult}
              className={`quiz-option ${
                selectedAnswer === index ? 'selected' : ''
              } ${
                showResult && index === question.correct ? 'correct' : ''
              } ${
                showResult && selectedAnswer === index && index !== question.correct ? 'incorrect' : ''
              }`}
            >
              <span className="font-bold mr-3 text-lg">{String.fromCharCode(65 + index)}.</span>
              <span className="text-left">{option}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      {!showResult && (
        <button
          onClick={submitAnswer}
          disabled={selectedAnswer === null || isLoading}
          className="btn-primary w-full"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="loading-spinner mr-2"></div>
              Evaluating...
            </div>
          ) : (
            "Submit Answer"
          )}
        </button>
      )}

      {/* Results */}
      {showResult && feedback && (
        <div className="space-y-6">
          {/* Feedback */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
            <h5 className="font-bold text-blue-800 mb-3 flex items-center">
              <span className="mr-2">💬</span>
              Feedback
            </h5>
            <p className="text-blue-700 mb-3">{feedback.feedback}</p>
            <div className="flex items-center">
              <span className="xp-badge">+{feedback.xp} XP</span>
            </div>
          </div>
          
          {/* Explanation */}
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-2xl border border-green-200">
            <h5 className="font-bold text-green-800 mb-3 flex items-center">
              <span className="mr-2">💡</span>
              Explanation
            </h5>
            <p className="text-green-700">{question.explanation}</p>
          </div>
          
          {/* Suggestions */}
          {feedback.suggestions && (
            <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-6 rounded-2xl border border-amber-200">
              <h5 className="font-bold text-amber-800 mb-3 flex items-center">
                <span className="mr-2">🎯</span>
                Suggestions
              </h5>
              <p className="text-amber-700">{feedback.suggestions}</p>
            </div>
          )}
          
          {/* Next Button */}
          <button
            onClick={nextQuestion}
            className="btn-success w-full"
          >
            {currentQuestion < quiz.questions.length - 1 ? "Next Question" : "Finish Quiz"}
          </button>
        </div>
      )}
    </div>
  );
} 