import { useContext, useState } from "react";
import c from "./styles/userActions.module.scss";
import { useAuth } from "@/context/authContext";
import clsx from "clsx";
import { Icon } from "@mdi/react";
import { ToastContext } from "@/context/toastContext";
import * as api from "@/fetch";
import Spinner from "@components/spinner";
import LoginDialog from "@layouts/loginDialog";
import * as Popover from "@radix-ui/react-popover";
import * as Dialog from "@radix-ui/react-dialog";
import { builtinLists, watchedName, watchlistName } from "@/util";
import {
  mdiClock,
  mdiClockOutline,
  mdiClockPlusOutline,
  mdiClockRemove,
  mdiExclamationThick,
  mdiEye,
  mdiEyeOutline,
  mdiEyePlusOutline,
  mdiEyeRemove,
  mdiPlus,
} from "@mdi/js";
import DialogContents from "@components/dialogContents";
import Checkbox from "@components/checkbox";

function HoverIcon({ path, hoverPath, ...props }) {
  const [hover, setHover] = useState(false);
  return (
    <Icon
      {...props}
      path={hover ? hoverPath : path}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    />
  );
}

let listPath = "M4 6H20V8H4M4 11H20V13H4M4 16H20V18H4";
let listPathPlus =
  "M4 6H20V8H4M4 11H20V13H4M4 16H13.5V18H4M18,14.5V17.5H15V19.5H18V22.5H20V19.5H23V17.5H20V14.5H18Z";
let listPathMinus =
  "M4 6H20V8H4M4 11H20V13H4M4 16H13.5V18H4M22.54 16.88L20.41 19L22.54 21.12L21.12 22.54L19 20.41L16.88 22.54L15.47 21.12L17.59 19L15.47 16.88L16.88 15.47L19 17.59L21.12 15.47L22.54 16.88";
// let listPath =
//   "M7,5H21V7H7V5M7,13V11H21V13H7M4,4.5A1.5,1.5 0 0,1 5.5,6A1.5,1.5 0 0,1 4,7.5A1.5,1.5 0 0,1 2.5,6A1.5,1.5 0 0,1 4,4.5M4,10.5A1.5,1.5 0 0,1 5.5,12A1.5,1.5 0 0,1 4,13.5A1.5,1.5 0 0,1 2.5,12A1.5,1.5 0 0,1 4,10.5M7,19V17H21V19H7M4,16.5A1.5,1.5 0 0,1 5.5,18A1.5,1.5 0 0,1 4,19.5A1.5,1.5 0 0,1 2.5,18A1.5,1.5 0 0,1 4,16.5Z";
// let listPathPlus =
//   "M7 5h14v2H7zm0 8v-2h14v2zM4 4.5A1.5 1.5 0 0 1 5.5 6A1.5 1.5 0 0 1 4 7.5A1.5 1.5 0 0 1 2.5 6A1.5 1.5 0 0 1 4 4.5m0 6A1.5 1.5 0 0 1 5.5 12A1.5 1.5 0 0 1 4 13.5A1.5 1.5 0 0 1 2.5 12A1.5 1.5 0 0 1 4 10.5M7 19v-2h6v2zm-3-2.5A1.5 1.5 0 0 1 5.5 18A1.5 1.5 0 0 1 4 19.5A1.5 1.5 0 0 1 2.5 18A1.5 1.5 0 0 1 4 16.5M18,14.5V17.5H15V19.5H18V22.5H20V19.5H23V17.5H20V14.5H18Z";

const icons = {
  [watchedName]: {
    add: mdiEye,
    remove: mdiEyeRemove,
  },
  [watchlistName]: {
    add: mdiClock,
    remove: mdiClockRemove,
  },
};

