
import { GoogleGenAI, Type } from "@google/genai";
import type { AgendaEvent } from '../types';

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const eventSchema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: 'The title of the event.',
    },
    date: {
      type: Type.STRING,
      description: 'The date of the event in YYYY-MM-DD format. Determine the date based on the current date.',
    },
    time: {
      type: Type.STRING,
      description: 'The time of the event in HH:MM (24-hour) format. If not specified, return an empty string.',
    },
    description: {
      type: Type.STRING,
      description: 'A brief description of the event. If not specified, return an empty string.',
    },
  },
  required: ['title', 'date'],
};

export const parseEventFromText = async (text: string): Promise<Partial<Omit<AgendaEvent, 'id' | 'category'>>> => {
    if (!process.env.API_KEY) {
        throw new Error("API Key is not configured.");
    }
  try {
    const today = new Date().toLocaleDateString('en-CA'); // Gets date in YYYY-MM-DD format
    
    const prompt = `
      Analyze the following text to extract event details for an agenda application.
      The current date is ${today}.
      Based on the text, determine the event's title, date (in YYYY-MM-DD format), time (in HH:MM 24-hour format), and a short description.
      For relative dates like "tomorrow", calculate the actual date.
      Text: "${text}"
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: eventSchema,
      },
    });

    const jsonString = response.text.trim();
    const parsedData = JSON.parse(jsonString);
    
    return {
        title: parsedData.title || '',
        date: parsedData.date || '',
        time: parsedData.time || '',
        description: parsedData.description || '',
    };
    
  } catch (error) {
    console.error("Error parsing event with Gemini:", error);
    throw new Error("Failed to analyze the event text. Please check the console for details.");
  }
};
