"use client";

import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Send, User } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { getMessage } from "@/lib/getResponseFromAi";
import ChatShimmer from "@/components/ChatComponentSkeleton";
import { Persona } from "@/types/persona";
import { Message } from "@/types/message";

export default function ChatPage() {
  const { id } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const [persona, setPersona] = useState<Persona | null>(null);

  useEffect(() => {
    async function getPersona() {
      try {
        const response = await axios.get(`/api/persona/${id}`);
        if (response.data.success) {
          setPersona(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch persona", error);
      }
    }

    getPersona();
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (persona) {
      const welcomeMessage: Message = {
        _id: "1",
        content: `Hello! I'm ${persona.name}. What would you like to talk about?`,
        sender: "persona",
        createdAt: new Date(),
        personaId: "",
        userId: "",
      };
      setMessages([welcomeMessage]);
    }

    async function getAllMessages() {
      try {
        const response = await axios.get(`/api/chat/get?personaId=${id}`);
        if (response?.data?.success) {
          setMessages((prev) => [...prev, ...response.data.data]);
        }
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    }

    getAllMessages();
  }, [persona]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !persona) return;

    await axios.post("/api/chat/create", {
      content: inputValue,
      personaId: id,
      sender: "user",
    });

    const userMessage: Message = {
      _id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    const historyMessage = messages.slice(-15);

    console.log(persona);

    const response = await getMessage(inputValue, persona, historyMessage);
    console.log(response);
    if (typeof response === "string") {
      setMessages((prev) => [
        ...prev,
        {
          _id: Date.now().toString(),
          content: response,
          sender: "persona",
          createdAt: new Date(),
        },
      ]);
    }
  };

  if (!persona) {
    return <ChatShimmer />;
  }

  return (
    <div className="min-h-screen bg-zinc-900 flex flex-col">
      {/* Header */}
      <header className="border-b bg-zinc-700 px-4 py-3">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={persona.avatar || "/placeholder.svg"}
              alt={persona.name}
            />
            <AvatarFallback>
              {persona.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold text-white">{persona.name}</h1>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${
                message.sender === "user"
                  ? "flex-row-reverse space-x-reverse"
                  : ""
              }`}
            >
              <Avatar className="h-8 w-8">
                {message.sender === "user" ? (
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                ) : (
                  <>
                    <AvatarImage
                      src={persona.avatar || "/placeholder.svg"}
                      alt={persona.name}
                    />
                    <AvatarFallback>
                      {persona.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </>
                )}
              </Avatar>
              <div
                className={`rounded-lg px-3 py-2 ${
                  message.sender === "user"
                    ? "bg-purple-600 text-white"
                    : "bg-white border"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.sender === "user"
                      ? "text-purple-200"
                      : "text-gray-500"
                  }`}
                >
                  {/* {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })} */}
                </p>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t bg-zinc-700 p-4">
        <div className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`Message ${persona.name}...`}
            className="flex-1 text-white"
          />
          <Button onClick={handleSendMessage} disabled={!inputValue.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
