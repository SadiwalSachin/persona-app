import React from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import {
  SignInButton,
  SignedOut,
  useUser,
} from "@clerk/nextjs";
import Link from "next/link";

const Navbar = () => {
  const { isSignedIn } = useUser();

  return (
    <header className="border-b bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <MessageCircle className="h-8 w-8 text-purple-600" />
          <h1 className="text-2xl font-bold text-gray-900">PersonaChat</h1>
        </div>
        <div className="flex items-center space-x-4">
          <SignedOut>
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
              <SignInButton />
            </Button>
          </SignedOut>
          {isSignedIn && (
            <Link href="/profile">
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                Profile
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
