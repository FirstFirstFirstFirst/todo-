"use client";
import { Button } from "@/components/ui/button";
import { FilterOption, FILTER_OPTIONS } from "@/constants/filters";

// Export the interface so it can be imported by other components if needed
export interface FilterButtonsProps {
  currentFilter: FilterOption;
  onFilterChange: (filter: FilterOption) => void;
}

// Explicitly define the component with its props interface
const FilterButtons: React.FC<FilterButtonsProps> = ({
  currentFilter,
  onFilterChange,
}) => {
  return (
    <div className="flex gap-4">
      {Object.values(FILTER_OPTIONS).map((option) => (
        <Button
          key={option}
          onClick={() => onFilterChange(option)}
          className={`px-4 py-2 rounded ${
            currentFilter === option
              ? "bg-black text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          {option.charAt(0).toUpperCase() + option.slice(1)}
        </Button>
      ))}
    </div>
  );
};

export default FilterButtons;
