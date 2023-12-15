import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Header from "./routes/Header";
import ErrorPage from "./error-page";
import Users from "./routes/Users";
import Home from "./routes/Home";
import Rooms from "./routes/Rooms";
import {ThemeProvider} from "./bricks/ThemeProvider";
import Calendar from "./routes/Calendar";

const router = createBrowserRouter([
  {
    element: <Header />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
        index: true,
      },
      {
        path: "/users",
        element: <Users />,
      },
      {
        path: "/rooms",
        element: <Rooms />,
      },
      {
        path: "/scheduler",
        element: <Calendar />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
    <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);
