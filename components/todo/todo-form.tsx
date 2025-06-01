import Image from "next/image";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { uploadToGoogleDrive } from "@/utils/uploadfile";
import { Loader, Loader2, Sparkle } from "lucide-react";

interface TodoFormProps {
  addTodo: (todo: { text: string; imageUrl: string }) => void;
}
const TodoForm = ({ addTodo }: TodoFormProps) => {
  const [todo, setTodo] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const handleGenerateTodo = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate-todo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          todo,
        }),
      });
      const data = await response.json();
      console.log("data", data);
      setTodo(data.text);
    } catch (error) {
      console.log("Error", error);
    } finally {
      setIsGenerating(false);
    }
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      // For preview:
      setSelectedImageUrl(URL.createObjectURL(file));
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTodo(e.target.value);
  };
  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    let imageUrl = "";

    try {
      setIsUploading(true);
      if (selectedImage) {
        imageUrl = await uploadToGoogleDrive(selectedImage, "todo-image");
        console.log("url", imageUrl);
      }

      addTodo({
        text: todo,
        imageUrl: imageUrl || "",
      });
      setIsUploading(false);
      // Reset form state
      setTodo("");
      setSelectedImage(null);
      setSelectedImageUrl(null);
      setIsUploading(false);
    } catch (error) {
      console.error("Error submitting form", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <form
        className="w-full max-w-md flex flex-col gap-4"
        onSubmit={submitForm}
      >
        {/* <div className="flex items-center gap-4 relative">
          <label>Todo</label>
          <div className="relative flex-1">
            <input
              placeholder="Enter item"
              value={todo}
              className="border border-gray-200 rounded-md p-2 w-full pr-8"
              onChange={handleInputChange}
            />
            {isGenerating ? (
              <Loader2 className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 animate-spin" />
            ) : (
              <Sparkle
                className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={handleGenerateTodo}
              />
            )}
          </div>
        </div> */}
        <div className="relative flex-1 flex items-center gap-4">
          <label>Todo</label>
          <input
            placeholder="Enter item"
            value={todo}
            className="border border-gray-200 rounded-md p-2 w-full pr-8"
            onChange={handleInputChange}
          />
          {isGenerating ? (
            <Loader2 className="h-4 w-4 absolute right-3 text-gray-400 animate-spin" />
          ) : (
            <Sparkle
              className="h-4 w-4 absolute right-3 cursor-pointer"
              onClick={handleGenerateTodo}
            />
          )}
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
          {isUploading
            ? "Uploading..."
            : isSubmitting
            ? "Submitting..."
            : "Submit"}
        </Button>
      </form>
    </div>
  );
};

export default TodoForm;
