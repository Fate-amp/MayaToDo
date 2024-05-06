import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  IconButton,
  InputAdornment,
  InputLabel,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { SlCalender } from "react-icons/sl";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ITask, useTaskStore } from "../../stores/taskStore";
import { useForm } from "react-hook-form";

// specifying the types of the props
interface ITaskModal {
  isOpen: boolean;
  onClose: () => void;
}
const TaskModal: React.FC<ITaskModal> = ({ isOpen, onClose }): JSX.Element => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [date, setDate] = useState(new Date());

  //To take the addTask function from the Zustand store created
  const { addTask } = useTaskStore() as {
    addTask: (newTask: ITask) => void;
  };
  //Note on react hook form and how to use it(for future reference):
  // Steps to use it:
  // 1. Get the relevant methods by destructing the object received by react hook form. register, handleSubmit
  // and formState:{errors} are the essential ones. Others are optional. 1/Register is used to handle the state of
  // form values. We use this to control the changes made to form fields instead of using useState() 2/handleSubmit
  // must be added to <form> to handle the submission. Wahtever function you use, must be wrapped inside this
  // handleSubmit
  // 2.There must be a button of type "submit" at the end of the form. No function should be passed to the button
  // directly!
  // 3. You can specify if the field is required and the message if it's not field like it is shown below
  // 4. You should display the errors like it is shown below
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm();

  // The function receives the onClose function as a prop from the parent component
  const handleClose = () => {
    onClose();
  };
  //This function acts as a toggle to open or close the calendar
  const handleCalendar = () => {
    setShowCalendar(!showCalendar);
  };
  // This function sets the chosen date and closes the calendar
  const handleChangeDate = (selectedDate: Date) => {
    setDate(selectedDate);
    setShowCalendar(false);
  };

  //The following function handles the addition of tasks
  const handleAddTask = () => {
    // Retrieve form data
    const { title, description, important, completed } = getValues();

    // Create a new task object
    const newTask: ITask = {
      id: Math.floor(Math.random() * 10000) + 1,
      title: title,
      description: description,
      date: date,
      important: important || false,
      completed: completed || false,
    };

    // Add the new task
    addTask(newTask);

    // Close the modal
    onClose();

    // Reset the form values when the form is closed
    setValue("title", "");
    setValue("description", "");
    setValue("important", false);
    setValue("completed", false);
    setDate(new Date());

    // Clear the errors when the form is closed
    clearErrors();
  };

  const submitHandler = () => {
    handleAddTask();
  };
  return (
    <Dialog
      open={isOpen}
      fullWidth
      className="custom-dialog"
      sx={{ height: "100%" }}
    >
      <DialogTitle
        display={"flex"}
        justifyContent={"space-between"}
        fontSize={28}
      >
        Add a task
        <IconButton onClick={handleClose}>
          <IoMdClose />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(submitHandler)}>
          {/* The input for the task title */}
          <Box display={"flex"}>
            <InputLabel
              required
              htmlFor="task-title"
              sx={{ marginBottom: "10px" }}
            >
              Task Title
            </InputLabel>
            {errors.title && typeof errors.title.message === "string" && (
              <Typography marginLeft={"10px"} color={"error"}>
                {errors.title.message}
              </Typography>
            )}
          </Box>
          <TextField
            id="task-title"
            size="small"
            fullWidth
            sx={{ marginBottom: "16px" }}
            {...register("title", { required: "Please enter a title" })}
          />
          <InputLabel htmlFor="text-field" sx={{ marginBottom: "10px" }}>
            Date
          </InputLabel>
          {/* The input for the task date */}
          <DatePicker
            minDate={new Date()}
            selected={date}
            onChange={handleChangeDate}
            customInput={
              <TextField
                size="small"
                placeholder="dd/mm/yyyy"
                {...register("date")}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <SlCalender onClick={handleCalendar} />
                    </InputAdornment>
                  ),
                }}
                sx={{ marginBottom: "16px", width: "100%" }}
                inputProps={{
                  placeholder: "dd/mm/yyyy",
                }}
              />
            }
          />
          <Box display={"flex"}>
            <InputLabel
              required
              htmlFor="description"
              sx={{ marginBottom: "10px" }}
            >
              Description(optional)
            </InputLabel>
            {errors.description && typeof errors.description.message === "string" && (
              <Typography marginLeft={"10px"} color={"error"}>
                {errors.description.message}
              </Typography>
            )}
          </Box>
          {/* The input for the task description */}
          <TextField
            id="description"
            fullWidth
            size="medium"
            placeholder="e.g. study for the test"
            {...register("description", {
              required: "Please enter the task description",
            })}
            multiline
          />
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  color="info"
                  {...register("important")}
                  name="important"
                />
              }
              label="Mark as Important"
            />
            <FormControlLabel
              control={
                <Checkbox
                  color="info"
                  {...register("completed")}
                  name="completed"
                />
              }
              label="Mark as completed"
            />
          </FormGroup>
          <Button variant="contained" color="info" fullWidth type="submit">
            Add a Task
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskModal;
