import { GoogleGenAI, Type } from "@google/genai";
import { Complexity, Tone, WorkflowResult } from "../types";

const apiKey = process.env.API_KEY;

// Using gemini-2.5-flash for speed and efficiency in text generation
const MODEL_NAME = "gemini-2.5-flash";

const ai = new GoogleGenAI({ apiKey });

export const generateWorkflow = async (
  task: string,
  complexity: Complexity,
  tone: Tone
): Promise<WorkflowResult> => {
  let promptToneInstruction = "";
  
  switch (tone) {
    case Tone.Stricter:
      promptToneInstruction = "Use imperative, short, military-style commands. Focus on absolute efficiency and speed. Cut all polite framing.";
      break;
    case Tone.Looser:
      promptToneInstruction = "Use softer edges and adaptive language. Allow for flexibility and human judgment in the steps.";
      break;
    case Tone.Neutral:
    default:
      promptToneInstruction = "Be direct, neutral, and operational. Focus on clarity and action.";
      break;
  }

  let complexityInstruction = "";
  switch (complexity) {
    case Complexity.HighComplexity:
      complexityInstruction = "Enforce tighter, more technical step language suitable for experts. Assume deep domain knowledge.";
      break;
    case Complexity.Basic:
      complexityInstruction = "Generate simple, accessible, and flexible phrasing suitable for beginners.";
      break;
    case Complexity.Intermediate:
      complexityInstruction = "Balance technical precision with general operational clarity.";
      break;
  }

  const prompt = `
    You are an expert operations consultant. 
    Analyze the following task or problem description: "${task}".
    
    Objective:
    1. Identify the primary objective.
    2. Break the solution into EXACTLY three sequential steps.
    3. Detect the step with the highest friction, delay, or dependency. This is the "bottleneck".
    4. Generate one specific "optimization" that reduces friction or time for that bottleneck.
    5. Provide a short "reasoning" for your choices.

    Constraints:
    - ${promptToneInstruction}
    - ${complexityInstruction}
    - The output must be strictly structured.
    - Steps must be concise commands.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            steps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Exactly three sequential steps.",
            },
            bottleneck: {
              type: Type.STRING,
              description: "The identified bottleneck step and why it is a bottleneck.",
            },
            optimization: {
              type: Type.STRING,
              description: "One short, practical optimization technique.",
            },
            reasoning: {
              type: Type.STRING,
              description: "Brief explanation of the workflow logic.",
            },
          },
          required: ["steps", "bottleneck", "optimization", "reasoning"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response generated from AI.");
    }

    const result = JSON.parse(text) as WorkflowResult;
    
    // Safety check to ensure exactly 3 steps (though schema should enforce, it's good practice)
    if (result.steps.length > 3) {
        result.steps = result.steps.slice(0, 3);
    }
    
    return result;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate workflow. Please try again.");
  }
};