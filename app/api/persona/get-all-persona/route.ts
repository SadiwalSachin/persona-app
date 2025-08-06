import dbConnection from "@/lib/dbConnect";
import { Persona } from "@/models/persona.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  await dbConnection();
  try {

    const persona = await Persona.find();

    if (!persona) {
      return NextResponse.json(
        { success: false, message: "Persona not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Persona found", data: persona },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error,
        message: "Some error occured while fetching persona",
      },
      { status: 500 }
    );
  }
}
