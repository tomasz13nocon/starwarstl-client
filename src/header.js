import React from "react";
import { NavLink } from "react-router-dom";

export default function Header() {
  return (
    <header>
      <nav>
        <ul>
          <li>
            <NavLink end to="/">
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/add">Add</NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}
