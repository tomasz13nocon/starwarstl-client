import { NavLink } from "react-router-dom";
import "./styles/header.scss";

export default function Header() {
  return (
    <div className="header-container">
      <header>
        <nav>
          <ul className="nav-list">
            <li>
              <NavLink end to="/">
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/timeline">Timeline</NavLink>
            </li>
          </ul>
        </nav>

        <div className="right">
          <div className="sign-in-container">
            <button className="sign-in" onClick={() => {}}>
              Sign in
            </button>
          </div>
        </div>
      </header>
    </div>
  );
}
