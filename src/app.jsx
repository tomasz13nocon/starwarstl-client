import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import About from "./about";
import Faq from "./faq";
import Footer from "./footer";
import FullCoverPreview from "./fullCoverPreview";
import Header from "./header";
import Home from "./home";
import Landing from "./landing";

export default function App() {
  const [fullCover, setFullCover] = React.useState({ name: "", show: false });
  return (
    <Router>
      <Header />
      <FullCoverPreview fullCover={fullCover} setFullCover={setFullCover} />
      <Routes>
        <Route path="/faq" element={<Faq />}></Route>
        <Route path="/about" element={<About />}></Route>
        <Route path="/timeline" element={<Home setFullCover={setFullCover} />}></Route>
        {/* <Route path="/timeline/:title" element={<Home setFullCover={setFullCover} />}></Route> */}
        <Route path="/" element={<Landing setFullCover={setFullCover} />}></Route>
        <Route path="*" element={<h1>404</h1>}></Route>
      </Routes>
      <Footer />
    </Router>
  );
}
