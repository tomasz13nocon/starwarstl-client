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
import ListName from "@components/listName";
import ListPopover from "@components/listPopover";
import { plural } from "@/util";

export default function ListFilters({ listFilters, setListFilters }) {
  const { user } = useAuth();

  // Recreate the filter when user's lists change
  useEffect(() => {
    const newListFilters = [];
    for (let listFilter of listFilters) {
      let userList = user.lists.find((list) => list.name === listFilter.name);
      // Handle the case of user deleting a list which is an active filter
      if (!userList) {
        removeListFilter(listFilter);
      } else {
        newListFilters.push({
          name: userList.name,
          show: listFilter.show,
          items: userList.items,
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

  console.log(listFilters[0].items);

  return (
    <FiltersSection title="Lists">
      <div className={c.label}>
        <ListPopover lists={addableLists} onSelect={addListFilter}>
          <Button
            className={c.trigger}
            aria-label="Add list to filters"
            disabled={addableLists.length === 0}
          >
            <Icon path={mdiFormatListBulleted} />
            <span>{addableLists.length > 0 ? "Select a list…" : "No more lists"}</span>
          </Button>
        </ListPopover>
      </div>

      {listFilters.map((listFilter) => (
        <FilterBullet
          className={c.filterBullet}
          contentClassName={c.filterBulletContent}
          buttonOnClick={() => removeListFilter(listFilter)}
          key={listFilter.name}
        >
          <div className={clsx(c.listEntry)}>
            <div className={c.listEntryName}>
              <ListName name={listFilter.name} iconSize={0.8} />
              <small className={c.itemCount}>
                {listFilter.items.length} {plural("item", listFilter.items.length)}
              </small>
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
