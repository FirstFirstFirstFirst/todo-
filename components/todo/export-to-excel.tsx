import React from "react";
import { Button } from "../ui/button";
import { Todo } from "@prisma/client";
import { exportToExcel } from "@/utils/export-to-excel";

interface ExportToExcelProps {
  todos: Todo[];
}

const ExportToExcel = ({ todos }: ExportToExcelProps) => {
  return (
    <div>
      <Button
        variant={"outline"}
        onClick={() => {
          exportToExcel(todos);
        }}
      >
        ExportToExcel
      </Button>
    </div>
  );
};

export default ExportToExcel;
