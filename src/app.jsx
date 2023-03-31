import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import FullCoverPreview from "./components/fullCoverPreview";
import Footer from "./layouts/footer";
import Header from "./layouts/header";
import Home from "./pages/timeline/home";
import Landing from "./pages/home/landing";

export default function App() {
  const [fullCover, setFullCover] = React.useState({ name: "", show: false });
  return (
    <React.StrictMode>
      <Router>
        <Header />
        <FullCoverPreview fullCover={fullCover} setFullCover={setFullCover} />
        <Routes>
          <Route path="/timeline" element={<Home setFullCover={setFullCover} />}></Route>
          {/* <Route path="/timeline/:title" element={<Home setFullCover={setFullCover} />}></Route> */}
          <Route path="/" element={<Landing setFullCover={setFullCover} />}></Route>
          <Route path="*" element={<h1 style={{textAlign:"center",marginTop:"40px"}}>404 Not Found</h1>}></Route>
        </Routes>
        <Footer />
      </Router>
    </React.StrictMode>
  );
}
