import { StrictMode } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Timeline from "@pages/timeline/timeline";
import Home from "@pages/home/home";
import EmailVerification from "@pages/email-verification";
import Settings from "@pages/settings";
import NotFound from "./NotFound";
import { AuthProvider } from "@context/authContext";
import emailVerificationLoader from "@pages/email-verification/loader";
import Layout from "@layouts/layout";

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
      { path: "/", Component: Home },
      { path: "*", Component: NotFound },
    ],
  },
]);

export default function App() {
  return (
    <StrictMode>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </StrictMode>
  );
}
