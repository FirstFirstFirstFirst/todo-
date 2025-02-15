"use client";
import { TodoFormData } from "@/dto/todo";
import { Todo } from "@prisma/client";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
export interface LoadingStates {
  todos: boolean;
  add: boolean;
  edit: boolean;
  delete: boolean;
  uploadPhoto: boolean;
}

// export type LoadingStates = Record<string, boolean>;

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const [loadingStates, setLoadingStates] = useState({
    todos: false,
    add: false,
    edit: false,
    delete: false,
    uploadPhoto: false,
  });
  const setLoading = (key: keyof LoadingStates, value: boolean) => {
    console.log("type of key", typeof key);
    setLoadingStates((prev) => {
      return { ...prev, [key]: value };
    });
  };

  const fetchTodos = useCallback(async () => {
    setLoading("todos", true);
    try {
      const response = await fetch("/api/todos");
      const data = await response.json();
      setTodos(data);
      setLoading("todos", false);
    } catch (error) {
      setLoading("todos", false);
      console.log("Fetch todos failed", error);
    }
  }, []);

  useEffect(() => {
    console.log("refetching todos");
    fetchTodos();
  }, [fetchTodos]);

  const [filter, setFilter] = useState<string>("ALL");

  const addTodo = async (todo: TodoFormData) => {
    setLoading("add", true);
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
      // await fetchTodos();
      setLoading("add", false);
    } catch (error) {
      setLoading("add", false);
      console.error("Add todo failed", error);
    }
  };

  const deleteTodo = async (id: string) => {
    setLoading("delete", true);
    try {
      await fetch(`/api/todos/${id}`, {
        method: "DELETE",
      });
      // await fetchTodos();
      setLoading("delete", false);
    } catch (error) {
      setLoading("delete", false);
      console.log("Delete todo failed", error);
    }
  };

  const editTodo = async (todo: Todo) => {
    console.log("editTodo being called");
    console.log("todo in edit todo", todo);
    setLoading("edit", true);
    const { id } = todo;
    try {
      const res = await axios(`/api/todos/${id}`, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("res", res);
      setLoading("edit", false);
    } catch (error) {
      setLoading("edit", false);
      console.error("Edit todo failed", error);
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

  return {
    todos: filteredTodos,
    loadingStates,
    setLoading,
    filter,
    addTodo,
    editTodo,
    deleteTodo,
    changeFilterTo,
  };
};
