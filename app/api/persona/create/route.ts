import { NextRequest, NextResponse } from "next/server";
import { Persona } from "@/models/persona.model";
import dbConnection from "@/lib/dbConnect";
import { auth, clerkClient } from "@clerk/nextjs/server";

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
    await dbConnection();

    const authObject = await auth();

    const userClient = await clerkClient();

    if (!authObject?.userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized User" },
        { status: 401 }
      );
    }

    const user = await userClient.users.getUser(authObject?.userId!);

    const creatorName =
      user.fullName || `${user.firstName || ""} ${user.lastName || ""}`.trim();
    console.log("user", user);

    const { accent, description, name, occupation, questions }: PersonaType =
      await request.json();

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
      createdBy: authObject?.userId?.toString(),
      creatorName:creatorName || "Unknown user"
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
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
