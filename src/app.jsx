import React, { StrictMode } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "@context/authContext";
import Timeline from "@pages/timeline/timeline";
import Home from "@pages/home/home";
import Settings from "@pages/settings/settings";
import Changelog from "@pages/changelog/changelog";
import EmailVerification from "@pages/email-verification/emailVerification";
import NotFound from "./notFound";
import Layout from "@layouts/layout";
import Toasts from "@components/toasts";
import { ToastProvider } from "./context/toastContext";
import Lists from "@pages/lists/lists";
import List from "@pages/lists/list";
import ListsLayout from "@layouts/listsLayout";
import GoogleCallback from "@pages/login/googleCallback";
import { SwipeProvider } from "./context/swipeContext";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import dayjs from "dayjs";
import ErrorBoundary from "./errorBoundary";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.extend(LocalizedFormat);

const router = createBrowserRouter([
  {
    Component: Layout,
    children: [
      { path: "/login/google/callback", Component: GoogleCallback },
      {
        path: "/email-verification/:token",
        Component: EmailVerification,
      },
      {
        path: "/lists",
        Component: ListsLayout,
        children: [
          { path: "", Component: Lists },
          { path: ":listName", Component: List },
        ],
      },
      { path: "/settings", Component: Settings },
      { path: "/timeline", Component: Timeline },
      { path: "/changelog", Component: Changelog },
      { path: "/", Component: Home },
      { path: "*", Component: NotFound },
    ],
  },
]);

export default function App() {
  return (
    <StrictMode>
      <ErrorBoundary>
        <ToastProvider>
          <AuthProvider>
            <SwipeProvider>
              <RouterProvider router={router} />
              <Toasts />
            </SwipeProvider>
          </AuthProvider>
        </ToastProvider>
      </ErrorBoundary>
    </StrictMode>
  );
}
