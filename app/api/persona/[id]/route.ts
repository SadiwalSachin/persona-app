import dbConnection from "@/lib/dbConnect";
import { Persona } from "@/models/persona.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request:NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnection();
    const  {id}  = await params;
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Persona ID is required" },
        { status: 400 }
      );
    }

    const persona = await Persona.findById(id);

    if (!persona) {
      return NextResponse.json(
        { success: false, message: "Persona found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Persona not found", data: persona },
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
