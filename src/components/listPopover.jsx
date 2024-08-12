// import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Popover from "@radix-ui/react-popover";
import c from "./styles/listPopover.module.scss";
import ListName from "./listName";
import { watchedName, watchlistName } from "@/util";
import Tooltip from "./tooltip";
import Button from "./button";
import { useState } from "react";
import CreateListDialog from "./createListDialog";
import Separator from "./separator";

export default function ListPopover({
  lists,
  onSelect,
  side = "right",
  showWatchedTooltip,
  showCreateList,
  children,
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>{children}</Popover.Trigger>
      <Popover.Portal>
        <Popover.Content side={side} sideOffset={5} className={c.content}>
          {lists.map((list) => (
            <div key={list.name} className={c.itemContainer}>
              <Button
                className={c.item}
                onClick={() => {
                  setOpen(false);
                  onSelect(list.name);
                }}
              >
                <ListName name={list.name} />
              </Button>

              {list.name === watchedName && showWatchedTooltip && (
                <Tooltip className={c.watchedTooltip} info>
                  <span className={c.tooltipText}>When adding to </span>
                  <ListName name={watchedName} iconSize={0.7} />
                  <span className={c.tooltipText}>, items are automatically removed from </span>
                  <ListName name={watchlistName} iconSize={0.7} />.
                </Tooltip>
              )}
            </div>
          ))}
          {showCreateList && (
            <>
              <Separator />
              <CreateListDialog />
            </>
          )}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );

  // return (
  //   <DropdownMenu.Root disabled={disabled}>
  //     <DropdownMenu.Trigger asChild>{children}</DropdownMenu.Trigger>
  //     <DropdownMenu.Portal>
  //       <DropdownMenu.Content side="right" className={c.content} sideOffset={5}>
  //         {lists.map((list) => (
  //           <DropdownMenu.Item
  //             key={list.name}
  //             className={c.itemContainer}
  //             onSelect={() => onSelect(list.name)}
  //           >
  //             <Button className={c.item}>
  //               <ListName name={list.name} />
  //             </Button>
  //
  //             {list.name === watchedName && showWatchedTooltip && (
  //               <Tooltip className={c.watchedTooltip} info>
  //                 When adding to{" "}
  //                 <ListName name={watchedName} className={c.listName} iconSize={0.7} />, items are
  //                 automatically removed from{" "}
  //                 <ListName name={watchlistName} className={c.listName} iconSize={0.7} />.
  //               </Tooltip>
  //             )}
  //           </DropdownMenu.Item>
  //         ))}
  //       </DropdownMenu.Content>
  //     </DropdownMenu.Portal>
  //   </DropdownMenu.Root>
  // );
}
