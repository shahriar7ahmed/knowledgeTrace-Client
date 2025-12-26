/* @refresh reset */
// src/router/Router.jsx
import React from "react";
import { createBrowserRouter } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import { ProjectProvider } from "../context/ProjectContext";
import { NotificationProvider } from "../context/NotificationContext";
import { ActivityProvider } from "../context/ActivityContext";
import { ToastProvider } from "../components/Toast";
import ErrorBoundary from "../components/ErrorBoundary";
import Layout from "../components/Layout";
import ProtectedRoute from "../components/ProtectedRoute";

import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard/Dashboard";
import Profile from "../pages/Profile/Profile";
import ThesisFinder from "../pages/ThesisFinder/ThesisFinder";
import MyWork from "../pages/MyWork/MyWork";
import ProjectDetails from "../pages/ProjectDetails/ProjectDetails";
import Admin from "../pages/Admin/Admin";
import NotFound from "../pages/NotFound/NotFound";
import UserProfile from "../pages/UserProfile/UserProfile";
import CollabHub from "../pages/CollabHub/CollabHub";

// Root component that wraps everything with providers
const Root = ({ children }) => {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <NotificationProvider>
            <ActivityProvider>
              {children}
            </ActivityProvider>
          </NotificationProvider>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
};

// Wrapper component factory to provide contexts
const createWrappedComponent = (Component, needsAuth = false, needsProjects = false, requireAdmin = false) => {
  return (props) => {
    let content = <Component {...props} />;

    if (needsProjects) {
      content = <ProjectProvider>{content}</ProjectProvider>;
    }

    // Wrap with ProtectedRoute if authentication is required
    if (needsAuth || requireAdmin) {
      content = (
        <ProtectedRoute requireAdmin={requireAdmin}>
          {content}
        </ProtectedRoute>
      );
    }

    return <Layout>{content}</Layout>;
  };
};

// Create wrapped components
const HomeWithProviders = createWrappedComponent(Home, false, true);
const LoginWithProviders = createWrappedComponent(Login, false, false);
const RegisterWithProviders = createWrappedComponent(Register, false, false);
const DashboardWithProviders = createWrappedComponent(Dashboard, true, true);
const ProfileWithProviders = createWrappedComponent(Profile, true, false);
const ThesisFinderWithProviders = createWrappedComponent(ThesisFinder, false, true);
const MyWorkWithProviders = createWrappedComponent(MyWork, true, true);
const ProjectDetailsWithProviders = createWrappedComponent(ProjectDetails, false, true);
const AdminWithProviders = createWrappedComponent(Admin, true, true, true); // requireAdmin = true
const UserProfileWithProviders = createWrappedComponent(UserProfile, false, true); // Public profile, no auth required
const CollabHubWithProviders = createWrappedComponent(CollabHub, false, false); // Public page

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Root>
        <HomeWithProviders />
      </Root>
    ),
  },
  {
    path: "/login",
    element: (
      <Root>
        <LoginWithProviders />
      </Root>
    ),
  },
  {
    path: "/register",
    element: (
      <Root>
        <RegisterWithProviders />
      </Root>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <Root>
        <DashboardWithProviders />
      </Root>
    ),
  },
  {
    path: "/profile",
    element: (
      <Root>
        <ProfileWithProviders />
      </Root>
    ),
  },
  {
    path: "/thesis-finder",
    element: (
      <Root>
        <ThesisFinderWithProviders />
      </Root>
    ),
  },
  {
    path: "/my-work",
    element: (
      <Root>
        <MyWorkWithProviders />
      </Root>
    ),
  },
  {
    path: "/project/:id",
    element: (
      <Root>
        <ProjectDetailsWithProviders />
      </Root>
    ),
  },
  {
    path: "/profile/:id",
    element: (
      <Root>
        <UserProfileWithProviders />
      </Root>
    ),
  },
  {
    path: "/collaborate",
    element: (
      <Root>
        <CollabHubWithProviders />
      </Root>
    ),
  },
  {
    path: "/admin",
    element: (
      <Root>
        <AdminWithProviders />
      </Root>
    ),
  },
  {
    path: "*",
    element: (
      <Root>
        <Layout>
          <NotFound />
        </Layout>
      </Root>
    ),
  },
]);

export default router;
