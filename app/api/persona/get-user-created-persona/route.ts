import dbConnection from "@/lib/dbConnect";
import { Persona } from "@/models/persona.model";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  await dbConnection();

  try {
    const { userId } = await auth();

    console.log(userId);

    if (!userId) {
      console.log("User id not found");
      
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    // Find personas created by this user
    const personas = await Persona.find({ createdBy: userId });

    if (!personas || personas.length === 0) {
      return NextResponse.json(
        { success: false, message: "No personas found for this user" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Personas found", data: personas },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : error,
        message: "Some error occurred while fetching user personas",
      },
      { status: 500 }
    );
  }
}
