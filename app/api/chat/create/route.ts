import { NextRequest, NextResponse } from "next/server";
import { Message } from "@/models/message.model";
import dbConnection from "@/lib/dbConnect";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  await dbConnection();

  try {
    const { userId } = await auth();
    const { content, personaId ,sender} = await request.json();

    if (!userId) {
      console.log("User id not found");

      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const newMessage = await Message.create({
        userId: userId,
        personaId: personaId,
        content: content,
        sender:sender
    })
    
    return NextResponse.json(
        { success: true, },
        { status: 201 }
      );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
