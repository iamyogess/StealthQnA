"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";

const Navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;
  return (
    <nav>
      <div>
        <a href="/">Mystery Message</a>
        {session ? (
          <>
            <span>Welcome, {user?.username || user?.email}</span>
            <Button onClick={() => signOut()}>Log out</Button>
          </>
        ) : (
          <Link href="/sign-in">
            <Button>Sign In</Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
