"use client";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Home: React.FC = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center flex-col p-8 gap-8 bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-4xl text-center">
            Welcome to My Website
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <p className="text-gray-600 text-center">
            A simple todo application to help you stay organized
          </p>
          <Link
            href="/todo"
            className={buttonVariants({
              variant: "default",
              size: "lg",
              className: "w-full max-w-xs",
            })}
          >
            Get Started with Todo App
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;
