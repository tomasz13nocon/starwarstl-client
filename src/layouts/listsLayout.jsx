import Shell from "./shell";
import { NavLink, Outlet } from "react-router-dom";

import c from "./styles/listLayout.module.scss";
import { mdiKeyboardReturn } from "@mdi/js";
import Icon from "@components/icon";

export default function ListsLayout() {
  return (
    <>
      <Shell>
        <h1>
          <NavLink to="." className={c.navLink} end>
            {({ isActive }) => (
              <>Lists {isActive ? "" : <Icon size={1.5} path={mdiKeyboardReturn} />}</>
            )}
          </NavLink>
        </h1>
        <Outlet />
      </Shell>
    </>
  );
}
