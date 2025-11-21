import { GoogleGenAI } from "@google/genai";
import { PRODUCTS } from "../constants";

// Initialize API client
// Note: In a real production app, the API call should ideally go through a backend proxy to hide the key,
// or use a very restricted key allowed only for this domain.
const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

export const getShoppingAdvice = async (query: string, history: string[] = []): Promise<string> => {
  if (!apiKey) return "AI Service is currently unavailable (Missing API Key).";

  try {
    const productContext = PRODUCTS.map(p => `${p.name} ($${p.price}) - ${p.category}`).join('\n');
    
    const prompt = `
      You are ShopGenie, a helpful and enthusiastic shopping assistant.
      
      Our Product Catalog:
      ${productContext}
      
      User Chat History:
      ${history.join('\n')}
      
      Current User Query: "${query}"
      
      Task: Provide a helpful, concise response. If the user asks for recommendations, suggest specific products from our catalog. 
      Be friendly and professional. Keep it under 300 characters if possible.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "I couldn't find an answer for that right now.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to the brain. Please try again later.";
  }
};

export const getProductInsights = async (productName: string, description: string): Promise<string> => {
  if (!apiKey) return "AI Insights unavailable.";

  try {
    const prompt = `
      Product: ${productName}
      Description: ${description}
      
      Write a short, catchy "Why you'll love this" summary (max 2 sentences) and 3 quick bullet points of potential use cases.
      Format the output as HTML (without <html> tags, just <p> and <ul>).
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Could not generate insights.";
  } catch (error) {
    return "Insights currently unavailable.";
  }
};
