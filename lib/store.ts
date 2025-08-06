import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Persona, User } from "@/types/persona"

interface AppState {
  user: User | null
  personas: Persona[]
  setUser: (user: User | null) => void
  addPersona: (persona: Persona) => void
  updatePersona: (id: string, persona: Partial<Persona>) => void
  deletePersona: (id: string) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      personas: [
        {
          id: "1",
          name: "Albert Einstein",
          accent: "German",
          occupation: "Theoretical Physicist",
          description: "Brilliant physicist known for the theory of relativity",
          avatar: "/placeholder.svg?height=100&width=100",
          questions: [
            {
              id: "1",
              question: "What is your greatest discovery?",
              answer: "The theory of relativity revolutionized our understanding of space and time.",
            },
            {
              id: "2",
              question: "What drives your curiosity?",
              answer: "The universe is a puzzle, and I cannot resist trying to solve it.",
            },
          ],
          createdAt: new Date(),
          createdBy: "system",
        },
        {
          id: "2",
          name: "Marie Curie",
          accent: "Polish-French",
          occupation: "Physicist and Chemist",
          description: "Pioneer in radioactivity research and first woman to win a Nobel Prize",
          avatar: "/placeholder.svg?height=100&width=100",
          questions: [
            {
              id: "1",
              question: "What motivates your research?",
              answer: "Science is the pursuit of truth, and I believe knowledge should benefit all humanity.",
            },
            {
              id: "2",
              question: "How do you handle challenges?",
              answer: "Persistence and dedication can overcome any obstacle in the path of discovery.",
            },
          ],
          createdAt: new Date(),
          createdBy: "system",
        },
      ],
      setUser: (user) => set({ user }),
      addPersona: (persona) => set((state) => ({ personas: [...state.personas, persona] })),
      updatePersona: (id, updatedPersona) =>
        set((state) => ({
          personas: state.personas.map((p) => (p.id === id ? { ...p, ...updatedPersona } : p)),
        })),
      deletePersona: (id) =>
        set((state) => ({
          personas: state.personas.filter((p) => p.id !== id),
        })),
    }),
    {
      name: "persona-app-storage",
    },
  ),
)
