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
  import { useEffect, useState } from "react";
  import { IoMdClose } from "react-icons/io";
  import { SlCalender } from "react-icons/sl";
  import DatePicker from "react-datepicker";
  import "react-datepicker/dist/react-datepicker.css";
  import { ITask, useTaskStore } from "../../stores/taskStore";
import { useForm } from "react-hook-form";
  
  // specifying the types of the props
  interface ITaskModal {
    isOpen: boolean,
    onClose: () => void,
    id:number|null|undefined,
    taskTitle:string,
    taskDescription:string,
    taskDate:Date,
    taskCompleted:boolean,
    taskImportance:boolean
  }
  
  const EditTaskModal: React.FC<ITaskModal> = ({ isOpen, onClose,id,taskTitle,taskDescription,taskDate,taskCompleted,taskImportance }): JSX.Element => {
    const [showCalendar, setShowCalendar] = useState(false);

    //To take the editTask function from the Zustand store created
    const {editTask} = useTaskStore() as {
      editTask:(newTask:ITask)=>void;
    }
    const [editedDate,setEditedDate]=useState(taskDate);
    // To use react hook form
    const {register,handleSubmit,getValues,setValue,clearErrors,formState:{errors}}=useForm<ITask>();

// The following useeffect sets the default values of react hook form to the ones received in the props
    useEffect(() => {
      setValue("title", taskTitle);
      setValue("description", taskDescription);
      setValue("date", taskDate);
      setValue("important", taskImportance);
      setValue("completed", taskCompleted);
    }, [isOpen]);

    // The function receives the onClose function as a prop from the parent component
    const handleClose = () => {
      onClose();
    };
    //This function acts as a toggle to open or close the calendar
    const handleCalendar = () => {
      setShowCalendar(!showCalendar);
    };
    //This function sets the chosen date and closes the calendar
    const handleChangeDate = (selectedDate: Date) => {
      setEditedDate(selectedDate);
      setShowCalendar(false);
    };

    //The following function handles the edit of tasks
    const handleEditTask = () => {
      setValue("date",editedDate);
      const {title,description,date,important,completed}=getValues();
      const newTask={
        id,
        title,
        date,
        description,
        important,
        completed
      }
      editTask(newTask);
      onClose();
      clearErrors();
    };
    const editFormSubmitHandler=()=>{
      handleEditTask();
    }
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
          Edit task
          <IconButton onClick={handleClose}>
            <IoMdClose />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(editFormSubmitHandler)}>
            {/* The input for the task title */}
            <Box display={"flex"}>
              <InputLabel required htmlFor="task-title" sx={{ marginBottom: "10px" }}>
                Task Title
              </InputLabel>
              {errors.title && (
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
              {...register("title",{required:"Title cannot be empty"})}
            />
            <InputLabel htmlFor="text-field" sx={{ marginBottom: "10px" }}>
              Date
            </InputLabel>
            {/* The input for the task date */}
            <DatePicker
              minDate={new Date()}
              selected={editedDate}
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
              <InputLabel required htmlFor="description" sx={{ marginBottom: "10px" }}>
                Description
              </InputLabel>
              {errors.description && (
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
              {...register("description",{required:"Description cannot be empty"})}
              multiline
            />
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                  color="info"
                  {...register("important")}
                  />
                }
                label="Mark as Important"
              />
              <FormControlLabel
                control={
                  <Checkbox
                  color="info"
                    {...register("completed")}
                  />
                }
                label="Mark as completed"
              />
            </FormGroup>
            <Button
              variant="contained"
              color="info"
              fullWidth
              type="submit"
            >
              Edit Task
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    );
  };
  
  export default EditTaskModal;