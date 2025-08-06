"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Plus, MessageCircle, User } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import axios from "axios"
import Navbar from "@/components/Navbar"

interface Persona {
  name:string,
  occupation:string,
  description:string,
  _id:string,
  accent:string,
  questions:{
    question:string,
    answer:string
  }[]

}

export default function HomePage() {
  const [allPersona,setAllPersona] = useState<Persona[]>([])
  useEffect(()=>{
    async function getAllPersona() {
      try {
        const respponse = await axios.get("/api/persona/get-all-persona")
        console.log(respponse);
        if(respponse.data.success){
          setAllPersona(respponse.data.data)
        }
      } catch (error) {
        console.log(error);
      }
    }

    getAllPersona()
  },[])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <Navbar/>

      {/* Hero Section */}
      <section className="container mx-auto md:px-4 px-6 py-16 text-center">
        <h2 className="text-5xl font-bold text-gray-900 mb-6">Talk to Anyone, Anytime</h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Chat with historical figures, fictional characters, or create your own personas. Experience conversations like
          never before.
        </p>
        <div className="flex justify-center space-x-4">
          <Link href="/create-persona">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
              <Plus className="mr-2 h-5 w-5" />
              Create Your Persona
            </Button>
          </Link>
        </div>
      </section>

      {/* Personas Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-3xl font-bold text-gray-900">Available Personas</h3>
          <Link href="/create-persona">
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add New
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allPersona.length && allPersona.map((persona) => (
            <Card key={persona._id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <CardTitle className="text-xl">{persona.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <Link href={`/chat/${persona._id}`} className="flex-1">
                    <Button className="w-full">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Chat
                    </Button>
                  </Link>
                  <Link href={`/persona/${persona._id}`}>
                    <Button variant="outline" size="icon">
                      <User className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
