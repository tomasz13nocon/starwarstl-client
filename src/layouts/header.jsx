import { NavLink, useLocation } from "react-router-dom";
import Icon from "@mdi/react";
import { mdiAccount, mdiChevronDown, mdiCog, mdiMenu, mdiPlaylistEdit } from "@mdi/js";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Collapsible from "@radix-ui/react-collapsible";
import { useAuth } from "@context/authContext";
import LoginDialog from "./loginDialog";
import c from "./styles/header.module.scss";
import { useEffect, useState } from "react";
import Spinner from "@components/spinner";
import { useToast } from "@/context/toastContext";
import Button from "@components/button";

export default function Header() {
  const { user, fetchingAuth, actions } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { pathname } = useLocation();
  const { pushToast, pushErrorToast } = useToast();

  useEffect(() => {
    setDropdownOpen(false);
  }, [pathname]);

  async function handleLogout() {
    try {
      await actions.logout();
      pushToast({
        title: "Logged out",
      });
    } catch (e) {
      pushErrorToast(e);
    }
  }

  const logoutBtn = (
    <Button onClick={handleLogout} inverted className={c.logoutBtn}>
      Logout
    </Button>
  );
  const name = (
    <div className={c.username}>
      <small className={c.loggedInText}>Logged in as</small>
      {user?.name}
    </div>
  );
  const listsBtn = (
    <NavLink to="/lists" className={c.settingsLink}>
      <Icon path={mdiPlaylistEdit} size={1.0} />
      <span>Lists</span>
    </NavLink>
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
              <div className={c.separator} />
              <SecondaryNav />
              {user ? (
                <>
                  <div className={c.separator} />
                  {name}
                  {logoutBtn}
                </>
              ) : (
                <div className={c.loginDialog}>
                  <LoginDialog asChild>
                    <Button inverted className={c.trigger}>
                      Log in
                    </Button>
                  </LoginDialog>
                </div>
              )}
            </Collapsible.Content>
          </Collapsible.Root>
        </div>

        <div className={c.desktopHeader}>
          <Nav />
          <div className={c.right}>
            <SecondaryNav />
            {fetchingAuth ? (
              <Spinner color="white" />
            ) : user ? (
              <DropdownMenu.Root open={dropdownOpen} onOpenChange={(open) => setDropdownOpen(open)}>
                <DropdownMenu.Trigger className={c.dropdownTrigger} aria-label="profile actions">
                  <Icon path={mdiAccount} size={1.5} className={c.icon} />
                  <Icon path={mdiChevronDown} size={1} className={c.arrowIcon} />
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content className={c.userDropdown}>
                    <DropdownMenu.Arrow className={c.arrow} width={16} height={8} />
                    <DropdownMenu.Label>{name}</DropdownMenu.Label>
                    <DropdownMenu.Separator className={c.separator} />
                    <div className={c.linkList}>
                      <DropdownMenu.Item>{listsBtn}</DropdownMenu.Item>
                      <DropdownMenu.Item>{settingsBtn}</DropdownMenu.Item>
                    </div>
                    <DropdownMenu.Separator className={c.separator} />
                    <DropdownMenu.Item>{logoutBtn}</DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            ) : (
              <LoginDialog asChild>
                <Button inverted className={c.trigger}>
                  Log in
                </Button>
              </LoginDialog>
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
          <NavLink end to="/" className={c.navLink}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/timeline" className={c.navLink}>
            Timeline
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

function SecondaryNav() {
  return (
    <NavLink to="/changelog" className={c.navLink}>
      Changelog <small className={c.version}>v0.5</small>
    </NavLink>
  );
}
