import { Fragment, useEffect, useState } from "react";
import c from "./styles/userActions.module.scss";
import { useAuth } from "@/context/authContext";
import clsx from "clsx";
import { useToast } from "@/context/toastContext";
import Spinner from "@components/spinner";
import LoginDialog from "@layouts/loginDialog";
import * as Popover from "@radix-ui/react-popover";
import * as Dialog from "@radix-ui/react-dialog";
import { builtinLists, createListActionToast, listIcons } from "@/util";
import { mdiPlus } from "@mdi/js";
import DialogContents from "@components/dialogContents";
import Checkbox from "@components/checkbox";
import Icon from "@components/icon";
import Alert from "@components/alert";
import Button from "@components/button";
import { useFetch } from "@hooks/useFetch";

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

export default function UserActions({ item }) {
  const { fetchingAuth, user, actions } = useAuth();
  const { pushToast } = useToast();
  const [newListName, setNewListName] = useState("");
  const [newListError, setNewListError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [fetchCreateList, fetchingCreateList, createListAlert, resetCreateListAlert] = useFetch(
    actions.createList,
  );
  const [fetchAdd] = useFetch(actions.addToList, { toastOnError: true });
  const [fetchRemove] = useFetch(actions.removeFromList, { toastOnError: true });

  useEffect(() => {
    if (!dialogOpen) resetCreateListAlert();
  }, [dialogOpen]);

  const userListNames = user?.lists.map((list) => list.name.toLowerCase());

  function newListNameChanged(e) {
    let value = e.target.value;
    setNewListName(value);
    if (userListNames.includes(value.toLowerCase())) {
      setNewListError("List with this name already exists.");
      resetCreateListAlert();
    } else {
      setNewListError("");
    }
  }

  async function addToList(listName) {
    await fetchAdd(listName, [item.pageid]);
    pushToast(createListActionToast("added", listName, item));
  }

  async function removeFromList(listName) {
    await fetchRemove(listName, [item.pageid]);
    pushToast(createListActionToast("removed", listName, item));
  }

  async function createList(e) {
    e.preventDefault();
    const listName = e.target.listName.value;

    await fetchCreateList(listName);
    setDialogOpen(false);
    pushToast(createListActionToast("created", listName));
    setNewListName("");
  }

  // Can't perform actions if no wookeepedia article, since we rely on their pageIDs as keys
  if (!Number.isInteger(item.pageid)) return null;
  if (fetchingAuth) return <Spinner />;
  if (!user) {
    return (
      <LoginDialog asChild>
        <Button className={c.signInBtn}>Log in to perform actions</Button>
      </LoginDialog>
    );
  }

  return (
    <div className={c.actions}>
      <div className={c.listBtns}>
        {user.lists
          .filter((list) => builtinLists.includes(list.name))
          .map((list) => (
            <Fragment key={list.name}>
              {list.items.includes(item.pageid) ? (
                <button
                  onClick={() => removeFromList(list.name)}
                  title={`Remove from ${list.name}`}
                >
                  <HoverIcon
                    className={c.watched}
                    path={listIcons[list.name].defaultIn}
                    hoverPath={listIcons[list.name].remove}
                    size={1.5}
                  />
                </button>
              ) : (
                <button onClick={() => addToList(list.name)} title={`Add to ${list.name}`}>
                  <HoverIcon
                    path={listIcons[list.name].default}
                    hoverPath={listIcons[list.name].add}
                    size={1.5}
                  />
                </button>
              )}
            </Fragment>
          ))}

        <Dialog.Root open={dialogOpen} onOpenChange={(open) => setDialogOpen(open)}>
          <Popover.Root>
            <Popover.Trigger title="Add to list">
              <HoverIcon
                path={listIcons.generic.default}
                hoverPath={listIcons.generic.add}
                size={1.5}
              />
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content side="right" className={c.listDropdownContent}>
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
                <Dialog.Trigger asChild>
                  <Button className={clsx("icon-text-container", c.addListBtn)}>
                    <Icon path={mdiPlus} />
                    <span>Create new list</span>
                  </Button>
                </Dialog.Trigger>
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>

          <DialogContents title={"Create new list"} small>
            <form className={c.createListDialogContents} onSubmit={createList}>
              {newListError ? <Alert center>{newListError}</Alert> : null}
              <Alert alert={createListAlert} center />
              <input
                type="text"
                name="listName"
                value={newListName}
                onInput={newListNameChanged}
                maxLength={64}
              />
              <Button type="submit" disabled={newListError !== "" || fetchingCreateList}>
                {fetchingCreateList ? <Spinner size={20} /> : "Create"}
              </Button>
            </form>
          </DialogContents>
        </Dialog.Root>
      </div>
    </div>
  );
}
