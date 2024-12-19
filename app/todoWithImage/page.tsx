"use client";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  //=========================
  imageUrl?: string;
}

const Page: React.FC = () => {
  const [item, setItem] = useState<string>("");
  const [todos, setTodos] = useState<Todo[]>([]);
  //=========================
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>("");
  const { toast } = useToast();
  const handleInputChange = (e: any) => {
    setItem(e.target.value);
  };
  //=========================
  // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const handleImageChange = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);

      const imageUrl = URL.createObjectURL(file);
      setSelectedImageUrl(imageUrl);
      console.log("imageUrl", imageUrl);
      console.log("selectedImageUrl", selectedImageUrl);

      toast({
        variant: "success",
        title: "Success",
        description: "Image selected successfully",
      });
    }
  };

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!item.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a todo item",
      });
      return;
    }

    let imageUrl = ""; //=========================
    if (selectedImage) {
      //=========================
      imageUrl = URL.createObjectURL(selectedImage);
    }

    setTodos((prevTodos) => [
      ...todos,
      {
        id: `${prevTodos.length + 1}`,
        text: item,
        completed: false,
        imageUrl,
      },
    ]);

    setItem("");
    setSelectedImage(null);
    setSelectedImageUrl("");
    //=========================
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    console.log("fileInput", fileInput);
    if (fileInput) fileInput.value = "";
    toast({
      title: "Success",
      description: "Todo added successfully",
    });
  };

  const deleteTodo = (id: string): void => {
    setTodos(todos.filter((todo) => todo.id !== id));
    toast({
      title: "Deleted",
      description: "Todo removed successfully",
    });
  };

  const toggleComplete = (id: string): void => {
    setTodos(
      todos.map((todo) => {
        if (todo.id === id) {
          const newStatus = !todo.completed;
          toast({
            title: newStatus ? "Completed" : "Uncompleted",
            description: `Todo marked as ${
              newStatus ? "completed" : "incomplete"
            }`,
          });
          const newTodo = {
            id: todo.id,
            text: todo.text,
            completed: newStatus,
          };
          return { ...todo, completed: newStatus };
        }
        return todo;
      })
    );
  };

  return (
    <div className="w-screen h-screen flex items-center justify-start flex-col gap-8 p-8 pt-24 pb-24">
      <div className="text-4xl">To Do</div>
      <form
        className="w-full max-w-md flex flex-col gap-4"
        onSubmit={submitForm}
      >
        <div className="flex items-center gap-4">
          <label>Item</label>
          <input
            placeholder="Enter item"
            value={item}
            className="border border-black rounded-md p-2 flex-1"
            onChange={handleInputChange}
          />
        </div>

        <div className="flex items-center gap-4">
          <label>Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="flex-1"
          />
        </div>
        {selectedImageUrl}
        {selectedImageUrl && (
          <div className="flex">
            <Image
              src={selectedImageUrl}
              alt={selectedImageUrl as string}
              width={400}
              height={400}
              className="object-cover rounded-md"
            />
          </div>
        )}
        <Button type="submit">Submit</Button>
      </form>

      <div className="w-full max-w-md space-y-6">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className="flex flex-col p-3 border rounded-lg gap-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleComplete(todo.id)}
                  className="w-5 h-5"
                />
                <span
                  className={todo.completed ? "line-through text-gray-500" : ""}
                >
                  {todo.text}
                </span>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteTodo(todo.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={18} />
              </Button>
            </div>

            {todo.imageUrl && (
              <div className="relative w-full h-48">
                {/* {todo.imageUrl} */}
                <Image
                  src={todo.imageUrl}
                  alt={todo.text}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
