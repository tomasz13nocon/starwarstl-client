import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { mdiFormatListBulleted } from "@mdi/js";

import FiltersSection from "./filtersSection";
import { useAuth } from "@/context/authContext";

import c from "./styles/listFilters.module.scss";
import Radio from "@components/radio";
import { useEffect } from "react";
import clsx from "clsx";
import FilterBullet from "@components/filterBullet";
import Button from "@components/button";
import Icon from "@components/icon";

export default function ListFilters({ listFilters, setListFilters }) {
  const { user } = useAuth();

  // Recreate the filter when user's lists change
  useEffect(() => {
    const newListFilters = [];
    for (let listFilter of listFilters) {
      let userList = user.lists.find((list) => list.name === listFilter.name);
      // Handle the case of user deleting a list which is an active filter
      if (!userList) {
        console.log("user doesn't have this list. removing", listFilter.name);
        removeListFilter(listFilter);
      } else {
        newListFilters.push({
          name: userList.name,
          show: listFilter.show,
          items: userList.items,
          icon: userList.icon,
        });
      }
    }
    setListFilters(newListFilters);
  }, [user]);

  function addListFilter(listName) {
    // If listFilters already contains this list, return
    if (listFilters.find((listFilter) => listFilter.name === listName) !== undefined) return;

    const listToAdd = user.lists.find((list) => list.name === listName);
    setListFilters([
      ...listFilters,
      {
        name: listName,
        items: listToAdd.items,
        icon: listToAdd.icon,
        show: true,
      },
    ]);
  }

  function removeListFilter(listFilter) {
    setListFilters(listFilters.filter((value) => listFilter.name !== value.name));
  }

  const addableLists = user.lists.filter(
    (list) => !listFilters.find((filter) => filter.name === list.name),
  );

  return (
    <FiltersSection title="Lists">
      <div className={c.label}>
        <DropdownMenu.Root disabled={addableLists.length === 0}>
          <DropdownMenu.Trigger asChild>
            <Button
              className={clsx(c.trigger, "icon-text-container")}
              aria-label="Add list to filters"
              disabled={addableLists.length === 0}
            >
              <Icon path={mdiFormatListBulleted} />
              <span>{addableLists.length > 0 ? "Select a list…" : "No more lists"}</span>
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content className={clsx(c.content, "floating-content")} sideOffset={5}>
              {addableLists.map((list) => (
                <DropdownMenu.Item
                  key={list.name}
                  className={c.item}
                  onClick={() => addListFilter(list.name)}
                >
                  <div className={c.itemText}>
                    {list.icon ? <Icon path={list.icon} size={0.9} /> : null}
                    <span>{list.name}</span>
                  </div>
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>

      {listFilters.map((listFilter) => (
        <FilterBullet
          className={c.filterBullet}
          contentClassName={c.filterBulletContent}
          buttonOnClick={() => removeListFilter(listFilter)}
          key={listFilter.name}
        >
          <div className={clsx(c.listEntry)}>
            <div className={c.listEntryNameAndIcon}>
              {listFilter.icon ? <Icon path={listFilter.icon} size={0.8} /> : null}

              <span className={c.listEntryName}>{listFilter.name}</span>
            </div>

            <div className={c.listEntryControls}>
              <Radio
                checked={listFilter.show}
                onChange={() =>
                  setListFilters((old) =>
                    old.map((f) => {
                      if (f.name === listFilter.name) {
                        f.show = true;
                      }
                      return f;
                    }),
                  )
                }
              >
                Show
              </Radio>
              <Radio
                checked={!listFilter.show}
                onChange={() =>
                  setListFilters((old) =>
                    old.map((f) => {
                      if (f.name === listFilter.name) {
                        f.show = false;
                      }
                      return f;
                    }),
                  )
                }
              >
                Hide
              </Radio>
            </div>
          </div>
        </FilterBullet>
      ))}
    </FiltersSection>
  );
}
