import { useState, useEffect } from "react";
import { Todo, TodoFormData } from "@/dto/todo";
import { useToast } from "@/hooks/use-toast";
import { FilterOption, FILTER_OPTIONS } from "../constants/filters";

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<FilterOption>(FILTER_OPTIONS.ALL);
  const { toast } = useToast();

  const fetchTodos = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/todos");
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch todos",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addTodo = async (todoData: TodoFormData) => {
    try {
      const response = await fetch("/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(todoData),
      });

      if (!response.ok) throw new Error("Failed to add todo");

      await fetchTodos();
      return true;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add todo",
      });
      return false;
    }
  };

  const updateTodo = async (id: string, todoData: Partial<Todo>) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(todoData),
      });

      if (!response.ok) throw new Error("Failed to update todo");

      await fetchTodos();
      return true;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update todo",
      });
      return false;
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete todo");

      await fetchTodos();
      return true;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete todo",
      });
      return false;
    }
  };

  const filteredTodos = todos.filter((todo) => {
    switch (filter) {
      case FILTER_OPTIONS.COMPLETED:
        return todo.completed;
      case FILTER_OPTIONS.UNCOMPLETED:
        return !todo.completed;
      default:
        return true;
    }
  });

  useEffect(() => {
    fetchTodos();
  }, []);

  return {
    todos: filteredTodos,
    isLoading,
    filter,
    setFilter,
    addTodo,
    updateTodo,
    deleteTodo,
    refreshTodos: fetchTodos,
  };
}
