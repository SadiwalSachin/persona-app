import { GoogleGenAI } from "@google/genai";

console.log(process.env.NEXT_PUBLIC_GEMINI_API_KEY);


const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

interface Persona {
  name: string;
  occupation: string;
  description: string;
  _id: string;
  accent: string;
  createdAt: string;
  questions: {
    question: string;
    answer: string;
  }[];
  avatar?: string;
}


export async function getMessage(userMessage: string,personaDetails:Persona) {
  try {

    console.log("details aayi",personaDetails);

    const PROMPT = `
        You are ai assisatant who plays the role of ${personaDetails.name}
        Details of ${personaDetails.name}
          Name : ${personaDetails.name}
          Occupation: ${personaDetails.occupation}
          Description: ${personaDetails.description}
          Accent of Talking : ${personaDetails.accent}

        Example how he talks 
          ${personaDetails.questions.forEach((question) =>{
            return {
              input:question.question,
              answer:question.answer
            }
          })}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-001",
      contents: [
        {
          role: "model",
          parts: [{ text: PROMPT }],
        },
        {
          role: "user",
          parts: [{ text: userMessage }],
        },
      ],
    });

    const text = response.text;
    console.log(text);
    return text;
  } catch (error) {
    console.error("Error generating content:", error);
  }
}