export default function UserActions({ item }) {
  const { fetchingAuth, user, setUser } = useAuth();
  const { pushToast } = useContext(ToastContext);
  const [newListName, setNewListName] = useState("");
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const userListNames = user.lists.map((list) => list.name.toLowerCase());

  function newListNameChanged(e) {
    let value = e.target.value;
    setNewListName(value);
    if (userListNames.includes(value.toLowerCase())) {
      setError("List with this name already exists.");
    } else {
      setError("");
    }
  }

  function pushListToast(className, path, text, showItem = true) {
    pushToast({
      title: (
        <div className={c.toastTitle}>
          {path ? <Icon className={clsx("icon", className)} path={path} size={1} /> : null}
          <span>{text}</span>
        </div>
      ),
      description: showItem && (
        <span className={clsx(item.fullType ?? item.type, c.toastItemTitle)}>{item.title}</span>
      ),
    });
  }

  // TODO fetching spinners, error handling?

  async function addToList(listName, id) {
    await api.addToList(listName, id);
    pushListToast(c.toastIconAdd, icons[listName]?.add ?? listPathPlus, `Added to ${listName}`);

    setUser((prev) => ({
      ...prev,
      lists: prev.lists.map((list) =>
        list.name === listName ? { ...list, items: [...list.items, id] } : list,
      ),
    }));
  }

  async function removeFromList(listName, id) {
    await api.removeFromList(listName, id);
    pushListToast(
      c.toastIconRemove,
      icons[listName]?.remove ?? listPathMinus,
      `Removed from ${listName}`,
    );

    setUser((prev) => ({
      ...prev,
      lists: prev.lists.map((list) =>
        list.name === listName
          ? { ...list, items: list.items.filter((item) => item !== id) }
          : list,
      ),
    }));
  }

  async function createList(e) {
    e.preventDefault();

    const listName = e.target.listName.value;
    let createdList;
    try {
      createdList = await api.createList(listName);
    } catch (e) {
      pushListToast(c.toastIconRemove, mdiExclamationThick, "Error: " + e.message, false);
      return;
    }

    setDialogOpen(false);
    pushListToast(c.toastIconAdd, listPathPlus, `Created list ${listName}`, false);
    setUser((prev) => ({
      ...prev,
      lists: [...prev.lists, createdList],
    }));
  }

  return (
    <>
      {Number.isInteger(item.pageid) ? ( // Can't perform actions if no wookeepedia article, since we rely on their pageIDs as keys
        <>
          {fetchingAuth ? (
            <Spinner />
          ) : user ? (
            <>
              <div className={c.actions}>
                <div className={c.listBtns}>
                  {user.lists
                    .find((list) => list.name === watchedName)
                    .items.includes(item.pageid) ? (
                    <button
                      onClick={() => removeFromList(watchedName, item.pageid)}
                      title="Remove from Watched"
                    >
                      <HoverIcon
                        className={clsx("icon", c.watched)}
                        path={mdiEye}
                        hoverPath={mdiEyeRemove}
                        size={1.5}
                      />
                    </button>
                  ) : (
                    <button
                      onClick={() => addToList(watchedName, item.pageid)}
                      title="Add to Watched"
                    >
                      <HoverIcon
                        className="icon"
                        path={mdiEyeOutline}
                        hoverPath={mdiEyePlusOutline}
                        size={1.5}
                      />
                    </button>
                  )}
                  {user.lists
                    .find((list) => list.name === watchlistName)
                    .items.includes(item.pageid) ? (
                    <button
                      onClick={() => removeFromList(watchlistName, item.pageid)}
                      title="Remove from Watchlist"
                    >
                      <HoverIcon
                        className={clsx("icon", c.watchlist)}
                        path={mdiClock}
                        hoverPath={mdiClockRemove}
                        size={1.5}
                      />
                    </button>
                  ) : (
                    <button
                      onClick={() => addToList(watchlistName, item.pageid)}
                      title="Add to Watchlist"
                    >
                      <HoverIcon
                        className="icon"
                        path={mdiClockOutline}
                        hoverPath={mdiClockPlusOutline}
                        size={1.5}
                      />
                    </button>
                  )}

                  <Dialog.Root open={dialogOpen} onOpenChange={(open) => setDialogOpen(open)}>
                    <Popover.Root>
                      <Popover.Trigger title="Add to list">
                        <HoverIcon
                          className="icon"
                          path={listPath}
                          hoverPath={listPathPlus}
                          size={1.5}
                        />
                      </Popover.Trigger>
                      <Popover.Portal>
                        <Popover.Content
                          side="right"
                          className={clsx("floating-content", c.listDropdownContent)}
                        >
                          {user.lists
                            .filter((list) => !builtinLists.includes(list.name))
                            .map((list) => {
                              let value = list.items.includes(item.pageid);
                              let onChange = value
                                ? () => removeFromList(list.name, item.pageid)
                                : () => addToList(list.name, item.pageid);
                              return (
                                <Checkbox
                                  key={list.name}
                                  name={list.name}
                                  value={value}
                                  onChange={onChange}
                                  textClassName={c.checkboxText}
                                />
                              );
                            })}
                          <div className={c.separator} />
                          <Dialog.Trigger
                            className={clsx("btn", "icon-text-container", c.addListBtn)}
                          >
                            <Icon className="icon" size={1} path={mdiPlus} />
                            <span>Create new list</span>
                          </Dialog.Trigger>
                        </Popover.Content>
                      </Popover.Portal>
                    </Popover.Root>

                    <DialogContents title={"Create new list"} small>
                      <form className={c.createListDialogContents} onSubmit={createList}>
                        <input
                          type="text"
                          name="listName"
                          value={newListName}
                          onInput={newListNameChanged}
                        />

                        {error ? <div className="error">{error}</div> : null}
                        <button type="submit" className="btn" disabled={error !== ""}>
                          Create
                        </button>
                      </form>
                    </DialogContents>
                  </Dialog.Root>
                </div>
              </div>
            </>
          ) : (
            <LoginDialog className={clsx("btn", c.signInBtn)}>
              Log in to perform actions
            </LoginDialog>
          )}
        </>
      ) : (
        ""
      )}
    </>
  );
}
