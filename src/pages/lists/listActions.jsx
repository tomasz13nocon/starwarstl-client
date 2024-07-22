import * as Dialog from "@radix-ui/react-dialog";
import c from "./styles/listActions.module.scss";
import { builtinLists } from "@/util";
import DialogContents from "@components/dialogContents";
import Button from "@components/button";
import FetchButton from "@components/fetchButton";

export default function ListActions({ list, onRename, onDelete, fetchingDelete }) {
  return (
    <>
      <div className={c.actions}>
        <div>
          {list.items.length} item{list.items.length === 1 ? "" : "s"}
        </div>
        {builtinLists.includes(list.name) ? null : (
          <>
            <Button onClick={onRename}>Rename</Button>
            <Dialog.Root>
              <Dialog.Trigger asChild>
                <Button>Delete</Button>
              </Dialog.Trigger>
              <DialogContents
                title={"Delete list"}
                description={
                  <span className={c.deleteDialogDescription}>
                    Are you sure you want to delete &quot;{list.name}&quot;
                  </span>
                }
                small
              >
                <FetchButton danger fetching={fetchingDelete} onClick={onDelete}>
                  Delete permanently
                </FetchButton>
              </DialogContents>
            </Dialog.Root>
          </>
        )}
      </div>
    </>
  );
}
