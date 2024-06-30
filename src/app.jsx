import { StrictMode } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Timeline from "@pages/timeline/timeline";
import Home from "@pages/home/home";
import Settings from "@pages/settings/settings";
import Changelog from "@pages/changelog/changelog";
import EmailVerification from "@pages/email-verification";
import NotFound from "./NotFound";
import { AuthProvider } from "@context/authContext";
import emailVerificationLoader from "@pages/email-verification/loader";
import Layout from "@layouts/layout";
import Toasts from "@components/toasts";
import { ToastProvider } from "./context/toastContext";
import Lists from "@pages/lists/lists";
import List from "@pages/lists/list";

const router = createBrowserRouter([
  {
    Component: Layout,
    children: [
      {
        path: "/email-verification/:token",
        loader: emailVerificationLoader,
        Component: EmailVerification,
      },
      { path: "/lists/:listName", Component: List },
      { path: "/lists", Component: Lists },
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
