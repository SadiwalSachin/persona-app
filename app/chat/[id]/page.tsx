"use client";

import { useState, useRef, useEffect, useCallback } from "react";
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
  const [persona, setPersona] = useState<Persona | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasInitialized, setHasInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Fetch persona data
  useEffect(() => {
    let isMounted = true;

    async function getPersona() {
      try {
        setIsLoading(true);
        const response = await axios.get(`/api/persona/${id}`);
        if (response.data.success && isMounted) {
          setPersona(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch persona", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    if (id) {
      getPersona();
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Get all messages
  const getAllMessages = useCallback(async () => {
    if (!id) return;
    
    try {
      const response = await axios.get(`/api/chat/get?personaId=${id}`);
      if (response?.data?.success) {
        setMessages(response.data.data);
      }
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }, [id]);

  // Initialize messages when persona is loaded
  useEffect(() => {
    if (persona && !hasInitialized) {
      const welcomeMessage: Message = {
        _id: "welcome",
        content: `Hello! I'm ${persona.name}. What would you like to talk about?`,
        sender: "persona",
        createdAt: new Date(),
        personaId: persona._id || "",
        userId: "",
      };

      // Get existing messages and add welcome message if no messages exist
      getAllMessages().then(() => {
        setMessages(prevMessages => {
          if (prevMessages.length === 0) {
            return [welcomeMessage];
          }
          return prevMessages;
        });
      });

      setHasInitialized(true);
    }
  }, [persona, hasInitialized, getAllMessages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim() || !persona) return;

    const userMessage: Message = {
      _id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      createdAt: new Date(),
      personaId: persona._id || "",
      userId: "",
    };

    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue("");

    try {
      // Save user message to database
      await axios.post("/api/chat/create", {
        content: currentInput,
        personaId: id,
        sender: "user",
      });

      // Get AI response
      const historyMessage = messages.slice(-15);
      const response = await getMessage(currentInput, persona, historyMessage);
      
      console.log(response);
      
      if (typeof response === "string") {
        const aiMessage: Message = {
          _id: (Date.now() + 1).toString(),
          content: response,
          sender: "persona",
          createdAt: new Date(),
          personaId: persona._id || "",
          userId: "",
        };

        setMessages(prev => [...prev, aiMessage]);

        // Save AI message to database
        await axios.post("/api/chat/create", {
          content: response,
          personaId: id,
          sender: "persona",
        });
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      // Optionally remove the user message if API call failed
      setMessages(prev => prev.filter(msg => msg._id !== userMessage._id));
      setInputValue(currentInput); // Restore input value
    }
  }, [inputValue, persona, messages, id]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  if (isLoading || !persona) {
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
                  {message.createdAt instanceof Date 
                    ? message.createdAt.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : new Date(message.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                  }
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
            onKeyPress={handleKeyPress}
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
