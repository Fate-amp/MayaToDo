import {
  Box,
  Button,
  createTheme,
  CssBaseline,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  LinearProgress,
  List,
  ListItem,
  MenuItem,
  Select,
  SelectChangeEvent,
  Switch,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { Outlet, Link, useLocation } from "react-router-dom";
import TaskModal from "../components/TaskModal";
import { useSearchStore } from "../stores/searchStore";
import { useSortStore } from "../stores/sortStore";
import { ITask, useTaskStore } from "../stores/taskStore";

// The list of month names to be later used in the date display
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

//Note! To create dark mode in mui, you should start by using the createTheme function from mui
//Note that the words "palette", "primary","secondary" and "info" are reserved words in mui
//If you use anything else, the theme will not work
// These colors will apply anywhere the words "primary", "secondary" and "info" are mentioned as colors
//of components, not anywhere else
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "rgb(21, 26, 38)",
    },
    secondary: {
      main: "rgb(27, 39, 65)",
    },
    info: {
      main: "#1976d2",
    },
  },
});

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "rgb(221, 226, 233)",
    },
    secondary: {
      main: "rgb(241, 245, 249)",
    },
    info: {
      main: "#1976d2",
    },
  },
});

const Layout: React.FC = (): JSX.Element => {
  const [modal, setModal] = useState(false);
  const [date, setDate] = useState("");
  const location = useLocation();
  const { query, setQuery } = useSearchStore() as {
    query: string;
    setQuery: (query: string) => void;
  };
  const { sortValue, setSortValue } = useSortStore() as {
    sortValue: string;
    setSortValue: (sortValue: string) => void;
  };
  const [darkmode, setDarkmode] = useState(false);
  // To handle the progress bar of all tasks and today's tasks:
  const [generalProgress,setGeneralProgress]=useState<number>();
  const [todayProgress,setTodayprogress]=useState<number>();

  // To access the tasks
  const {tasks}=useTaskStore() as {tasks:ITask[]}
  // The following function receives the date to be displayed later
  useEffect(() => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = monthNames[currentDate.getMonth()];
    const day = currentDate.getDate();
    const date = `${year} ${month} ${day}`;
    setDate(date);
// To calculate the percentage of completed tasks, we filter through the tasks(filter creates a new array)
// And then calculate the length of the list
    const completedPercent=(tasks.filter((task)=>task.completed).length)*100/tasks.length
    setGeneralProgress(completedPercent);
// To calculate the number of tasks for today
const currentDateString = currentDate.toISOString().split("T")[0];
    const todayTasks=tasks.filter((task) => {
      const taskDate = new Date(task.date);
      const taskDateString = taskDate.toISOString().split("T")[0];
      return taskDateString === currentDateString;
    })
    const todayPercent=(todayTasks.filter((task)=>task.completed).length)*100/todayTasks.length
    setTodayprogress(todayPercent);
  }, [tasks]);
  const handleCloseModal = () => {
    setModal(false);
  };
  // Following is the function to handle the search bar
  //Note! To deal with the typescript error of a change event, use :React.ChangeEvent<HTMLInputElement>
  const handleSearchbar = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value;
    setQuery(searchValue);
  };
  // The following function handles the toggle of the dark mode switch
  const toggleSwitchHandler = () => {
    setDarkmode(!darkmode);
  };
  const handleSort = (event: SelectChangeEvent<string>) => {
    setSortValue(event.target.value);
  };  
  return (
    //About the dark theme: You should wrap everything inside a ThemeProvider component and a
    //self-closing CssBaseline component, and then everything else
    <ThemeProvider theme={darkmode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Box display={"flex"} position={"relative"}>
        {/* Here goes the left sidebar using the MaterialUI box component */}
        {/* Use the minHeight property when you are not sure how much the nheight will be. If
        you do not do this, there will be white space at the bottom when the page scrolls */}
        <Box padding={2} width={210} minHeight="100vh" bgcolor="secondary.main">
          <List>
            <Typography
              variant="h4"
              mb={4}
              mt={2}
              fontSize={18}
              textAlign={"center"}
              fontWeight={700}
            >
              TO-DO LIST
            </Typography>
            <Button
              variant="contained"
              color="info"
              size="large"
              sx={{
                height: "48px",
                width: "100%",
                marginBottom: "16px",
                borderRadius: "8px",
                fontSize: "13px",
              }}
              onClick={() => setModal(true)}
            >
              Add new Task
            </Button>
            <ListItem sx={{ marginBottom: "16px" }}>
              <Link
                to="/today"
                color={"inherit"}
                style={{ textDecoration: "none" }}
                className="linkHover"
              >
                Today's Tasks
              </Link>
            </ListItem>
            <ListItem sx={{ marginBottom: "16px" }}>
              <Link
                to="/"
                color={"inherit"}
                style={{ textDecoration: "none" }}
                className="linkHover"
              >
                All Tasks
              </Link>
            </ListItem>
            <ListItem sx={{ marginBottom: "16px" }}>
              <Link
                to="/important"
                color={"inherit"}
                style={{ textDecoration: "none" }}
                className="linkHover"
              >
                Important Tasks
              </Link>
            </ListItem>
            <ListItem sx={{ marginBottom: "16px" }}>
              <Link
                to="/completed"
                color={"inherit"}
                style={{ textDecoration: "none" }}
                className="linkHover"
              >
                Completed Tasks
              </Link>
            </ListItem>
            <ListItem sx={{ marginBottom: "16px" }}>
              <Link
                to="/uncompleted"
                color={"inherit"}
                style={{ textDecoration: "none" }}
                className="linkHover"
              >
                Uncompleted Tasks
              </Link>
            </ListItem>
          </List>
        </Box>
        {/* Here goes the main content */}
        <Box
          bgcolor="primary.main"
          width={"70%"}
          padding={3}
          display={"flex"}
          flexDirection={"column"}
          // Note! Important! The follwoing line makes the main content take up as much space as needed
          // This prevents white spaces between the side bars and the main content
          flexGrow={1}
          minWidth={0}
        >
          {/* Here goes the heading */}
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
            mb={3}
          >
            <TextField
              id="outlined-basic"
              label="Search Task"
              variant="outlined"
              size="medium"
              value={query}
              onChange={handleSearchbar}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton>
                      <CiSearch />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {date && <Typography>{date}</Typography>}
            <Box>
              <Button
                variant="contained"
                color="info"
                size="large"
                sx={{
                  height: "48px",
                  width: "100%",
                  marginBottom: "16px",
                  borderRadius: "8px",
                  fontSize: "13px",
                }}
                onClick={() => setModal(true)}
              >
                Add new Task
              </Button>
            </Box>
          </Box>
          <TaskModal isOpen={modal} onClose={handleCloseModal} />
          <Box>
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              marginBottom={"20px"}
            >
              <Typography variant="h4" marginBottom={"16px"}>
                {/* Note! Beware to use the location.pathname! location alone will not work to retrieve the path! */}
                {location.pathname === "/"
                  ? "All Tasks"
                  : location.pathname === "/today"
                  ? "Today's Tasks"
                  : location.pathname === "/important"
                  ? "Important Tasks"
                  : location.pathname === "/completed"
                  ? "Completed Tasks"
                  : location.pathname === "/uncompleted"
                  ? "Uncompleted Tasks"
                  : ""}
              </Typography>
              {/* Here goes the sorting component */}
              <FormControl sx={{ m: 1, minWidth: 170 }} color="info">
                {/* The input label is shown only when a sort value has not been chosen */}
              {!sortValue && (
        <InputLabel
          id="sort-by"
          sx={{
            transition: "transform 0.3s",
            "&.Mui-focused": {
              transform: "translateY(-20px)",
            },
          }}
        >
          Sort By
        </InputLabel>
      )}
                <Select
                  value={sortValue}
                  onChange={handleSort}
                  labelId="sort-by"
                >
                  <MenuItem value={"newestFirst"}>Newest First</MenuItem>
                  <MenuItem value={"oldestFirst"}>Oldest First</MenuItem>
                  <MenuItem value={"completedFirst"}>Completed First</MenuItem>
                  <MenuItem value={"uncompletedFirst"}>
                    Uncompleted First
                  </MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Outlet />
          </Box>
        </Box>
        {/* Here goes the right sidebar */}
        <Box padding={2} width={210} minHeight="100vh" bgcolor="secondary.main">
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            mt={4}
          >
            <Typography>Dark Mode</Typography>
            {/* To control the darkmode state, the following switch component from mui is used */}
            <Switch
              color="info"
              checked={darkmode}
              onChange={toggleSwitchHandler}
            />
          </Box>
          <Box mt={4} display={"flex"} flexDirection={"column"}>
            <Typography marginBottom={"15px"}>All Tasks: {tasks.length} Tasks</Typography>
            {/* For future reference: This is how you make a progress bar using MUI
            use the LinearProgress component and pass to it the percentage you like
            Be sure to create a state for that percentage if it's going to change
            And be sure to calculate the percentage in useEffect so it will change whenever
            a change happens.
            */}
            <LinearProgress variant="determinate" color="info" value={generalProgress} /> 
            <Typography marginBottom={"15px"} marginTop={"15px"}>Today's Tasks</Typography>
            <LinearProgress variant="determinate" color="info" value={todayProgress} />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Layout;
