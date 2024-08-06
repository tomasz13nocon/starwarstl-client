import { StrictMode } from "react";
import { createBrowserRouter, RouterProvider, defer } from "react-router-dom";
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
      <ToastProvider>
        <AuthProvider>
          <RouterProvider router={router} />
          <Toasts />
        </AuthProvider>
      </ToastProvider>
    </StrictMode>
  );
}
