"use client";
import ExportToExcel from "@/components/todo/export-to-excel";
import TodoFilter from "@/components/todo/todo-filter";
import TodoForm from "@/components/todo/todo-form";
import TodoList from "@/components/todo/todo-list";
import { useTodos } from "@/hooks/useTodos";

export interface Toggling {
  id: string;
  loading: boolean;
}

const Page: React.FC = () => {
  const {
    todos,
    loadingStates,
    filter,
    addTodo,
    editTodo,
    deleteTodo,
    changeFilterTo,
  } = useTodos();

  return (
    <div className="w-full flex items-center justify-start flex-col gap-8 p-8 mt-24">
      <div className="text-4xl">Todo</div>

      <TodoFilter filter={filter} changeFilterTo={changeFilterTo} />

      <TodoForm addTodo={addTodo} />

      <ExportToExcel todos={todos} />

      <TodoList
        todos={todos}
        editTodo={editTodo}
        deleteTodo={deleteTodo}
        loadingStates={loadingStates}
      />
    </div>
  );
};

export default Page;
