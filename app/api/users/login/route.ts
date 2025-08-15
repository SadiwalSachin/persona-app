import dbConnection from "@/lib/dbConnect";
import { User } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

interface loginBody {
  email: string;
  password: string;
}

export async function POST(request: NextRequest) {
  try {
    // db connection check here

    await dbConnection();

    const { email, password }: loginBody = await request.json();

    console.log(email,password);

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "All fields required" },
        { status: 400 }
      );
    }

    const isUserExist = await User.findOne({ email });

    if (!isUserExist) {
      console.log("User doest not exist with this email address");
      return NextResponse.json(
        {
          success: false,
          message: "User doest not exist with this email address",
        },
        { status: 400 }
      );
    }

    const isPassowrdCorrect = await bcrypt.compare(
      password,
      ""
    );

    if (!isPassowrdCorrect) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = jwt.sign({id:isUserExist._id},process.env.JWT_SECRET || "asdfskdajfaskljfh",{expiresIn:"7d"})

    const response = NextResponse.json(
        {
          success: true,
          message: "Login successfully",
          user: {
            _id: isUserExist._id,
            name: isUserExist.name,
            email: isUserExist.email,
          },
          token
        },
        { status: 201 }
      );
    
    return response
  } catch (error) {
    console.log("Some error occured while login the user");
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: "Some error occured while login new user",
        error,
      },
      { status: 500 }
    );
  }
}
