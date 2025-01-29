import React from "react";
import { Button } from "./ui/button";

const FilterButtonForBonus = () => {
  
  
  return (
    <div>
      <div className="flex gap-4">
        <Button
          // variant={filter === "all" ? "default" : "outline"}
          onClick={() => handleFilterChange("all")}
          className={`px-4 py-2 rounded ${
            filter === "all"
              ? "bg-black text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          All
        </Button>
        <Button
          onClick={() => handleFilterChange("completed")}
          className={`px-4 py-2 rounded ${
            filter === "completed"
              ? "bg-black text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          Completed
        </Button>
        <Button
          onClick={() => handleFilterChange("uncompleted")}
          className={`px-4 py-2 rounded ${
            filter === "uncompleted"
              ? "bg-black text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          Uncompleted
        </Button>
      </div>
    </div>
  );
};

export default FilterButtonForBonus;
