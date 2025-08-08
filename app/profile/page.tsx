"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MessageCircle, Plus, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { SignOutButton } from "@clerk/nextjs";
import { ProfileSkeleton } from "@/components/ProfileSkeleton";
import { useState } from "react";
import axios from "axios";

interface Persona {
  _id:string
  name: string;
  accent: string;
  description: string;
  occupation: string;
  questions: [{ question: string; answer: string }];
  createdBy: string;
  creatorName:string
}

export default function ProfilePage() {
  const router = useRouter();
  const { isSignedIn, user, isLoaded } = useUser();
  const [loading, setLoading] = useState(true);
  const [userPersonas, setUsersPersonas] = useState<Persona[]>([]);

  async function getPersonaCreatedByUser(): Promise<void> {
    try {
      const response = await axios.get("/api/persona/get-user-created-persona");
      console.log(response);

      if (response?.data?.success) {
        setLoading(false);
        setUsersPersonas(response?.data?.data);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  if (!userPersonas.length) {
    getPersonaCreatedByUser();
  }

  if (!isLoaded || loading) {
    return <ProfileSkeleton />;
  }

  if (!isSignedIn) {
    router.push("/");
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
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="text-xl">
                    <User href={user?.imageUrl} className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {user?.fullName}
                  </h1>
                  <p className="text-lg text-gray-600 mb-4">
                    {user?.emailAddresses[0]?.emailAddress}
                  </p>

                  <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                    {/* <Badge variant="secondary">{userPersonas.length} Personas Created</Badge> */}
                    <Badge variant="outline">
                      Member since {user?.createdAt?.toDateString()}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap justify-center md:justify-start gap-2">
                    <Link href="/create-persona">
                      <Button className="bg-purple-600 hover:bg-purple-700">
                        <Plus className="mr-2 h-4 w-4" />
                        Create New Persona
                      </Button>
                    </Link>
                    <SignOutButton>
                      <span className="bg-purple-600 hover:bg-purple-700 px-3 text-white rounded-md py-1 cursor-pointer">
                        Logout
                      </span>
                    </SignOutButton>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User's Personas */}
          <Card>
            <CardHeader>
              <CardTitle>Your Personas</CardTitle>
              <CardDescription>
                Manage the personas you've created
              </CardDescription>
            </CardHeader>
            <CardContent>
              {userPersonas.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No personas yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Create your first persona to start having amazing
                    conversations
                  </p>
                  <Link href="/create-persona">
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Your First Persona
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userPersonas.map((persona) => (
                    <Card
                      key={persona?._id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            {/* <Avatar className="h-12 w-12">
                              <AvatarImage src={persona.avatar || "/placeholder.svg"} alt={persona.name} />
                              <AvatarFallback>
                                {persona.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar> */}
                            <div>
                              <CardTitle className="text-lg">
                                {persona?.name}
                              </CardTitle>
                              <CardTitle className="text-md">
                                Created by : {persona?.creatorName}
                              </CardTitle>
                              <CardDescription className="text-sm">{persona.occupation}</CardDescription>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{persona.description}</p>
                        <div className="flex space-x-2">
                          <Link href={`/chat/${persona._id}`} className="flex-1">
                            <Button size="sm" className="w-full">
                              <MessageCircle className="mr-2 h-3 w-3" />
                              Chat
                            </Button>
                          </Link>
                          <Link href={`/persona/${persona._id}`}>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
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
