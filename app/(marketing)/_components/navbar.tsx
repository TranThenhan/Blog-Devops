"use client";

import { useConvexAuth } from "convex/react";
import { SignInButton, UserButton } from "@clerk/clerk-react";
import Link from "next/link";

import { useScrollTop } from "@/hooks/use-scroll-top";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/spinner";
import { cn } from "@/lib/utils";

import { Logo } from "./logo";

export const Navbar = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const scrolled = useScrollTop();

  return (
    <div className={cn(
      "z-50 bg-background dark:bg-[#1F1F1F] fixed top-0 flex items-center w-full p-4",
      scrolled && "border-b shadow-sm",
      "border-eee border-solid border-t border-r border-l border-b"
    )}>
      <Logo />
      <div className="md:ml-auto md:justify-end justify-between w-full flex items-center gap-x-8">
        {isLoading && (
          <Spinner />
        )}
        {!isAuthenticated && !isLoading && (
          <>
            <Button variant="ghost" size="sm" asChild >
              <Link href="/preview/j577s1p8r1zeved2f3md32sdkn6qeyfy" target="_blank" rel="noopener noreferrer">
                Documents
              </Link>
            </Button>
            <SignInButton mode="modal">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </SignInButton>
            <SignInButton mode="modal">
              <Button size="sm">
                Get Blog Free
              </Button>
            </SignInButton>
          </>
        )}
        {isAuthenticated && !isLoading && (
          <>
            <Button variant="ghost" size="sm" asChild >
              <Link href="/preview/j577s1p8r1zeved2f3md32sdkn6qeyfy" target="_blank" rel="noopener noreferrer">
                Documents
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild >
              <Link href="/documents">
                Enter Create Blog
              </Link>
            </Button>
            <UserButton
              afterSignOutUrl="/"
            />
          </>
        )}
        <ModeToggle />
      </div>
    </div>
  )
}