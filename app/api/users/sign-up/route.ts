import dbConnection from "@/lib/dbConnect";
import { User } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

interface SignUpBody {
  name: string;
  email: string;
  password: string;
}

export async function POST(request: NextRequest) {
  try {
    // db connection check here

    await dbConnection();

    const { name, email, password }: SignUpBody = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { success:false,message: "All fields required" },
        { status: 400 }
      );
    }

    const isUserExist = await User.findOne({ email });

    if (isUserExist) {
      console.log(`User already exist with this email address`);
      return NextResponse.json({success:false,message:"User already exist with this email address"},{status:400});
    }

    const hashedPassword:string = await bcrypt.hash(password,10)

    const newUser = await User.create({name,email,password:hashedPassword})

    return NextResponse.json(
        {
          success:true,
          message: "User created successfully",
          user: {
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
          },
        },
        { status: 201 }
      );

  } catch (error) {
    console.log("Some error occured while creating new user")
    console.error(error)
    return NextResponse.json({
        success:false,
        message:"Some error occured while creating new user",error
    },{status:500})
  }
}
