import { createBrowserRouter } from "react-router-dom";
import Layout from "../Layout";
import AllTasks from "../pages/AllTasks";
import TodayTasks from "../pages/TodayTasks";
import ImportantTasks from "../pages/ImportantTasks";
import CompletedTasks from "../pages/CompletedTasks";
import UncompletedTasks from "../pages/UncompletedTasks";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <AllTasks /> },
      { path: "today", element: <TodayTasks /> },
      { path: "important", element: <ImportantTasks /> },
      { path: "completed", element: <CompletedTasks /> },
      { path: "uncompleted", element: <UncompletedTasks /> },
    ],
  },
]);
