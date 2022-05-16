import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import About from "./about.js";
import Add from "./add.js";
import Faq from "./faq.js";
import Footer from "./footer.js";
import Header from "./header.js";
import Home from "./home.js";

export default function Main() {
  return (
    <Router>
      <Header />
      <main className="content">
        <Routes>
          <Route path="/faq" element={<Faq />}></Route>
          <Route path="/about" element={<About />}></Route>
          <Route path="/" element={<Home />}></Route>
          <Route path="*" element={<h1>404</h1>}></Route>
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}
