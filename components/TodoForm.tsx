"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { uploadToGoogleDrive } from "@/utils/uploadfile";
import { TodoFormData } from "@/dto/todo";

// Export the interface so it can be used by other components
export interface TodoFormProps {
  onSubmit: (data: TodoFormData) => Promise<void>;
}

const TodoForm: React.FC<TodoFormProps> = ({ onSubmit }) => {
  const [item, setItem] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const { toast } = useToast();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setSelectedImageUrl(URL.createObjectURL(file));
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
      setIsUploading(true);
      try {
        imageUrl = await uploadToGoogleDrive(selectedImage, "todo-image");
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to upload image",
        });
        return;
      } finally {
        setIsUploading(false);
      }
    }

    // Call the provided onSubmit function with the form data
    await onSubmit({ text: item, imageUrl });

    // Reset form state
    setItem("");
    setSelectedImage(null);
    setSelectedImageUrl("");

    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  return (
    <form className="w-full max-w-md flex flex-col gap-4" onSubmit={submitForm}>
      <div className="flex items-center gap-4">
        <label>Item</label>
        <input
          placeholder="Enter item"
          value={item}
          className="border border-black rounded-md p-2 flex-1"
          onChange={(e) => setItem(e.target.value)}
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
  );
};

export default TodoForm;
