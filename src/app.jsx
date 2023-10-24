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

const router = createBrowserRouter([
  {
    Component: Layout,
    children: [
      {
        path: "/email-verification/:token",
        loader: emailVerificationLoader,
        Component: EmailVerification,
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
      <AuthProvider>
        <ToastProvider>
          <RouterProvider router={router} />
          <Toasts />
        </ToastProvider>
      </AuthProvider>
    </StrictMode>
  );
}
