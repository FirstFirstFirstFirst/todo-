"use client";
import { useEffect, useState } from "react";

interface TodoForm {
  text: string;
  imageUrl: string;
}

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  imageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const useTodosForBonus = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isEditUploading, setIsEditUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [filter, setFilter] = useState<string>("ALL");

  const fetchTodos = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/todos");
      const data = await response.json();
      setTodos(data);
      setIsLoading(false);
      // console.log("Fetch todos success", data);
    } catch (error) {
      setIsLoading(false);
      // console.log("Fetch todos failed", error);
    }
  };

  const addTodo = async (todo: TodoForm) => {
    setIsAddingTodo(true);
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
      setIsAddingTodo(false);
    } catch (error) {
      setIsAddingTodo(false);
    }
  };

  const deleteTodo = async (id: string) => {
    setIsDeleting(true);
    try {
      await fetch(`/api/todos/${id}`, {
        method: "DELETE",
      });
      await fetchTodos();
      setIsDeleting(false);
    } catch (error) {
      setIsDeleting(false);
    }
  };

  const editTodo = async (todo: Todo) => {
    setIsUploading(true);
    const { id } = todo;
    try {
      await fetch(`/api/todos/${id}`, {
        method: "PUT",
        body: JSON.stringify({ todo }),
      });
      setIsUploading(false);
    } catch (error) {
      setIsUploading(false);
    }
  };

  const changeFilterTo = (filter: string) => {
    setFilter(filter);
  };
  
  const filteredTodos = todos.filter((todo) => {
    if (filter === "completed") return todo.completed;
    if (filter === "uncompleted") return !todo.completed;
    return true;
  });

  useEffect(() => {
    fetchTodos();
  });

  return {
    todos: filteredTodos,
    isLoading,
    isAddingTodo,
    isUploading,
    isEditUploading,
    isDeleting,
    filter,
    addTodo,
    editTodo,
    deleteTodo,
    changeFilterTo,
  };
};
