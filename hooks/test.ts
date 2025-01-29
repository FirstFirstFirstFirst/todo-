import { useState } from "react";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  //=========================
  imageUrl?: string;
}
interface TodoForm {
  text: string;
  imageUrl: string;
}

interface toggling {
  id: string;
  loading: boolean;
}

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isAddingtodo, setIsAddingtodo] = useState(false);
  const [editUploading, setEditUploading] = useState(false);
  const [isloading, setIsloading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setisToggling] = useState<toggling>({
    id: "",
    loading: false,
  });

  const fetchTodos = async () => {
    setIsloading(true);
    try {
      const response = await fetch("/api/todos");
      const data = await response.json();
      setTodos(data);
      setIsloading(false);
      console.log("Fetch todos success", data);
    } catch (error) {
      setIsloading(false);
      console.log("Fetch todos failed", error);
    }
  };

  const addTodo = async (todo: TodoForm) => {
    setIsAddingtodo(true);
    const { text, imageUrl } = todo;
    try {
      await fetch("/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          imageUrl,
        }),
      });
      setIsAddingtodo(false);
    } catch (error) {
      setIsAddingtodo(false);
    }
  };

  const deleteTodo = async (id: string) => {
    setIsDeleting(true);
    try {
      await fetch(`/api/todos/${id}`, {
        method: "DELETE",
      });
    } catch (error) {}
    setIsDeleting(false);
  };
};
