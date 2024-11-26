import c from "./styles/lists.module.scss";
import { useAuth } from "@/context/authContext";
import clsx from "clsx";
import { Link } from "react-router-dom";
import Spinner from "@components/spinner";
import ListActions from "./listActions";
import { useState } from "react";
import Alert from "@components/alert";
import { useToast } from "@/context/toastContext";
import { createListActionToast } from "@/util";
import Unauthenticated from "@components/inlineAlerts/unauthenticated";
import Button from "@components/button";
import FetchButton from "@components/fetchButton";
import { useFetch } from "@hooks/useFetch";
import ListName from "@components/listName";
import Shell from "@layouts/shell";

// TODO: redo this component at some point, it's messy
export default function Lists() {
  const { fetchingAuth, user, actions } = useAuth();
  const [editingName, setEditingName] = useState("");
  const [newName, setNewName] = useState("");
  const [inputError, setInputError] = useState("");
  const { pushToast } = useToast();
  const [fetchDeleteList, fetchingDeleteList] = useFetch(actions.deleteList, {
    toastOnError: true,
  });
  const [fetchRenameList, fetchingRenameList] = useFetch(actions.renameList, {
    toastOnError: true,
  });

  async function renameList() {
    await fetchRenameList(editingName, newName);
    setEditingName("");
  }

  async function deleteList(listName) {
    await fetchDeleteList(listName);
    pushToast(createListActionToast("deleted", listName));
  }

  function startRename(listName) {
    setEditingName(listName);
    setNewName(listName);
  }

  function newNameChanged(e) {
    const nextName = e.target.value;
    setNewName(nextName);

    if (user.lists.find((list) => list.name === nextName && list.name !== editingName))
      setInputError("List name already exists");
    else if (nextName.length === 0) setInputError("List name too short");
    else setInputError("");
  }

  function onEditInputKeyDown(e) {
    const disabled = inputError || editingName === newName || fetchingRenameList;
    if (e.key === "Enter" && !disabled) {
      renameList();
    }
  }

  if (fetchingAuth) return <Spinner size={36} />;
  if (!user) return <Unauthenticated />;

  return (
    <Shell>
      <div className={c.listContainer}>
        {user.lists.map((list) => (
          <div key={list.name} className={clsx(c.list)}>
            {editingName === list.name ? (
              <>
                <div className={c.listInner}>
                  <div className={c.editingInputGroup}>
                    <input
                      className={clsx(inputError && "input-error")}
                      type="text"
                      autoFocus
                      value={newName}
                      onChange={newNameChanged}
                      onKeyDown={onEditInputKeyDown}
                    />
                    <FetchButton
                      onClick={renameList}
                      fetching={fetchingRenameList}
                      disabled={inputError || editingName === newName}
                    >
                      Submit
                    </FetchButton>
                    <Button onClick={() => setEditingName("")} disabled={fetchingRenameList}>
                      Cancel
                    </Button>
                  </div>
                  <ListActions
                    list={list}
                    onRename={() => startRename(list.name)}
                    onDelete={() => deleteList(list.name)}
                    fetchingDelete={fetchingDeleteList}
                  />
                </div>
                {inputError ? <Alert slim>{inputError}</Alert> : null}
              </>
            ) : (
              <div className={c.listInner}>
                <Link to={encodeURIComponent(list.name)} className={clsx(c.listName)}>
                  <ListName name={list.name} />
                </Link>
                <ListActions
                  list={list}
                  onRename={() => startRename(list.name)}
                  onDelete={() => deleteList(list.name)}
                  fetchingDelete={fetchingDeleteList}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </Shell>
  );
}
