
import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../constants';
import { suggestPlantsFromQuiz } from '../services/geminiService';
import type { SuggestedPlant } from '../types';
import { SparklesIcon } from '../components/Icons';
import { Link } from 'react-router-dom';

export const QuizPage = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [results, setResults] = useState<SuggestedPlant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnswer = (questionId: number, value: string) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);

    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmit(newAnswers);
    }
  };

  const handleSubmit = async (finalAnswers: { [key: number]: string }) => {
    setIsLoading(true);
    setError('');
    try {
      const suggestions = await suggestPlantsFromQuiz(finalAnswers);
      setResults(suggestions);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setResults([]);
    setError('');
  };

  const isQuizFinished = results.length > 0 || isLoading || error;
  const currentQuestion = QUIZ_QUESTIONS[currentQuestionIndex];

  return (
    <div className="bg-background min-h-screen py-16 px-4">
      <div className="container mx-auto max-w-2xl bg-white rounded-2xl shadow-xl p-8 transition-all duration-500">
        <h1 className="text-3xl font-bold text-center text-primary mb-2">Find Your Perfect Plant</h1>
        <p className="text-center text-text-light mb-8">Answer a few questions and let our AI find your green match!</p>
        
        {!isQuizFinished && (
          <div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
              <div className="bg-secondary h-2.5 rounded-full" style={{ width: `${((currentQuestionIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }}></div>
            </div>
            <h2 className="text-2xl font-semibold text-text-main mb-6 text-center">{currentQuestion.question}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentQuestion.options.map(option => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(currentQuestion.id, option.value)}
                  className="w-full text-lg bg-white border-2 border-accent text-accent font-semibold py-4 px-4 rounded-lg hover:bg-accent hover:text-white transition-all duration-300 transform hover:scale-105"
                >
                  {option.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {isLoading && (
          <div className="text-center py-10">
            <SparklesIcon className="h-12 w-12 text-secondary animate-pulse mx-auto mb-4" />
            <p className="text-xl text-text-main">Finding your plant soulmate...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-10">
            <p className="text-xl text-red-600 mb-4">{error}</p>
            <button onClick={resetQuiz} className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-secondary">
              Try Again
            </button>
          </div>
        )}

        {results.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-center text-primary mb-6">Here are your personalized suggestions!</h2>
            <div className="space-y-4">
              {results.map((plant, index) => (
                <div key={index} className="bg-primary/10 p-4 rounded-lg">
                  <h3 className="font-bold text-lg text-secondary">{plant.plantName}</h3>
                  <p className="text-text-main">{plant.reason}</p>
                </div>
              ))}
            </div>
             <div className="text-center mt-8">
              <Link to="/shop" className="bg-secondary text-white font-bold py-3 px-8 rounded-full hover:bg-primary transition-transform hover:scale-105 inline-block mr-4">
                Explore Shop
              </Link>
              <button onClick={resetQuiz} className="bg-gray-200 text-text-main font-bold py-3 px-8 rounded-full hover:bg-gray-300">
                Retake Quiz
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
