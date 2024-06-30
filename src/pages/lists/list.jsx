import { useAuth } from "@/context/authContext";
import c from "./styles/list.module.scss";
import { useParams } from "react-router-dom";
import Shell from "@layouts/shell";

export default function List() {
  const { user } = useAuth();
  const { listName } = useParams();

  // TODO if user null, show login form or sth

  const list = user.lists.find((list) => list.name === listName);

  if (!list) {
    // TODO show 404?
  }

  // TODO Layout for Lists subroutes to show Shell and h1 Lists

  // TODO we need access to rawData here. Consider react router's loader

  return (
    <Shell>
      <h2>{list.name}</h2>
      <div>{/* {list.items.map(pageid => )} */}</div>
    </Shell>
  );
}
