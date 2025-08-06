import { NextRequest, NextResponse } from "next/server";
import dbConnection from "@/lib/dbConnect";
import { User } from "@/models/user.model";

export async function POST(req:NextRequest) {
  const body = await req.json();

  const { id, email_addresses, first_name, last_name } = body.data;

  await dbConnection();

  // Check if user already exists
  const existingUser = await User.findOne({ clerkId: id });
  if (existingUser) {
    return NextResponse.json({ message: "User already exists" }, { status: 200 });
  }

  // Create a new user
  await User.create({
    clerkId: id,
    email: email_addresses[0]?.email_address,
    name: `${first_name} ${last_name}`,
  });

  return NextResponse.json({ success: true }, { status: 201 });
}
