import React from "react";
import { NavLink } from "react-router-dom";

export default function Header() {
  return (
    <header>
      <nav>
        <ul>
          <li>
            <NavLink end to="/">Home</NavLink>
          </li>
          <li>
            <NavLink to="/timeline">Timeline</NavLink>
          </li>
          {/* <li> */}
          {/*   <NavLink to="/about">About</NavLink> */}
          {/* </li> */}
          {/* <li> */}
          {/*   <NavLink to="/faq">FAQ</NavLink> */}
          {/* </li> */}
        </ul>
      </nav>
    </header>
  );
}
