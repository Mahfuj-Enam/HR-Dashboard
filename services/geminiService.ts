import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateHRInsights = async (metrics: any): Promise<string> => {
  try {
    const prompt = `
      Act as a senior HR Analyst. Analyze the following daily HR dashboard metrics and provide a brief, executive-level summary (max 3 bullet points) highlighting key risks or achievements.
      
      Metrics:
      ${JSON.stringify(metrics, null, 2)}
      
      Focus on attendance, time-to-hire, and department performance.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "No insights generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to generate insights at this time. Please try again later.";
  }
};