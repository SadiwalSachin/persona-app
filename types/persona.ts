export interface Question {
  id: string;
  question: string;
  answer: string;
}

export interface Persona {
  name: string;
  occupation: string;
  description: string;
  _id: string;
  accent: string;
  createdAt: string;
  questions: {
    question: string;
    answer: string;
  }[];
  avatar?: string;
  creatorName: string;
  createdBy: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  personas: Persona[];
}
