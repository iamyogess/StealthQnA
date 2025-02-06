"use client";

import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function AuthPage() {
  const { data: session } = useSession();

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center space-y-4 p-8 rounded-lg">
        {session ? (
          <div className="space-y-4">
            <p className="text-lg">
              Signed in as <span className="font-semibold">{session.user.username}</span>
            </p>
            <Button 
              variant="destructive" 
              onClick={() => signOut()}
              className="w-full"
            >
              Sign Out
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-lg">Not signed in</p>
            <Button 
              variant="default"
              onClick={() => signIn()}
              className="w-full"
            >
              Sign In
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}