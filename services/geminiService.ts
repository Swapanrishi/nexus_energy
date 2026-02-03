
import { GoogleGenAI, Type } from "@google/genai";
import { IoTDevice } from "../types";

export const getSmartInsights = async (devices: IoTDevice[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemStatus = devices.map(d => ({
    name: d.name,
    status: d.status,
    lastVal: d.telemetry[d.telemetry.length - 1]?.value,
    unit: d.telemetry[0]?.unit,
    location: d.location
  }));

  const prompt = `
    Analyze the following IoT device states and provide:
    1. A summary of overall system health.
    2. Identification of any anomalies or devices needing attention.
    3. Actionable maintenance recommendations.

    Current Device States:
    ${JSON.stringify(systemStatus, null, 2)}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return "Unable to generate insights at this time. Please check your connection or API configuration.";
  }
};
