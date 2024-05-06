import { Box } from "@mui/material";
import TaskBox from "../../components/TaskBox";
import { ITask, useTaskStore } from "../../stores/taskStore";
import { useSearchStore } from "../../stores/searchStore";
import { useSortStore } from "../../stores/sortStore";

const TodayTasks: React.FC = (): JSX.Element => {
  const { tasks } = useTaskStore() as { tasks: ITask[] }
  const currentDate = new Date();
  const {query}=useSearchStore() as {query: string}
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
  // For future reference: To compare to date objects, one way is to convert both to strings using toISOString()
  // method, then splitting the string at 'T' so only the date remains
  const currentDateString = currentDate.toISOString().split("T")[0];

  return (
    <Box display={"flex"} flexWrap={"wrap"}>
      {tasks &&
        taskSorter(tasks)
          .filter((task) => {
            const taskDate = new Date(task.date);
            // Extracting date part from task date without time
            const taskDateString = taskDate.toISOString().split("T")[0];
            // Comparing only the date part
            return taskDateString === currentDateString;
            // Implementing the search functionality: The following filter checks if the title or the description includes the search query
            // This is how you implement the search functionality into the component.
            // Note that the filter method works like this: If it returns true, the array element will be returned
          }).filter((task)=>{
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

export default TodayTasks;
