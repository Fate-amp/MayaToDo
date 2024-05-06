import { Box } from "@mui/material";
import TaskBox from "../../components/TaskBox";
import { ITask, useTaskStore } from "../../stores/taskStore";
import { useSearchStore } from "../../stores/searchStore";
import { useSortStore } from "../../stores/sortStore";

const UncompletedTasks: React.FC = (): JSX.Element => {
  const { tasks } = useTaskStore() as { tasks: ITask[] };
  const {query}=useSearchStore() as { query: string }
  const {sortValue}=useSortStore() as {sortValue:string}
  
  const taskSorter=(tasks:ITask[])=>{
    switch (sortValue) {
      case "newestFirst":
        return [...tasks].sort((a,b)=>new Date(b.date).getTime()-new Date(a.date).getTime())
        break;
      case "oldestFirst":
        return [...tasks].sort((a,b)=>new Date(a.date).getTime()-new Date(b.date).getTime())
        break;
      case "completedFirst":
        return [...tasks].sort((a,b)=>a.completed===b.completed?0:a.completed?-1:1)
        break;
      case "uncompletedFirst":
        return [...tasks].sort((a,b)=>a.completed===b.completed?0:a.completed?1:-1)
        break;

      default:
        return tasks
        break;
    }
  }
  return (
    <Box display={"flex"} flexWrap={"wrap"}>
      {tasks &&
        taskSorter(tasks)
          .filter((task) => !task.completed)
          .filter((task)=>{
            if(query){
              return task.description.includes(query) || task.title.includes(query)
            }else{
              return true
            }
          })
          .map((task) => (
            <TaskBox
              key={task.id}
              id={task.id}
              title={task.title}
              description={task.description}
              date={task.date}
              completed={task.completed}
              important={task.important}
            />
          ))}
    </Box>
  );
};

export default UncompletedTasks;
