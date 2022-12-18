import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import About from "./about";
import Faq from "./faq";
import Footer from "./footer";
import Header from "./header";
import Home from "./home";

export default function App() {
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
