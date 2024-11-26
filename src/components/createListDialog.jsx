import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import c from "./styles/createListDialog.module.scss";
import { useFetch } from "@hooks/useFetch";
import { useAuth } from "@/context/authContext";
import { useToast } from "@/context/toastContext";
import { createListActionToast } from "@/util";
import { mdiPlus } from "@mdi/js";
import clsx from "clsx";
import Button from "./button";
import Icon from "./icon";
import DialogContents from "./dialogContents";
import Alert from "./alert";
import Spinner from "./spinner";

export default function CreateListDialog() {
  const { user, actions } = useAuth();
  const { pushToast } = useToast();
  const [newListName, setNewListName] = useState("");
  const [newListError, setNewListError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [fetchCreateList, fetchingCreateList, createListAlert, resetCreateListAlert] = useFetch(
    actions.createList,
  );

  useEffect(() => {
    if (!dialogOpen) resetCreateListAlert();
  }, [dialogOpen]);

  const userListNames = user?.lists.map((list) => list.name.toLowerCase());

  function newListNameChanged(e) {
    const value = e.target.value;
    setNewListName(value);
    if (userListNames.includes(value.toLowerCase())) {
      setNewListError("List with this name already exists.");
      resetCreateListAlert();
    } else {
      setNewListError("");
    }
  }

  async function createList(e) {
    e.preventDefault();
    const listName = e.target.listName.value;

    await fetchCreateList(listName);
    setDialogOpen(false);
    pushToast(createListActionToast("created", listName));
    setNewListName("");
  }

  if (!user) return null;
  return (
    <Dialog.Root open={dialogOpen} onOpenChange={(open) => setDialogOpen(open)}>
      <Dialog.Trigger asChild>
        <Button className={clsx("icon-text-container", c.addListBtn)}>
          <Icon path={mdiPlus} size={0.9} />
          <span>Create new list</span>
        </Button>
      </Dialog.Trigger>
      <DialogContents title={"Create new list"} small>
        <form className={c.createListDialogContents} onSubmit={createList}>
          {newListError ? <Alert center>{newListError}</Alert> : null}
          <Alert alert={createListAlert} center />
          <input
            type="text"
            name="listName"
            value={newListName}
            onInput={newListNameChanged}
            placeholder="List name"
            maxLength={64}
          />
          <Button type="submit" disabled={newListError !== "" || fetchingCreateList}>
            {fetchingCreateList ? <Spinner size={20} /> : "Create"}
          </Button>
        </form>
      </DialogContents>
    </Dialog.Root>
  );
}
