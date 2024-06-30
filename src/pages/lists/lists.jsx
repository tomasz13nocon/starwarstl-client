import Shell from "@layouts/shell";
import c from "./styles/lists.module.scss";
import { useAuth } from "@/context/authContext";
import clsx from "clsx";
import { Icon } from "@mdi/react";
import { Link } from "react-router-dom";

export default function Lists() {
  const { user } = useAuth();

  return (
    <>
      <Shell>
        <h1>Lists</h1>
        <div className={c.listContainer}></div>
        {user.lists.map((list) => (
          <div key={list.name} className={clsx(c.list)}>
            <Link to={list.name} className={clsx(c.listName, "icon-text-container")}>
              {list.icon ? <Icon className="icon" path={list.icon} size={1} /> : null}
              <span>{list.name}</span>
            </Link>

            <div className={c.actions}>
              <div>{list.items.length} items</div>
              <div className={"btn"}>Rename</div>
              <div className={clsx("btn", c.deleteBtn)}>Delete</div>
            </div>
          </div>
        ))}
      </Shell>
    </>
  );
}
