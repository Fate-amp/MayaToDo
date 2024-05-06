import TaskBox from "../../components/TaskBox";
import { useSearchStore } from "../../stores/searchStore";
import { useSortStore } from "../../stores/sortStore";
import { ITask, useTaskStore } from "../../stores/taskStore";
import { Box } from "@mui/material";

const AllTasks: React.FC = (): JSX.Element => {
  const { tasks } = useTaskStore() as {tasks: ITask[]}
  const {query}=useSearchStore() as {query: string}
  const {sortValue}=useSortStore() as {sortValue:string}

  // For later reference: I have implemented the following to sort tasks based on different keywords:
  // 1. I created a Zustand store to receive the sort value and to set it globally. The sort value
  // is received through Material UI's FormControl, Select and MenuItem components in the Layout component
  // 2. In each page, the sortValue is received and the tasks are sorted if it exists. The following function
  // handles the sorting
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
  //Note on the sort method:
  // a is the first value. b the second to compare between. If a-b>0, a goes after b. If a-b<0, a goes before
  // b. If a-b=0, they stay in the same places
  // Newest First(same logic for oldest first): Remember! To compare two dates, you should use the getTime method. If the expression comes
  // out negative, the order will be decreasing. So we use b-a 
  return (
    <Box display={"flex"} flexWrap={"wrap"}>
      {tasks &&
        taskSorter(tasks).filter((task:ITask)=>{
          if(query){
            return task.description.includes(query) || task.title.includes(query)
          }else{
            return true
          }
        }).map((task:ITask) => (
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

export default AllTasks;
