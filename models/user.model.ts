import mongoose, { Schema, Document } from "mongoose";

export interface User extends Document {
  name: string;
  clerkId:string
  email: string;
  password?: string;
  personaCreated: mongoose.Types.ObjectId[];
  createdAt?: Date;
}

const userSchema = new Schema<User>({
  name: {
    type: String,
    required: true,
    lowercase: true,
  },
  clerkId:{
    type:String,
    required:true,
    unique:true
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  personaCreated: [{ type: mongoose.Schema.Types.ObjectId, ref: "Persona" }],
});

export const User =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", userSchema);
