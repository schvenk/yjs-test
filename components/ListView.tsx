"use client";

import { FC, useCallback, useEffect, useRef, useState } from "react";
import * as Y from "yjs";
import { Button } from "./ui/button";
import { PlusIcon } from "lucide-react";
import TaskView from "./TaskView";
import TiptapCollabProvider from "@tiptap-pro/provider";
import { Empty, EmptyContent } from "./ui/empty";

interface ListViewProps {
  jwt: string;
  appId: string;
}

const ListView: FC<ListViewProps> = ({ jwt, appId }) => {
  const [tasks, setTasks] = useState<Y.Map<string | boolean>[]>([]);
  const yRef = useRef<Y.Doc>(new Y.Doc());

  useEffect(() => {
    new TiptapCollabProvider({
      name: "default",
      appId,
      token: jwt,
      document: yRef.current,
      user: "everybody",
    });

    const ylist = yRef.current.getArray("tasks");
    ylist.observe(() => {
      console.log("tasks changed", ylist.toJSON());
      setTasks(ylist.toArray() as Y.Map<string | boolean>[]);
    });
  }, [appId, jwt]);

  const createTask = useCallback(() => {
    const t = new Y.Map<string | boolean>();
    t.set("id", crypto.randomUUID());
    t.set("name", "Untitled Task");
    t.set("isCompleted", false);
    yRef.current.getArray("tasks").push([t]);
  }, []);

  const deleteTask = useCallback((index: number) => {
    yRef.current.getArray("tasks").delete(index, 1);
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="w-full">
          <h1 className="text-3xl font-bold mb-8 text-zinc-900 dark:text-zinc-100 flex flex-row">
            <span className="flex-1">Tasks</span>
            <Button onClick={createTask}>
              <PlusIcon className="size-4" />
              <span>New Task</span>
            </Button>
          </h1>
          <div className="space-y-4">
            {tasks.length === 0 ? (
              <Empty>
                <EmptyContent className="text-base text-black/40">No tasks yet</EmptyContent>
              </Empty>
            ) : (
              tasks.map((task, idx) => <TaskView key={idx} task={task} onDelete={() => deleteTask(idx)} />)
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ListView;
