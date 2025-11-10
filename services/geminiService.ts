
import { GoogleGenAI, Type } from "@google/genai";
import type { SuggestedPlant } from '../types';

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const suggestPlantsFromQuiz = async (answers: { [key: number]: string }): Promise<SuggestedPlant[]> => {
  const prompt = `
    A user is looking for plant suggestions. Based on their quiz answers below, recommend 3 suitable plants.
    For each plant, provide a short reason why it's a good fit.
    The plants should exist in a typical online plant store.
    
    User's Answers:
    - Location: ${answers[1]}
    - Sunlight: ${answers[2]}
    - Watering Style: ${answers[3]}
    - Pets: ${answers[4]}

    Please provide your response in the format specified in the schema.
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              plantName: {
                type: Type.STRING,
                description: "The common name of the suggested plant.",
              },
              reason: {
                type: Type.STRING,
                description: "A brief explanation of why this plant is a good match based on the user's answers."
              }
            },
            required: ["plantName", "reason"]
          }
        },
      }
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as SuggestedPlant[];
  } catch (error) {
    console.error("Error suggesting plants:", error);
    throw new Error("Sorry, I couldn't come up with suggestions right now. Please try again.");
  }
};

export const getAdvancedCareTips = async (plantName: string): Promise<string> => {
  const prompt = `
    Provide 3 advanced or lesser-known care tips for a ${plantName}.
    Focus on things a plant owner might not know, like specific fertilization techniques,
    pruning for shape, or signs of a specific pest to look out for.
    Format the output as a simple, clean text. Start each tip with a bullet point.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error(`Error getting care tips for ${plantName}:`, error);
    throw new Error("Could not fetch AI-powered tips at this moment.");
  }
};


export const generateGardeningTip = async (topic: string): Promise<string> => {
  const prompt = `
    Write a short, helpful gardening tip about "${topic}". The tone should be encouraging and easy for a beginner to understand.
    The tip should be about 2-3 sentences long.
  `;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error(`Error generating gardening tip for topic "${topic}":`, error);
    throw new Error('Failed to generate gardening tip.');
  }
};
