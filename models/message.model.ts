import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMessage extends Document {
  userId: mongoose.Types.ObjectId | string;
  personaId: mongoose.Types.ObjectId | string;
  content: string;
  createdAt: Date;
  sender:string
}

const MessageSchema = new Schema<IMessage>(
  {
    userId: {
      type: String,
      ref: "User",
      required: true,
    },
    personaId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    sender:{
      type:String,
      required:true
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const Message =
  (mongoose.models.Message as mongoose.Model<IMessage>) ||
  mongoose.model<IMessage>("Message", MessageSchema);

