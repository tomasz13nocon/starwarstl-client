import ErrorBoundary from "@/errorBoundary";
import Footer from "@layouts/footer";
import Header from "@layouts/header";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <ErrorBoundary>
        <Header />
        <Outlet />
        <Footer />
      </ErrorBoundary>
    </>
  );
}
