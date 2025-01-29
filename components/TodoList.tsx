"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Edit } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { uploadToGoogleDrive } from "@/utils/uploadfile";
import { Todo } from "@/dto/todo";

// Export the interface so it can be used by other components
export interface TodoListProps {
  todos: Todo[];
  onDelete: (id: string) => Promise<boolean>;
  onUpdate: (id: string, data: Partial<Todo>) => Promise<boolean>;
  onRefresh: () => Promise<void>;
}

const TodoList: React.FC<TodoListProps> = ({
  todos,
  onDelete,
  onUpdate,
  onRefresh,
}) => {
  const [editingTodoId, setEditingTodoId] = useState("");
  const [editText, setEditText] = useState("");
  const [editImage, setEditImage] = useState<File | null>(null);
  const [editImageUrl, setEditImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleEdit = async () => {
    setIsSaving(true);
    setIsUploading(true);
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
        newImageUrl = await uploadToGoogleDrive(editImage, "edited-todo-image");
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Image upload failed",
        });
        return;
      } finally {
        setIsUploading(false);
        setIsSaving(false);
      }
    }

    const success = await onUpdate(editingTodoId, {
      text: editText,
      imageUrl: newImageUrl,
    });

    if (success) {
      setEditingTodoId("");
      setEditText("");
      setEditImage(null);
      setEditImageUrl("");
      await onRefresh();
    }
  };

  const toggleComplete = async (todo: Todo) => {
    const success = await onUpdate(todo.id, {
      completed: !todo.completed,
    });

    if (success) {
      await onRefresh();
    }
    
  };

  return (
    <div className="w-full max-w-md space-y-6">
      {todos.map((todo) => (
        <div
          key={todo.id}
          className="flex flex-col p-3 border rounded-lg gap-3"
        >
          {editingTodoId === todo.id ? (
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
                <Button onClick={handleEdit} disabled={isUploading || isSaving}>
                  {isUploading
                    ? "Uploading..."
                    : isSaving
                    ? "Saving..."
                    : "Save"}
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
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleComplete(todo)}
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
                    onClick={() => onDelete(todo.id)}
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
  );
};

export default TodoList;
