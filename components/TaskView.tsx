"use client";

import { FC, useEffect, useState } from "react";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import * as Y from "yjs";

type TaskMap = Y.Map<string | boolean>;

interface Task {
  id: string;
  name: string;
  isCompleted: boolean;
}

interface TaskViewProps {
  task: TaskMap;
  onDelete?: () => void;
}

const TaskView: FC<TaskViewProps> = ({ task: map, onDelete }) => {
  const [task, setTask] = useState<Task>(map.toJSON() as Task);

  useEffect(() => {
    console.log("observing");
    map.observe(() => {
      console.log("task changed", map.toJSON());
      setTask(map.toJSON() as Task);
    });
  }, [map]);

  const handleUpdate = (key: string, value: string | boolean) => {
    map.set(key, value);
  };

  return (
    <div className="flex items-center gap-2">
      <Checkbox checked={task.isCompleted} onCheckedChange={() => handleUpdate("isCompleted", !task.isCompleted)} />
      <Input
        value={task.name}
        onChange={(e) => handleUpdate("name", e.target.value)}
        onClick={(e) => e.currentTarget.select()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === "Escape") {
            e.currentTarget.blur();
          }
        }}
        className="text-base h-auto py-1 border-transparent shadow-none hover:bg-muted/50 cursor-text focus:border-input focus:shadow-sm flex-1"
      />
      {onDelete && (
        <Button variant="ghost" size="icon-sm" onClick={onDelete} className="shrink-0">
          <Trash2 className="size-4" />
        </Button>
      )}
    </div>
  );
};

export default TaskView;
