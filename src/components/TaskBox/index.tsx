import { Box, Button, Typography } from "@mui/material";
import { ITask, useTaskStore } from "../../stores/taskStore";
import { FaRegStar } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { SlCalender } from "react-icons/sl";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useState } from "react";
import EditTaskModal from "../EditTaskModal";
const TaskBox: React.FC<ITask> = ({
  id,
  title,
  description,
  date,
  completed,
  important,
}): JSX.Element => {
  const { toggleImportance, toggleComplete, removeTask } = useTaskStore() as {
    toggleImportance: (taskId: number) => void;
    toggleComplete: (taskId: number) => void;
    removeTask: (taskId: number) => void;
  };
  const [modal, setModal] = useState(false);
  // The following function toggles the completed button to uncompleted and vice versa
  const onChangeCompleted = () => {
    toggleComplete(id as number);
  };
  // The following function toggles the importance of the task
  const onChangeImportance = () => {
    toggleImportance(id as number);
  };
  // The following function removes the task from the task list
  const handleRemoveTask = () => {
    removeTask(id as number);
  };
  // The following function closes the modal
  const handleCloseModal = () => {
    setModal(false);
  };
  return (
    <Box
      sx={{ position: "relative" }}
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"space-between"}
      height={"230px"}
      width={"25%"}
      marginRight={"20px"}
      marginBottom={"20px"}
      bgcolor={"info.main"}
      borderRadius={"16px"}
      padding={"16px"}
    >
      <Box>
        <Typography variant="h6" fontWeight={"500"} color={"white"}>
          {title}
        </Typography>
        <Box
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"space-between"}
        >
          <Box height={"95px"}>
            <Typography
              color={"white"}
              fontWeight={"200"}
              sx={{ opacity: "0.6" }}
            >
              {description}
            </Typography>
          </Box>
          <Box
            display={"flex"}
            alignItems={"center"}
            color={"white"}
            height={"30px"}
          >
            <SlCalender fill="white" />{" "}
            {/* To extract the date from the full date object, you need to first convert the date string to
        a date object like this. Otherwise you wouldn't be able to extract the year,month and day
        using getFullYear methods etc. */}
            <Typography
              marginLeft={"10px"}
              fontSize={"13px"}
              fontWeight={"400"}
              sx={{ opacity: "0.8" }}
            >
              {date &&
                `${new Date(date).getDate()}/${
                  new Date(date).getMonth() + 1
                }/${new Date(date).getFullYear()}`}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box
        height={"40px"}
        borderColor={"white"}
        sx={{ borderTop: "1px white dashed" }}
        color={"white"}
        display={"flex"}
        paddingTop={"5px"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        {completed ? (
          <Button
            sx={{
              bgcolor: "rgb(167 243 208)",
              color: "rgb(6 95 70)",
              borderRadius: "10px",
              height: "30px",
              minWidth: "auto",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "rgb(167 243 208)",
              },
            }}
            onClick={onChangeCompleted}
          >
            Completed
          </Button>
        ) : (
          <Button
            sx={{
              bgcolor: "rgb(253 230 138)",
              color: "rgb(146 64 14)",
              borderRadius: "10px",
              height: "30px",
              minWidth: "auto",
              textTransform: "none",
              // Note! I used the following line to disable the hover effect of the button
              "&:hover": {
                backgroundColor: "rgb(253 230 138)",
              },
            }}
            onClick={onChangeCompleted}
          >
            Uncompleted
          </Button>
        )}
        <Box display={"flex"}>
          {important ? (
            <Button sx={{ minWidth: "25px" }} onClick={onChangeImportance}>
              {/* Use the prop "size" to change the size of react icons and "fill" to change their color */}
              <FaStar fill="yellow" size={"23"} />
            </Button>
          ) : (
            <Button sx={{ minWidth: "25px" }} onClick={onChangeImportance}>
              <FaRegStar fill="yellow" size={"23"} />
            </Button>
          )}
          <Button sx={{ minWidth: "25px" }} onClick={handleRemoveTask}>
            <RiDeleteBin5Fill fill="red" fillOpacity={"0.75"} size={23} />
          </Button>
          <Button onClick={() => setModal(true)} sx={{ minWidth: "25px" }}>
            <BsThreeDotsVertical fill="white" size={23} />
          </Button>
        </Box>
      </Box>
      <EditTaskModal
        id={id}
        taskTitle={title}
        taskDescription={description}
        taskDate={new Date(date)}
        taskCompleted={completed}
        taskImportance={important}
        isOpen={modal}
        onClose={handleCloseModal}
      />
    </Box>
  );
};

export default TaskBox;
