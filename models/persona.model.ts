import mongoose, { Schema, Document } from "mongoose";

export interface Persona extends Document {
  name: string;
  accent: string;
  description: string;
  occupation: string;
  questions: [{ question: string; answer: string }];
  createdBy?: mongoose.Types.ObjectId;
}

const personaSchema = new Schema<Persona>({
  name: {
    type: String,
    required: true,
    lowercase: true,
  },
  accent: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  occupation: {
    type: String,
    required: true,
  },
  questions: [
    {
      question: String,
      answer: String,
    },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

export const Persona =
  (mongoose.models.Persona as mongoose.Model<Persona>) ||
  mongoose.model<Persona>("Persona", personaSchema);
