import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

const Navbar = () => {
  return (
    <div className="sticky z-50 top-0 w-full flex justify-center bg-black">
      <div className="container max-w-screen-2xl h-14 bg-black flex flex-row w-full text-white items-center px-12 space-x-4">
        <Link href={"/"} className="font-bold">
          First
        </Link>
        <div className="text-sm w-full flex justify-between">
          <div className="space-x-4 flex items-center">
            <Link href={"/todo"}>
              <Button variant={"link"} className="text-white p-0 h-fit">
                Todo
              </Button>
            </Link>
            <Link href={"/chat"}>
              <Button variant={"link"} className="text-white p-0 h-fit">
                Chat
              </Button>
            </Link>
            <Link href={"/"}>
              <Button variant={"link"} className="text-white p-0 h-fit">
                Coming soon
              </Button>
            </Link>
          </div>
          <div className="space-x-4 flex items-center">
            <SignedOut>
              <Button variant={"link"} className="text-white p-0 h-fit">
                <SignInButton />
              </Button>
              <Button variant={"secondary"}>
                <SignUpButton />
              </Button>
            </SignedOut>
            <SignedIn>
              <div className="flex p-0.5 bg-white rounded-full">
                <UserButton />
              </div>
            </SignedIn>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
