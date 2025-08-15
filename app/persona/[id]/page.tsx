"use client";

import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, MessageCircle, Calendar, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import PersonaProfileSkeleton from "@/components/PersonaProfileSkeleton";
import { Persona } from "@/types/persona";

export default function PersonaDetailPage() {
  const {id} = useParams()
  console.log(
    id
  );
  
  const [persona,setPersona]=useState<Persona | null>(null)

  useEffect(() => {
    async function getPersona() {
      try {
        const response = await axios.get(`/api/persona/${id}`);
        console.log(response);
        if (response.data.success) {
          setPersona(response.data.data)
        }
      } catch (error) {
        console.error("Failed to fetch persona", error)
      }
    }

    getPersona();
  }, [id]);

  if (!persona) {
    return (
      <PersonaProfileSkeleton/>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/"
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                <Avatar className="h-32 w-32">
                  <AvatarImage
                    src={persona.avatar || "/placeholder.svg"}
                    alt={persona.name}
                  />
                  <AvatarFallback className="text-2xl">
                    {persona.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {persona.name}
                  </h1>
                  <p className="text-lg text-gray-600 mb-4">
                    {persona.description}
                  </p>

                  <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                    <Badge variant="secondary" className="flex items-center">
                      <User className="mr-1 h-3 w-3" />
                      {persona.occupation}
                    </Badge>
                    <Badge variant="outline">{persona.accent} Accent</Badge>
                    <Badge variant="outline" className="flex items-center">
                      <Calendar className="mr-1 h-3 w-3" />
                      Created by {persona?.creatorName} 
                    </Badge>
                  </div>

                  <Link href={`/chat/${persona._id}`}>
                    <Button
                      size="lg"
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <MessageCircle className="mr-2 h-5 w-5" />
                      Start Conversation
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Questions & Answers */}
          <Card>
            <CardHeader>
              <CardTitle>Sample Conversations</CardTitle>
              <CardDescription>
                Here are some questions you can ask {persona.name} and how they
                might respond
              </CardDescription>
            </CardHeader>
            <CardContent>
              {persona.questions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No sample conversations available yet.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {persona.questions.map((qa, index) => (
                    <div key={index}>
                      <div className="space-y-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <p className="font-medium text-blue-900 mb-1">
                            Question:
                          </p>
                          <p className="text-blue-800">{qa.question}</p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <p className="font-medium text-purple-900 mb-1">
                            {persona.name} responds:
                          </p>
                          <p className="text-purple-800">{qa.answer}</p>
                        </div>
                      </div>
                      {index < persona.questions.length - 1 && (
                        <Separator className="my-6" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
