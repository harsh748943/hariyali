import type { QuizQuestion } from './types';

export const API_BASE_URL = process.env.REACT_APP_API_URL;

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "Where will your new plant friend live?",
    options: [
      { text: "Indoors", value: "indoor" },
      { text: "Outdoors", value: "outdoor" },
    ],
  },
  {
    id: 2,
    question: "How much sunlight does the spot get?",
    options: [
      { text: "Lots of direct sun", value: "high light" },
      { text: "Bright, but indirect light", value: "medium light" },
      { text: "Not much light at all", value: "low light" },
    ],
  },
  {
    id: 3,
    question: "How would you describe your plant-parenting style?",
    options: [
      { text: "I'm very attentive and love to water", value: "attentive" },
      { text: "I'm more of a 'set it and forget it' type", value: "hands-off" },
      { text: "I'm balanced, I can stick to a schedule", value: "balanced" },
    ],
  },
  {
    id: 4,
    question: "Do you have any furry friends (pets)?",
    options: [
      { text: "Yes, I need pet-safe plants", value: "pet-safe" },
      { text: "No pets to worry about", value: "no pets" },
    ],
  },
];
