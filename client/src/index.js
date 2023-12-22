import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Header from "./routes/Header";
import ErrorPage from "./error-page";
import Users from "./routes/Users";
import Home from "./routes/Home";
import Rooms from "./routes/Rooms";
import {ThemeProvider} from "./bricks/ThemeProvider";
import Reservations from "./routes/Reservations";
import { ThemeProvider } from "./bricks/ThemeProvider";
import AuditLog from "./routes/AuditLog";

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
        path: "/auditLog",
        element: <AuditLog />,
      },
        {
            path: "/reservations",
            element: <Reservations/>,
        },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <ThemeProvider>
            <RouterProvider router={router}/>
        </ThemeProvider>
    </React.StrictMode>
);
