import React, { useState } from "react";
import { LoadingStates } from "@/hooks/useTodos";
import { Todo } from "@prisma/client";
import Image from "next/image";
import { Button } from "../ui/button";
import { Edit, Trash2 } from "lucide-react";
import { uploadToGoogleDrive } from "@/utils/uploadfile";
interface TodoListProps {
  loadingStates: LoadingStates;
  todos: Todo[];
  editTodo: (todo: Todo) => void;
  deleteTodo: (id: string) => void;
}

const TodoList = ({
  loadingStates,
  todos,
  editTodo,
  deleteTodo,
}: TodoListProps) => {
  console.log("todo in todolist", todos);
  const [editingTodoId, setEditingTodoId] = useState("");
  const [editText, setEditText] = useState("");
  const [editImage, setEditImage] = useState<File | null>(null);
  const [editImageUrl, setEditImageUrl] = useState<string | null>(null);

  const handleEditTodo = async (todo: Todo) => {
    console.log("handle edit todo being called");
    if (!editText) {
      console.log("no edit text!");
      return;
    }

    try {
      let imageUrl = "";
      if (editImage) {
        imageUrl = await uploadToGoogleDrive(editImage);
        setEditImageUrl(imageUrl);
      }
      const updatedTodo = { ...todo, text: editText, imageUrl };
      console.log("updatedTodo", updatedTodo);
      editTodo(updatedTodo);
      setEditingTodoId("");
      setEditText("");
      setEditImage(null);
      setEditImageUrl("");
    } catch (error) {
      console.log("Edit todo failed", error);
    }
  };
  return (
    <div className=" w-full max-w-md space-y-6">
      {loadingStates.todos ? (
        <div className="items-center w-full flex justify-center">
          <div
            className=" inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {todos.map((todo) => (
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
                    <Button
                      onClick={() => {
                        console.log("onClick being called");
                        console.log("todo", todo);
                        handleEditTodo(todo);
                      }}
                      disabled={loadingStates.edit}
                    >
                      {loadingStates.edit ? "Saving..." : "Save"}
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
                        onChange={() =>
                          editTodo({ ...todo, completed: !todo.completed })
                        }
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
                        {loadingStates.delete ? (
                          <div
                            className="text-red-500 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
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

export default TodoList;
