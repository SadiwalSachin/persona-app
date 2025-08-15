import dbConnection from "@/lib/dbConnect";
import { Message } from "@/models/message.model";
import { auth } from "@clerk/nextjs/server";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
   await dbConnection();

  try {
    const { userId } = await auth();
    const { searchParams } = new URL(request.url);
    const personaId = searchParams.get("personaId");
    const personaObjectId = new mongoose.Types.ObjectId(personaId!);

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!personaId) {
      return NextResponse.json(
        { success: false, message: "personaId is required" },
        { status: 400 }
      );
    }



    const messages = await Message.find({
        userId,
        personaId:personaObjectId
      }).sort({ createdAt: 1 });

    return NextResponse.json({ success: true, data:messages });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
