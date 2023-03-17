import React from "react";
import ReactPiwik from "react-piwik";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Faq from "./faq";
import Footer from "./footer";
import FullCoverPreview from "./fullCoverPreview";
import Header from "./header";
import Home from "./home";
import Landing from "./landing";

const matomo = new ReactPiwik({
  url: 'analytics.starwarstl.com',
  siteId: 1,
});
// ReactPiwik.push(['trackPageView']);

export default function App() {
  const [fullCover, setFullCover] = React.useState({ name: "", show: false });
  return (
    <React.StrictMode>
      <Router history={matomo.connectToHistory(history, true)}>
        <Header />
        <FullCoverPreview fullCover={fullCover} setFullCover={setFullCover} />
        <Routes>
          <Route path="/faq" element={<Faq />}></Route>
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
