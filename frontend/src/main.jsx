import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import About from "./pages/About"
import Login from "./pages/Login"
import Contact from "./pages/Contact"
import Admin from "./pages/Admin"
import ErrorPage from "./pages/ErrorPage"
import Navbar from './components/Navbar';
import Root from './Root';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <App />
      },
      {
        path: "admin",
        element: <Admin />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
    ],
  },
  // {
  //   path: "/admin",
  //   element: <Admin />,
  // },
  // {
  //   path: "/about",
  //   element: <About />,
  // },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider
    router={router}
  />,
)
