import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DragDropContext, Droppable, type DropResult } from "@hello-pangea/dnd";
import { toast } from "react-toastify";
import type { RootState, AppDispatch } from "../../store";
import {
  fetchTasks,
  updateTaskStatus,
  moveTaskOptimistically,
} from "../tasks/tasksSlice";
import TaskCard from "./TaskCard";
import type { Task } from "../../types";

interface ColumnProps {
  title: string;
  tasks: Task[];
  statusColor: string;
  droppableId: string;
}

const Column: React.FC<ColumnProps> = ({
  title,
  tasks,
  statusColor,
  droppableId,
}) => (
  <Droppable droppableId={droppableId}>
    {(provided) => (
      <div
        ref={provided.innerRef}
        {...provided.droppableProps}
        className="flex-1 min-w-[300px] bg-gray-100 rounded-lg p-4 mx-2"
      >
        <h2
          className={`text-lg font-bold mb-4 pb-2 border-b-2 ${statusColor} flex justify-between items-center`}
        >
          {title}
          <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
            {tasks.length}
          </span>
        </h2>
        <div className="space-y-3 min-h-[100px]">
          {tasks.map((task, index) => (
            <TaskCard key={task._id} task={task} index={index} />
          ))}
          {provided.placeholder}
        </div>
      </div>
    )}
  </Droppable>
);

const Board: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, status, error } = useSelector(
    (state: RootState) => state.tasks,
  );

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchTasks());
    }
  }, [status, dispatch]);

  const sortedItems = [...items].sort((a, b) => {
    if (a.order !== b.order) {
      return a.order - b.order;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const tasksByStatus = {
    todo: sortedItems.filter((task) => task.status === "todo"),
    "in-progress": sortedItems.filter((task) => task.status === "in-progress"),
    done: sortedItems.filter((task) => task.status === "done"),
  };

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newStatus = destination.droppableId as
      | "todo"
      | "in-progress"
      | "done";

    // Calculate new order
    const destTasks = tasksByStatus[newStatus];
    const relevantTasks = destTasks.filter((t) => t._id !== draggableId);

    const prevTask = relevantTasks[destination.index - 1];
    const nextTask = relevantTasks[destination.index];

    let newOrder = 0;
    if (!prevTask && !nextTask) {
      newOrder = 1000;
    } else if (!prevTask) {
      newOrder = nextTask.order / 2;
    } else if (!nextTask) {
      newOrder = prevTask.order + 1000;
    } else {
      newOrder = (prevTask.order + nextTask.order) / 2;
    }

    // Optimistic update
    dispatch(
      moveTaskOptimistically({
        id: draggableId,
        status: newStatus,
        order: newOrder,
      }),
    );

    try {
      await dispatch(
        updateTaskStatus({
          id: draggableId,
          updates: { status: newStatus, order: newOrder },
        }),
      ).unwrap();
    } catch (err) {
      // Revert optimistic update
      const oldStatus = source.droppableId as "todo" | "in-progress" | "done";
      dispatch(moveTaskOptimistically({ id: draggableId, status: oldStatus }));
      console.error(err);
      toast.error("Failed to move task");
    }
  };

  if (status === "loading") {
    return <div className="text-center mt-10">Loading tasks...</div>;
  }

  if (status === "failed") {
    return <div className="text-center mt-10 text-red-500">Error: {error}</div>;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex flex-col md:flex-row overflow-x-auto pb-4 h-[calc(100vh-100px)]">
        <Column
          title="To Do"
          tasks={tasksByStatus.todo}
          statusColor="border-gray-400"
          droppableId="todo"
        />
        <Column
          title="In Progress"
          tasks={tasksByStatus["in-progress"]}
          statusColor="border-blue-400"
          droppableId="in-progress"
        />
        <Column
          title="Done"
          tasks={tasksByStatus.done}
          statusColor="border-green-400"
          droppableId="done"
        />
      </div>
    </DragDropContext>
  );
};

export default Board;
