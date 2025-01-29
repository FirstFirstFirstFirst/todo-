"use client";
import React from "react";
import TodoForm from "@/components/TodoForm";
import TodoList from "@/components/TodoList";
import FilterButtons from "@/components/FilterButtons";
import { useTodos } from "@/hooks/useTodos";
import { Todo, TodoFormData } from "@/dto/todo";
import { FilterOption } from "@/constants/filters";

const Page: React.FC = () => {
  const {
    todos: filteredTodos,
    isLoading,
    filter,
    setFilter,
    addTodo,
    updateTodo,
    deleteTodo,
    refreshTodos,
  } = useTodos();

  // Handle filter changes from the FilterButtons component
  // This function ensures type safety by only accepting valid filter options
  const handleFilterChange = (newFilter: FilterOption) => {
    setFilter(newFilter);
  };

  // Handle form submission from TodoForm component
  // This function processes the TodoFormData and ensures all required fields are present
  const handleTodoSubmit = async (formData: TodoFormData) => {
    const success = await addTodo(formData);
    if (success) {
      // Refresh the todo list only if the addition was successful
      await refreshTodos();
    }
  };

  return (
    <div className="w-screen min-h-screen flex items-center justify-start flex-col gap-8 p-8 pt-24 pb-24">
      <div className="text-4xl font-bold">To Do</div>

      {/* Filter buttons component with type-safe props */}
      <FilterButtons
        currentFilter={filter}
        onFilterChange={handleFilterChange}
      />

      {/* Form component for adding new todos */}
      <TodoForm onSubmit={handleTodoSubmit} />

      {/* Conditional rendering based on loading state */}
      {isLoading ? (
        <div className="flex items-center justify-center w-full p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      ) : (
        <TodoList
          todos={filteredTodos}
          onDelete={deleteTodo}
          onUpdate={updateTodo}
          onRefresh={refreshTodos}
        />
      )}
    </div>
  );
};

export default Page;
