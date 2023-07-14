import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Footer from "@layouts/footer";
import Header from "@layouts/header";
import Timeline from "@pages/timeline/timeline";
import Home from "@pages/home/home";
import NotFound from "./NotFound";
import Signin from "@pages/signin";

export default function App() {
  return (
    <React.StrictMode>
      <Router>
        <Header />
        <Routes>
          <Route path="/signin" element={<Signin />}></Route>
          <Route path="/timeline" element={<Timeline />}></Route>
          <Route path="/" element={<Home />}></Route>
          <Route path="*" element={<NotFound />}></Route>
        </Routes>
        <Footer />
      </Router>
    </React.StrictMode>
  );
}
