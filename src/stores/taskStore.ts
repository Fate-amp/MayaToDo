import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface ITask {
  id?: null | number;
  title: string;
  description: string;
  date: number | Date | string;
  completed: boolean;
  important: boolean;
}
interface ITaskStore {
  tasks: ITask[];
  addTask: (task: ITask) => void;
  toggleImportance: (taskId: number) => void;
  toggleComplete: (taskId: number) => void;
  removeTask: (taskId: number) => void;
  editTask:(task:ITask)=>void;
}
export const useTaskStore = create(
  persist(
    (set) => ({
      tasks: [],
      //Note: The following line is a function which takes the task(which we pass to it in the component) and uses the set function of Zustand.
      //Let's break the set function down: It takes the state as a parameter. () is used because this is
      //returning sth. {} because we are updating the state, specifically, the tasks in the state.
      //we then take the current tasks array and add the new task to it.
      addTask: (task: ITask) =>
        set((state: ITaskStore) => ({ tasks: [...state.tasks, task] })),
      toggleImportance: (taskId: number) =>
        set((state: ITaskStore) => ({
          tasks: state.tasks.map((task: ITask) =>
            task.id === taskId ? { ...task, important: !task.important } : task
          ),
        })),
      toggleComplete: (taskId: number) =>
        set((state: ITaskStore) => ({
          tasks: state.tasks.map((task: ITask) =>
            task.id === taskId ? { ...task, completed: !task.completed } : task
          ),
        })),
      removeTask: (taskId: number) =>
        set((state: ITaskStore) => ({
          tasks: state.tasks.filter((task) => task.id !== taskId),
        })),
        editTask: (editedTask: ITask) =>
          set((state: ITaskStore) => ({
            tasks: state.tasks.map((task: ITask) =>
              task.id === editedTask.id ? editedTask : task
            ),
          })),
    }),
    {
      name: "taskStore",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Note! In order to update the state in Zustand, you must define a new tasks array using
// state.tasks (look at the code above)
// Notice that the following code won't work
//  toggleImportance: (taskId: number) =>
// set((state) => ({
//   state.tasks.map((task) =>
//   task.id === taskId ? { ...task, important: !task.important } : task
//   ),
// }))
