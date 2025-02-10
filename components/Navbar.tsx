"use client"

import React, { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const user: User | null = session?.user as User | null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left section */}
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-600"
            >
              STEALTH CHAT
            </Link>
          </div>

          {/* Center Navigation - Hidden on mobile */}
          <div className="hidden md:flex space-x-6">
            <Link href="#" className="hover:text-primary transition">
              Blog
            </Link>
            <Link href="#" className="hover:text-primary transition">
              About
            </Link>
            <Link href="#" className="hover:text-primary transition">
              Contact
            </Link>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>

            {/* Desktop authentication */}
            <div className="hidden md:flex items-center space-x-4">
              {session ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-muted-foreground">
                    Welcome, {user?.username || user?.email}
                  </span>
                  <Button variant="outline" onClick={() => signOut()} size="sm">
                    Log out
                  </Button>
                </div>
              ) : (
                <Link href="/sign-in">
                  <Button variant="default" size="sm">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden border-t">
            <div className="flex flex-col space-y-4 px-4 py-6">
              <Link href="#" className="hover:text-primary transition">
                Blog
              </Link>
              <Link href="#" className="hover:text-primary transition">
                About
              </Link>
              <Link href="#" className="hover:text-primary transition">
                Contact
              </Link>
              {session ? (
                <div className="flex flex-col space-y-4">
                  <span className="text-sm text-muted-foreground">
                    Welcome, {user?.username || user?.email}
                  </span>
                  <Button variant="outline" onClick={() => signOut()} size="sm">
                    Log out
                  </Button>
                </div>
              ) : (
                <Link href="/sign-in">
                  <Button variant="default" size="sm">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;