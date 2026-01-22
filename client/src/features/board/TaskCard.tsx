import React from "react";
import { useDispatch } from "react-redux";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { Draggable } from "@hello-pangea/dnd";
import { updateTaskStatus, deleteTask } from "../tasks/tasksSlice";
import type { AppDispatch } from "../../store";
import type { Task } from "../../types";

interface TaskCardProps {
  task: Task;
  index: number;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, index }) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleMove = async (newStatus: "todo" | "in-progress" | "done") => {
    if (task.status === newStatus) return;
    try {
      await dispatch(
        updateTaskStatus({
          id: task._id,
          updates: { status: newStatus },
        }),
      ).unwrap();
      toast.success(`Moved to ${newStatus}`);
    } catch (err) {
      toast.error("Failed to move task");
      console.error("Failed to move task:", err);
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this task?")) {
      try {
        await dispatch(deleteTask(task._id)).unwrap();
        toast.info("Task deleted");
      } catch (err) {
        toast.error("Failed to delete task");
        console.error("Failed to delete task:", err);
      }
    }
  };

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-white p-4 rounded-md shadow-sm mb-3 border-l-4 border-blue-500"
          style={{ ...provided.draggableProps.style }}
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg text-gray-800">
              {task.title}
            </h3>
            <div className="relative group">
              <button className="text-gray-400 hover:text-gray-600 focus:outline-none">
                &#8942;
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg hidden group-hover:block z-10">
                <div className="py-1">
                  <p className="px-4 py-2 text-xs text-gray-500 font-semibold uppercase tracking-wider">
                    Move to
                  </p>
                  {task.status !== "todo" && (
                    <button
                      onClick={() => handleMove("todo")}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      To Do
                    </button>
                  )}
                  {task.status !== "in-progress" && (
                    <button
                      onClick={() => handleMove("in-progress")}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      In Progress
                    </button>
                  )}
                  {task.status !== "done" && (
                    <button
                      onClick={() => handleMove("done")}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Done
                    </button>
                  )}
                  <div className="border-t my-1"></div>
                  <button
                    onClick={handleDelete}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>

          {task.description && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-3">
              {task.description}
            </p>
          )}

          <div className="text-xs text-gray-500 flex justify-between items-center mt-2">
            <span>Due: {format(new Date(task.dueDate), "MMM d, yyyy")}</span>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
