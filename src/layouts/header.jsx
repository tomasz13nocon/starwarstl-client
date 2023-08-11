import { useContext } from "react";
import { NavLink } from "react-router-dom";
import Icon from "@mdi/react";
import { mdiAccount, mdiChevronDown, mdiCog, mdiMenu } from "@mdi/js";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Collapsible from "@radix-ui/react-collapsible";
import { AuthContext } from "@context/authContext";
import LoginDialog from "./loginDialog";
import c from "./styles/header.module.scss";

export default function Header() {
  const { user, logout } = useContext(AuthContext);

  const logoutBtn = (
    <button onClick={logout} className={c.logoutBtn}>
      Logout
    </button>
  );
  const name = (
    <div className={c.username}>
      <small className={c.loggedInText}>Logged in as</small>
      {user?.email}
    </div>
  );
  const settingsBtn = (
    <NavLink to="/settings" className={c.settingsLink}>
      <Icon path={mdiCog} size={1.0} />
      <span>Settings</span>
    </NavLink>
  );

  return (
    <div className={c.headerContainer}>
      <header>
        <div className={c.mobileHeader}>
          <Collapsible.Root>
            <Collapsible.Trigger className={c.hamburger}>
              <Icon path={mdiMenu} size={2.0} className={c.hamburgerIcon} />
            </Collapsible.Trigger>
            <Collapsible.Content className={c.content}>
              <Nav />
              {user ? (
                <>
                  <div className={c.separator} />
                  {name}
                  {logoutBtn}
                </>
              ) : (
                <div className={c.loginDialog}>
                  <LoginDialog />
                </div>
              )}
            </Collapsible.Content>
          </Collapsible.Root>
        </div>

        <div className={c.desktopHeader}>
          <Nav />
          <div className={c.right}>
            {user ? (
              <DropdownMenu.Root>
                <DropdownMenu.Trigger className={c.dropdownTrigger} aria-label="profile actions">
                  <Icon path={mdiAccount} size={1.5} className={c.icon} />
                  <Icon path={mdiChevronDown} size={1} className={c.arrowIcon} />
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content className={c.userDropdown}>
                    <DropdownMenu.Arrow className={c.arrow} width={16} height={8} />
                    <DropdownMenu.Label>{name}</DropdownMenu.Label>
                    <DropdownMenu.Separator className={c.separator} />
                    <DropdownMenu.Item>{settingsBtn}</DropdownMenu.Item>
                    <DropdownMenu.Separator className={c.separator} />
                    <DropdownMenu.Item>{logoutBtn}</DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            ) : (
              <LoginDialog />
            )}
          </div>
        </div>
      </header>
    </div>
  );
}

function Nav() {
  return (
    <nav>
      <ul className={c.navList}>
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
  );
}
