"use client";
import { Button } from "@/components/ui/button";
import { Trash2, Edit } from "lucide-react";
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { uploadToGoogleDrive } from "@/utils/uploadfile";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  imageUrl?: string;
}

const Page: React.FC = () => {
  const [item, setItem] = useState<string>("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  // const [isEditUploading, setIsEditUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>("");
  //=========================
  const [editingTodoId, setEditingTodoId] = useState<string>("");
  const [editText, setEditText] = useState<string>("");
  const [editImage, setEditImage] = useState<File | null>(null);
  const [editImageUrl, setEditImageUrl] = useState<string>("");

  const [filter, setFilter] = useState<string>("all");

  const { toast } = useToast();

  const handleInputChange = (e: any) => {
    setItem(e.target.value);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      const imageUrl = URL.createObjectURL(file);
      setSelectedImageUrl(imageUrl);
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

    let imageUrl = "";
    if (selectedImage) {
      imageUrl = URL.createObjectURL(selectedImage);

      setIsUploading(true);
      await uploadToGoogleDrive(selectedImage, "todo-image");
      toast({
        title: "Success",
        description: "Upload Image Successfully",
      });
      setIsUploading(false);
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

    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
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
            title: newStatus ? "Completed" : "uncompleted",
            description: `Todo marked as ${
              newStatus ? "completed" : "incomplete"
            }`,
          });
          return { ...todo, completed: newStatus };
        }
        return todo;
      })
    );
  };

  //=========================
  const editTodo = (
    id: string,
    newText: string,
    newImageUrl?: string
  ): void => {
    setTodos(
      todos.map((todo) => {
        if (todo.id === id) {
          toast({
            title: "Updated",
            description: "Todo updated successfully",
          });
          return {
            ...todo,
            text: newText,
            imageUrl: newImageUrl || todo.imageUrl,
          };
        }
        return todo;
      })
    );
  };

  const handleEdit = async () => {
    if (!editText.trim()) {
      // if (editImage) {
      //   console.log(URL.createObjectURL(editImage));
      // }
      toast({
        variant: "destructive",
        title: "Error",
        description: "Todo text cannot be empty",
      });
      return;
    }

    let newImageUrl = editImageUrl;

    if (editImage) {
      try {
        setIsUploading(true);
        newImageUrl = URL.createObjectURL(editImage);
        await uploadToGoogleDrive(editImage, "edited-todo-image");
        toast({
          title: "Success",
          description: "Image updated successfully",
        });
      } catch (error) {
        console.error("Image upload failed", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Image upload failed",
        });
        return;
      } finally {
        setIsUploading(false);
      }
    }

    editTodo(editingTodoId!, editText, newImageUrl);
    setEditingTodoId(""); //trigger close todo
    setEditText("");
    setEditImage(null);
    setEditImageUrl("");
  };

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    toast({
      title: "Filter Changed",
      description: `Showing ${newFilter} todos`,
      // description: "Showing " + newFilter + " todos",
    });
  };

  //todos = [eat, sleep, sit]
  // todo.completed == true ==> todo is completed
  // ถ้าต้องการ filter ตัวที่ completed แล้ว เราสามารถ เช็คได้จาก todo.completed == true
  const filteredTodos = todos.filter((todo) => {
    if (filter === "completed") return todo.completed;

    if (filter === "uncompleted") return !todo.completed;

    return true;
  });

  // const filteredTodos = todos.filter((todo) => {
  //   if (filter === "all") return true;
  //   return filter === "completed" ? todo.completed : !todo.completed;
  //   // if (filter === "completed") return todo.completed;
  //   // if (filter === "uncompleted") return !todo.completed;
  //   // return true;
  // });

  return (
    <div className="w-screen h-screen flex items-center justify-start flex-col gap-8 p-8 pt-24 pb-24">
      <div className="text-4xl">To Do</div>
      {isUploading ? (
        <div className="text-4xl">
          <div>Loading</div>
        </div>
      ) : (
        <div className="text-4xl">
          <div>Component</div>
        </div>
      )}
      <div className="flex gap-4">
        <Button
          // variant={filter === "all" ? "default" : "outline"}
          onClick={() => handleFilterChange("all")}
          className={`px-4 py-2 rounded ${
            filter === "all"
              ? "bg-black text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          All
        </Button>
        <Button
          onClick={() => handleFilterChange("completed")}
          className={`px-4 py-2 rounded ${
            filter === "completed"
              ? "bg-black text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          Completed
        </Button>
        <Button
          onClick={() => handleFilterChange("uncompleted")}
          className={`px-4 py-2 rounded ${
            filter === "uncompleted"
              ? "bg-black text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          Uncompleted
        </Button>
      </div>

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
        {selectedImageUrl && (
          <div className="flex">
            <Image
              src={selectedImageUrl}
              alt="Selected image"
              width={400}
              height={400}
              className="object-cover rounded-md"
            />
          </div>
        )}
        <Button type="submit" disabled={isUploading}>
          {isUploading ? "Uploading..." : "Submit"}
        </Button>
      </form>

      <div className="w-full max-w-md space-y-6">
        {filteredTodos.map((todo) => (
          <div
            key={todo.id}
            className="flex flex-col p-3 border rounded-lg gap-3"
          >
            {editingTodoId === todo.id ? (
              // Edit mode
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-4">
                  <input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="flex-1 border border-black rounded-md p-2"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setEditImage(e.target.files[0]);
                        setEditImageUrl(URL.createObjectURL(e.target.files[0]));
                      }
                    }}
                    className="flex-1"
                  />
                </div>
                {editImageUrl && (
                  <div className="relative w-full h-48">
                    <Image
                      src={editImageUrl}
                      alt="Edit preview"
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                )}
                <div className="flex gap-2">
                  <Button onClick={handleEdit} disabled={isUploading}>
                    {isUploading ? "Saving..." : "Save"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingTodoId("");
                      setEditText("");
                      setEditImage(null);
                      setEditImageUrl("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              // View mode
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleComplete(todo.id)}
                      className="w-5 h-5"
                    />
                    <span
                      className={
                        todo.completed ? "line-through text-gray-500" : ""
                      }
                    >
                      {todo.text}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditingTodoId(todo.id);
                        setEditText(todo.text);
                        setEditImageUrl(todo.imageUrl || "");
                      }}
                    >
                      <Edit size={18} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteTodo(todo.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </div>

                {todo.imageUrl && (
                  <div className="relative w-full h-48">
                    <Image
                      src={todo.imageUrl}
                      alt={todo.text}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
