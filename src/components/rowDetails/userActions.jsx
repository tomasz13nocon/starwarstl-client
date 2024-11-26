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
import CreateListDialog from "@components/createListDialog";
import Separator from "@components/separator";

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
  const [fetchAdd] = useFetch(actions.addToList, { toastOnError: true });
  const [fetchRemove] = useFetch(actions.removeFromList, { toastOnError: true });

  async function addToList(listName) {
    await fetchAdd(listName, [item.pageid]);
    pushToast(createListActionToast("added", listName, item));
  }

  async function removeFromList(listName) {
    await fetchRemove(listName, [item.pageid]);
    pushToast(createListActionToast("removed", listName, item));
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

  const defaultLists = user.lists.filter((list) => builtinLists.includes(list.name));
  const userLists = user.lists.filter((list) => !builtinLists.includes(list.name));

  return (
    <div className={c.actions}>
      <div className={c.listBtns}>
        {defaultLists.map((list) => (
          <Fragment key={list.name}>
            {list.items.includes(item.pageid) ? (
              <button onClick={() => removeFromList(list.name)} title={`Remove from ${list.name}`}>
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
              {userLists.map((list) => {
                const value = list.items.includes(item.pageid);
                const onChange = value
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
              {userLists.length > 0 && <Separator />}
              <CreateListDialog />
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>
    </div>
  );
}
