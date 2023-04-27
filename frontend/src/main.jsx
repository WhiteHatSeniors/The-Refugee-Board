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
import CampDashboard from "./pages/CampDashboard"
import ErrorPage from "./pages/ErrorPage"
import Navbar from './components/Navbar';
import CreateEntry from './pages/CreateEntry';
import Root from './Root';
import RootWrapper from './RootWrapper';
import Signup from "./pages/Signup"
import EditEntry from './pages/EditEntry';
import EditProfile from './pages/EditProfile';
import ChangePw from './pages/ChangePw';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
// import { AuthContextProvider } from './Hooks/AuthContext';


const router = createBrowserRouter([
  {
    path: "/",
    element: <RootWrapper />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <App />
      },
      {
        path: "camp-dashboard",
        element: <CampDashboard />,
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
        path: "signup",
        element: <Signup />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
      {
        path: "create-entry",
        element: <CreateEntry />,
      }, {
        path: "edit-entry/:id",
        element: <EditEntry />,
      }, {
        path: "edit-profile",
        element: <EditProfile />
      }, {
        path: "change-password",
        element: <ChangePw />
      }
      , {
        path: "forgot-password",
        element: <ForgotPassword />
      }
      , {
        path: "reset-password/:id",
        element: <ResetPassword />
      }
    ],
  },
  {
    path: "/admin-dashboard",
    element: <AdminDashboard />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/admin-login",
    element: <AdminLogin />,
    errorElement: <ErrorPage />,
  }

]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider
    router={router}
  />
)
