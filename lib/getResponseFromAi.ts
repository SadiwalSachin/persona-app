import { GoogleGenAI } from "@google/genai";
import axios from "axios";
import { Persona } from "@/types/persona";
import { Message } from "@/types/message";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

export async function getMessage(
  userMessage: string,
  personaDetails: Persona,
  historyMessage: Message[]
) {
  try {
    console.log("details aayi", personaDetails);
    console.log("history of the user", historyMessage);

    const PROMPT = `
        You are ai assisatant who plays the role of ${personaDetails.name}
        Details of ${personaDetails.name}
          Name : ${personaDetails.name}
          Occupation: ${personaDetails.occupation}
          Description: ${personaDetails.description}
          Accent of Talking : ${personaDetails.accent}


        user history :
          ${
            historyMessage.length &&
            historyMessage.map((message) => {
              return {
                role: message.sender,
                answer: message.content,
              };
            })
          }  

        Rules :
          1 : Never answer directly to the user first understand what user wants to talk
          2 : Analyze what user want to talk what he wanted to share 
          3 : Never reply based on only accent use accent but gradually never reply directly accent and description in the user 
          4 : Use accent in the talk gradually as user uses  

        Example how he talks 
          ${personaDetails.questions.forEach((question) => {
            return {
              input: question.question,
              answer: question.answer,
            };
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

    await axios.post("/api/chat/create", {
      content: text,
      personaId: personaDetails._id,
      sender: "persona",
    });

    return text;
  } catch (error) {
    console.error("Error generating content:", error);
  }
}
