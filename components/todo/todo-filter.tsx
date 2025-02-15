import React from "react";
import { Button } from "../ui/button";

interface TodoFilterProps {
  filter: string;
  changeFilterTo: (filter: string) => void;
}

const TodoFilter = ({ filter, changeFilterTo }: TodoFilterProps) => {
  return (
    <div className="flex gap-4">
      <Button
        onClick={() => changeFilterTo("all")}
        className={`px-4 py-2 rounded ${
          filter === "all"
            ? "bg-black text-white"
            : "bg-gray-200 text-gray-800 hover:bg-gray-300"
        }`}
      >
        All
      </Button>
      <Button
        onClick={() => changeFilterTo("completed")}
        className={`px-4 py-2 rounded ${
          filter === "completed"
            ? "bg-black text-white"
            : "bg-gray-200 text-gray-800 hover:bg-gray-300"
        }`}
      >
        Completed
      </Button>
      <Button
        onClick={() => changeFilterTo("uncompleted")}
        className={`px-4 py-2 rounded ${
          filter === "uncompleted"
            ? "bg-black text-white"
            : "bg-gray-200 text-gray-800 hover:bg-gray-300"
        }`}
      >
        Uncompleted
      </Button>
    </div>
  );
};

export default TodoFilter;
