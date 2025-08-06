import { NextRequest, NextResponse } from "next/server";
import { Persona } from "@/models/persona.model";
import dbConnection from "@/lib/dbConnect";

interface PersonaType {
  accent: string;
  description: string;
  name: string;
  occupation: string;
  questions: [
    {
      id: string;
      question: string;
      answer: string;
    }
  ];
}

export async function POST(request: NextRequest) {
  try {

    await dbConnection()

    const { accent, description, name, occupation, questions }: PersonaType =
      await request.json();

      console.log(accent, description, name, occupation, questions);

    if (
      !accent ||
      !description ||
      !name ||
      !occupation ||
      !Array.isArray(questions)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "All fields (accent, description, name, occupation, questions) are required.",
        },
        { status: 400 }
      );
    }

    const newPersona = await Persona.create({
      accent,
      description,
      name,
      occupation,
      questions,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Persona created successfully",
        persona: newPersona,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating persona:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
