export interface Question {
  id: string
  question: string
  answer: string
}

export interface Persona {
  id: string
  name: string
  accent: string
  occupation: string
  description: string
  avatar: string
  questions: Question[]
  createdAt: Date
  createdBy: string
}

export interface User {
  id: string
  email: string
  name: string
  personas: Persona[]
}
