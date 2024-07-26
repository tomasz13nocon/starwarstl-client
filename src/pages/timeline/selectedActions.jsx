import { useMemo } from "react";
import c from "./styles/selectedActions.module.scss";
import Tooltip from "@components/tooltip";
import { useAuth } from "@/context/authContext";
import ListPopover from "@components/listPopover";
import { useToast } from "@/context/toastContext";
import { useFetch } from "@hooks/useFetch";
import { listIcons, plural } from "@/util";
import Icon from "@components/icon";
import Spinner from "@components/spinner";
import FetchButton from "@components/fetchButton";
import LoginDialog from "@layouts/loginDialog";
import Button from "@components/button";

export default function SelectedActions({ selected, rawData, dataState }) {
  const { fetchingAuth, user, actions } = useAuth();
  const [fetchAdd, fetchingAdd] = useFetch(actions.addToList, { toastOnError: true });
  const [fetchRemove, fetchingRemove] = useFetch(actions.removeFromList, { toastOnError: true });
  const { pushToast } = useToast();

  let compoundCount = useMemo(() => {
    if (dataState !== "ok") return 0;

    let count = 0;
    let visited = new Set();
    rawData.forEach((item) => {
      if (item.notUnique && !visited.has(item.pageid) && selected.has(item.pageid)) {
        visited.add(item.pageid);
        count++;
      }
    });
    return count;
  }, [rawData, dataState, selected]);

  async function addToList(listName) {
    let items = user.lists.find((l) => l.name === listName).items;
    let addedCount = new Set([...items, ...selected]).size - items.length;
    let duplicateCount = selected.size - addedCount;

    await fetchAdd(listName, [...selected]);
    pushToast({
      title: `Added ${addedCount} ${plural("item", addedCount)} to ${listName}`,
      description:
        addedCount !== selected.size
          ? `${duplicateCount} selected ${plural("item", duplicateCount)} ${plural("was", duplicateCount)} already in this list`
          : undefined,
      icon: (listIcons[listName] ?? listIcons.generic).added,
      type: "added",
    });
  }

  async function removeFromList(listName) {
    let items = user.lists.find((l) => l.name === listName).items;
    let removedCount = 0;
    for (let item of items) {
      if (selected.has(item)) {
        removedCount++;
      }
    }
    let notRemovedCount = selected.size - removedCount;

    await fetchRemove(listName, [...selected]);
    pushToast({
      title: `Removed ${removedCount} ${plural("item", removedCount)} from ${listName}`,
      description:
        removedCount !== selected.size
          ? `${notRemovedCount} selected ${plural("item", notRemovedCount)} ${plural("was", notRemovedCount)} not in this list`
          : undefined,
      icon: (listIcons[listName] ?? listIcons.generic).remove,
      type: "removed",
    });
  }

  if (fetchingAuth)
    return (
      <div className={c.container}>
        <Spinner />
      </div>
    );

  if (!user)
    return (
      <div className={c.container}>
        <LoginDialog asChild>
          <Button>Log in to perform actions</Button>
        </LoginDialog>
      </div>
    );

  return (
    <div className={c.container}>
      {selected.size} item{selected.size !== 1 && "s"} selected
      {compoundCount > 0 && (
        <>
          <br />
          <span className={c.compoundNote}>
            Including {compoundCount} compound {plural("item", compoundCount)}
          </span>
          <Tooltip info>
            Compound items are multiple entries in the timeline that all refer to one Wookieepedia
            article.
            <br />
            They are treated as one item in the context of lists.
          </Tooltip>
        </>
      )}
      <br />
      <div className={c.buttons}>
        <ListPopover
          lists={user.lists}
          side="top"
          onSelect={addToList}
          showWatchedTooltip
          showCreateList
        >
          <FetchButton
            disabled={fetchingAdd || fetchingRemove}
            fetching={fetchingAdd}
            className="icon-text-container"
          >
            <Icon path={listIcons.generic.add} size={0.9} />
            <span>Add to list</span>
          </FetchButton>
        </ListPopover>
        <ListPopover lists={user.lists} side="top" onSelect={removeFromList}>
          <FetchButton
            disabled={fetchingAdd || fetchingRemove}
            fetching={fetchingRemove}
            className="icon-text-container"
          >
            <Icon path={listIcons.generic.remove} size={0.9} />
            <span>Remove from list</span>
          </FetchButton>
        </ListPopover>
      </div>
      {/* <Popover.Root> */}
      {/*   <Popover.Trigger asChild> */}
      {/*     <Button>Add to list</Button> */}
      {/*   </Popover.Trigger> */}
      {/*   <Popover.Anchor /> */}
      {/*   <Popover.Portal> */}
      {/*     <Popover.Content side="right" className={c.popoverContent}> */}
      {/*       <Popover.Close /> */}
      {/*       <Popover.Arrow /> */}
      {/*       {user.lists.map((list) => ( */}
      {/*         <>{list.name}</> */}
      {/*       ))} */}
      {/*     </Popover.Content> */}
      {/*   </Popover.Portal> */}
      {/* </Popover.Root> */}
    </div>
  );
}
