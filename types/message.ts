export interface Message {
    _id: string;
    content: string;
    sender: "user" | "persona";
    personaId?: string;
    userId?: string;
    createdAt: Date;
  }