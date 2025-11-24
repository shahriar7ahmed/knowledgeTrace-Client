// src/router/Router.jsx
import React from "react";
import { createBrowserRouter } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import { ProjectProvider } from "../context/ProjectContext";
import Layout from "../components/Layout";

import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard/Dashboard";
import Profile from "../pages/Profile/Profile";
import ThesisFinder from "../pages/ThesisFinder/ThesisFinder";
import MyWork from "../pages/MyWork/MyWork";
import ProjectDetails from "../pages/ProjectDetails/ProjectDetails";
import Admin from "../pages/Admin/Admin";

// Wrapper component factory to provide contexts
const createWrappedComponent = (Component, needsAuth = false, needsProjects = false) => {
  return (props) => {
    let content = <Component {...props} />;
    
    if (needsProjects) {
      content = <ProjectProvider>{content}</ProjectProvider>;
    }
    
    if (needsAuth) {
      content = <AuthProvider>{content}</AuthProvider>;
    }
    
    return <Layout>{content}</Layout>;
  };
};

// Create wrapped components
const HomeWithProviders = createWrappedComponent(Home, false, true);
const LoginWithProviders = createWrappedComponent(Login, true, false);
const RegisterWithProviders = createWrappedComponent(Register, true, false);
const DashboardWithProviders = createWrappedComponent(Dashboard, true, true);
const ProfileWithProviders = createWrappedComponent(Profile, true, false);
const ThesisFinderWithProviders = createWrappedComponent(ThesisFinder, false, true);
const MyWorkWithProviders = createWrappedComponent(MyWork, true, true);
const ProjectDetailsWithProviders = createWrappedComponent(ProjectDetails, false, true);
const AdminWithProviders = createWrappedComponent(Admin, true, true);

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeWithProviders />,
  },
  {
    path: "/login",
    element: <LoginWithProviders />,
  },
  {
    path: "/dashboard",
    element: <DashboardWithProviders />,
  },
  {
    path: "/profile",
    element: <ProfileWithProviders />,
  },
  {
    path: "/thesis-finder",
    element: <ThesisFinderWithProviders />,
  },
  {
    path: "/my-work",
    element: <MyWorkWithProviders />,
  },
  {
    path: "/project/:id",
    element: <ProjectDetailsWithProviders />,
  },
  {
    path: "/admin",
    element: <AdminWithProviders />,
  },
  {
    path: "/register",
    element: <RegisterWithProviders />,
  },
]);

export default router;
