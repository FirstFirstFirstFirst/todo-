"use client";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, Loader2, Divide } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { uploadToGoogleDrive } from "@/utils/uploadfile";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  imageUrl?: string;
  // Added new fields from Prisma schema
  createdAt?: Date;
  updatedAt?: Date;
}

// todo.id
// todo.text
// todo.completed
// todo.imageUrl

export interface Toggling {
  id: string;
  loading: boolean;
}

const Page: React.FC = () => {
  const [item, setItem] = useState<string>("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>("");
  const [editingTodoId, setEditingTodoId] = useState<string>("");
  const [editText, setEditText] = useState<string>("");
  const [editImage, setEditImage] = useState<File | null>(null);
  const [editImageUrl, setEditImageUrl] = useState<string>("");
  const [filter, setFilter] = useState<string>("all");
  const [isToggling, setIsToggling] = useState<Toggling>({
    id: "",
    loading: false,
  });
  const { toast } = useToast();

  // ====================
  useEffect(() => {
    fetchTodos();
  }, []);

  // ====================
  const fetchTodos = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/todos");

      const data = await response.json();
      // sort todo
      // filter
      // search

      // console.log("response.json()", data);
      setTodos(data);
      toast({
        variant: "success",
        title: "Fetched Success",
        description: "Data received from database",
      });
      setIsLoading(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch todos",
      });
      setIsLoading(false);
    }
  };

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

  // ====================
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
      setIsUploading(true);
      imageUrl = await uploadToGoogleDrive(selectedImage, "todo-image");
      setIsUploading(false);
    }

    try {
      // ====================
      await fetch("/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: item,
          imageUrl,
        }),
      });

      await fetchTodos(); // ====================

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
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add todo",
      });
    }
  };

  // ====================
  const deleteTodo = async (id: string) => {
    setIsLoading(true);
    try {
      await fetch(`/api/todos/${id}`, {
        method: "DELETE",
      });
      await fetchTodos();
      toast({
        title: "Deleted",
        description: "Todo removed successfully",
      });
      setIsLoading(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete todo",
      });
      setIsLoading(false);
    }
  };

  // ====================
  const toggleComplete = async (id: string) => {
    setIsToggling({ id, loading: true });
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;
    // ====================
    try {
      await fetch(`/api/todos/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          ...todo,
          completed: !todo.completed,
        }),
      });
      setIsToggling({ id, loading: false });
      await fetchTodos();
      toast({
        title: !todo.completed ? "Completed" : "Uncompleted",
        description: `Todo marked as ${
          !todo.completed ? "completed" : "incomplete"
        }`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update todo",
      });
      setIsToggling({ id, loading: false });
    }
  };

  // ====================
  const handleEdit = async () => {
    if (!editText.trim()) {
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
        newImageUrl = await uploadToGoogleDrive(editImage, "edited-todo-image");
        // newImageUrl = URL.createObjectURL(editImage);
        // await uploadToGoogleDrive(editImage, "edited-todo-image");
      } catch (error) {
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

    try {
      await fetch(`/api/todos/${editingTodoId}`, {
        method: "PUT",
        body: JSON.stringify({
          text: editText,
          imageUrl: newImageUrl,
        }),
      });

      await fetchTodos();

      setEditingTodoId("");
      setEditText("");
      setEditImage(null);
      setEditImageUrl("");

      toast({
        title: "Updated",
        description: "Todo updated successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update todo",
      });
    }
  };

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    toast({
      title: "Filter Changed",
      description: `Showing ${newFilter} todos`,
    });
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "completed") return todo.completed;
    if (filter === "uncompleted") return !todo.completed;
    return true;
  });

  return (
    <div className="w-screen h-screen flex items-center justify-start flex-col gap-8 p-8 mt-24">
      <div className="text-4xl">Todo</div>
      {/* filter */}
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
      {/* todoform */}
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
      {/* todolist */}
      {isLoading ? (
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      ) : (
        <div className="w-full max-w-md space-y-6 mb-24">
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
                          setEditImageUrl(
                            URL.createObjectURL(e.target.files[0])
                          );
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
                      {isUploading ? "Toggling..." : "Save"}
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
                      {isToggling.loading && todo.id == isToggling.id ? (
                        <div className="animate-spin">
                          <Loader2 />
                        </div>
                      ) : (
                        <input
                          type="checkbox"
                          checked={todo.completed}
                          onChange={() => toggleComplete(todo.id)}
                          className="w-5 h-5"
                        />
                      )}

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
                        {isDeleting ? (
                          <div
                            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                            role="status"
                          >
                            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                              Loading...
                            </span>
                          </div>
                        ) : (
                          <Trash2 size={18} />
                        )}
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
      )}
    </div>
  );
};

export default Page;
