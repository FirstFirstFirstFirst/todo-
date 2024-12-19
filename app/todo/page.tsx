"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Divide, ToggleLeft, ToggleRight, Trash2 } from "lucide-react";
import React, { useState, useId } from "react";
import { useToast } from "@/hooks/use-toast";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

const Page: React.FC = () => {
  const [item, setItem] = useState<string>("");
  const [todos, setTodos] = useState<Todo[]>([]);

  const { toast } = useToast();

  const submitForm = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    console.log("item submitted", item);
    console.log("item.trim()", item.trim());
    if (!item.trim()) {
      // if (item !== "") {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a todo item",
      });
      console.log("pls type something");
      return;
    }

    // setTodos((prevTodos) => [
    //   ...todos,
    //   {
    //     id: `${idPrefix}-${prevTodos.length}`,
    //     text: item,
    //     completed: false,
    //   },
    // ]);

    // const a = 0;
    // () => a + 1;

    // () => {
    //   a + 1;
    //   a + 2;
    // };

    // () => [];
    setTodos((prevTodos) => [
      ...todos,
      {
        id: `${prevTodos.length + 1}`,
        // id: "" + prevTodos.length + 1 + "",
        // id: (prevTodos.length + 1).toString(),
        text: item,
        completed: false,
      },
    ]);

    setItem("");
    console.log("todos", todos);
    toast({
      variant: "success",
      title: "Success",
      description: "Todo added successfully",
    });
  };

  const deleteTodo = (id: string): void => {
    const todoAfterDeleted = todos.filter((todo, index) => todo.id !== id);
    setTodos(todoAfterDeleted);
    toast({
      title: "Deleted",
      description: "Todo removed successfully",
    });
  };

  const toggleComplete = (id: string): void => {
    setTodos(
      todos.map((todo) => {
        if (todo.id === id) {
          const newStatus = !todo.completed;
          toast({
            title: newStatus ? "Completed" : "Uncompleted",
            description: `Todo marked as ${
              newStatus ? "completed" : "incomplete"
            }`,
          });
          const newTodo = {
            id: todo.id,
            text: todo.text,
            completed: newStatus,
          };
          return { ...todo, completed: newStatus };
        }
        return todo;
      })
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setItem(e.target.value);
    console.log("item", e.target.value);
    console.log("item", item);
  };

  return (
    <div className="w-screen h-screen flex items-center justify-start flex-col gap-8 p-8 pt-24 pb-24">
      <div className="text-4xl">To Do</div>
      <form
        className="w-full max-w-md flex items-center justify-center gap-4"
        onSubmit={submitForm}
      >
        <label>Item</label>
        <input
          placeholder="Enter item"
          value={item}
          className="border border-black rounded-md p-2 flex-1"
          onChange={handleInputChange}
        />
        <Button type="submit">Add</Button>
      </form>
      {/* <div>
        {todos.map((todo) => {
          // const helloTodo = "hello" + " " + todo.text;
          const helloTodo = todo.text;
          return (
            <div className="w-screen">
              <div className="items-center justify-between mx-12 gap-4 flex flex-row border border-black m-2 rounded-md p-2">
                <div className="w-1/4 flex flex-row items-center ">
                  <div className="p-1 border border-black bg-red-500 text-white">
                    Todo:
                  </div>
                  {helloTodo}
                </div>

                <div className="w-1/4 flex flex-row items-center ">
                  <div className="p-1 border border-black bg-red-500 text-white">
                    id:
                  </div>
                  {todo.id}
                </div>

                <div className="w-1/4 flex flex-row items-center gap-2">
                  {todo.completed ? (
                    <div>
                      <Button
                        onClick={() => {
                          toggleComplete(todo.id);
                        }}
                        className="w-32 bg-green-500"
                      >
                        <ToggleLeft />
                        completed
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <Button
                        variant={"outline"}
                        onClick={() => {
                          toggleComplete(todo.id);
                        }}
                        className="w-32"
                      >
                        <ToggleRight />
                        incompleted
                      </Button>
                    </div>
                  )}
                </div>

                <div className="w-1/4">
                  <Button
                    variant="destructive"
                    onClick={() => deleteTodo(todo.id)}
                  >
                    <Trash2 />
                    delete
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div> */}
      <div className="w-full max-w-md space-y-6 ">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className="flex items-center justify-between p-3 border rounded-lg"
          >
            <div className="flex items-center gap-3 ">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleComplete(todo.id)}
                className="w-5 h-5"
              />
              <span
                className={todo.completed ? "line-through text-gray-500" : ""}
              >
                {todo.text}
              </span>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => deleteTodo(todo.id)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 size={18} />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
