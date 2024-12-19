"use client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ToggleLeft, ToggleRight, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  imageUrl?: string;
}

const page = () => {
  const [item, setItem] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);

  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const [selectedImageUrl, setSelectedImageUrl] = useState<string>("");
  const handleImageChange = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      console.log("e.target.files", e.target.files);
      console.log("e.target.files[0]", e.target.files[0]);

      const file = e.target.files[0];
      setSelectedImage(file);

      const imageUrl = URL.createObjectURL(file);
      setSelectedImageUrl(imageUrl);
      console.log("imageUrl", imageUrl);
      console.log("selectedImageUrl", selectedImageUrl);

      toast({
        description: "success",
        title: "success",
        variant: "success",
      });
    }
  };

  const submitForm = (e: any) => {
    console.log("item submitted", item);
    e.preventDefault();
    toast({
      description: " ",
      title: "Success",
      variant: "success",
    });

    if (!item.trim()) {
      console.log("pls type something");
      toast({
        description: " pls type something",
        title: "Error",
        variant: "destructive",
      });
      return;
    }

    setTodos((prevTodos) => [
      ...todos,
      {
        id: `${prevTodos.length + 1}`,
        text: item,
        completed: false,
      },
    ]);

    setItem("");
    console.log("todos", todos);
  };

  const handleInputChange = (e: any): void => {
    setItem(e.target.value);
    console.log("item", e.target.value);
  };

  const deleteTodo = (id: string): void => {
    const todoAfterDeleted = todos.filter((todo) => todo.id !== id);
    setTodos(todoAfterDeleted);
  };

  const { toast } = useToast();

  const toggleComplete = (id: string): void => {
    setTodos(
      todos.map((todo) => {
        if (todo.id === id) {
          const newStatus = !todo.completed;
          return { ...todo, completed: newStatus };
        }
        return todo;
      })
    );
  };
  return (
    <div className="w-screen h-screen flex items-center justify-center flex-col gap-8">
      <div className="text-4xl">To Do</div>
      <form className="w-full flex flex-col items-center justify-center gap-4">
        <div className="flex flex-row item-center gap-4">
          <label className="">Item</label>
          <input
            placeholder="Enter item"
            value={item}
            className="border border-black rounded-md"
            onChange={handleInputChange}
          />
        </div>
        <div className="flex item-center gap-4">
          <label>Image</label>

          <input
            type="file"
            accept="image/*"
            className="border border-black rounded-md flex-1"
            onChange={handleImageChange}
          />
        </div>
        {selectedImageUrl}
        {selectedImageUrl && (
          <div className="relative">
            <Image
              src={selectedImageUrl}
              alt={selectedImageUrl as string}
              width={400}
              height={400}
              className="object-cover rounded-md"
            />
          </div>
        )}

        <Button type="submit" onClick={submitForm}>
          Submit
        </Button>
      </form>
      <div>
        {todos.map((todo) => {
          const helloTodo = "" + " " + todo.text;
          return (
            <div className="w-screen">
              <div className="rounded-md p-2 space-x-20 flex flex-row border items-center justify-between  border-black m-2">
                <div className="flex flex-row items-center w-1/4">
                  <div className="border rounded-md bg-gray-400  p-2">id: </div>
                  {todo.id}
                </div>

                <div className=" flex flex-row items-center w-1/4">
                  <div className="border rounded-md bg-gray-400  p-2">desc</div>
                  {helloTodo}
                </div>
                <div className="w-1/4">
                  {!todo.completed ? (
                    <Button
                      variant={"outline"}
                      className=""
                      onClick={() => toggleComplete(todo.id)}
                    >
                      incomplete <ToggleLeft></ToggleLeft>
                    </Button>
                  ) : (
                    <Button
                      variant={"outline"}
                      className=""
                      onClick={() => toggleComplete(todo.id)}
                    >
                      completed <ToggleRight></ToggleRight>
                    </Button>
                  )}
                </div>
                <div className="">
                  <Button
                    variant={"outline"}
                    className="bg-red-500 text-white"
                    onClick={() => deleteTodo(todo.id)}
                  >
                    del <Trash2></Trash2>
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default page;
