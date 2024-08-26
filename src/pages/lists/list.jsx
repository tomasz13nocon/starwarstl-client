import { useAuth } from "@/context/authContext";
import c from "./styles/list.module.scss";
import { useParams } from "react-router-dom";
import Spinner from "@components/spinner";
import clsx from "clsx";
import Icon from "@components/icon";
import { mdiDelete } from "@mdi/js";
import { useState } from "react";
import NotFound from "@/notFound";
import Alert from "@components/alert";
import Unauthenticated from "@components/inlineAlerts/unauthenticated";
import { useToast } from "@/context/toastContext";
import { createListActionToast, plural } from "@/util";
import { produce } from "immer";
import { useFetch } from "@hooks/useFetch";
import FetchButton from "@components/fetchButton";
import ListName from "@components/listName";
import Tooltip from "@components/tooltip";
import WookieeLink from "@components/wookieeLink";

function Item({ item, list, setList }) {
  const { actions } = useAuth();
  const { pushToast } = useToast();
  const [fetchRemove, fetchingRemove] = useFetch(actions.removeFromList, { toastOnError: true });

  async function removeFromList(item) {
    await fetchRemove(list.name, [item.pageid]);
    setList(
      produce((draft) => {
        draft.items.splice(
          draft.items.findIndex((v) => v.pageid === item.pageid),
          1,
        );
      }),
    );
    pushToast(createListActionToast("removed", list.name, item));
  }

  return (
    <div className={c.listItem} key={item.pageid}>
      <FetchButton fetching={fetchingRemove} onClick={() => removeFromList(item)}>
        <span className="icon-text-container">
          <Icon path={mdiDelete} />
          <span className={c.removeText}>Remove</span>
        </span>
      </FetchButton>
      <div className={clsx(item.type, item.fullType, c.listItemTitle)}>{item.title}</div>
      <WookieeLink title={item.title} />
    </div>
  );
}

export default function List() {
  const { listName } = useParams();
  const { fetchingAuth, user, actions } = useAuth();
  const [list, setList] = useState(null);
  const [_, fetching, alert] = useFetch(actions.getList.bind(null, listName), {
    onMount: true,
    onSuccess: (res) => setList(res),
  });

  // const [fetchGetList, fetching, alert] = useFetch(actions.getList);
  //
  // useEffect(() => {
  //   fetchGetList(listName).then((res) => setList(res));
  // }, []);

  if (fetchingAuth || fetching) return <Spinner size={36} />;
  if (!user) return <Unauthenticated />;
  if (alert) return <Alert alert={alert} />;
  if (!list) return <NotFound />;

  return (
    <>
      <div className={c.header}>
        <h2>
          <ListName name={list.name} iconSize={1.5} />
        </h2>
        <div>
          {list.items.length} {plural("item", list.items.length)}
          {list.missingItems?.length > 0 && (
            <small style={{ marginLeft: "0.5rem", fontSize: "0.75em" }}>
              ({list.missingItems.length} missing)
            </small>
          )}
        </div>
      </div>
      <div className={c.listItemsContainer}>
        {list.items.map((item) => (
          <Item item={item} key={item.pageid} list={list} setList={setList} />
        ))}
        {list.missingItems?.length > 0 && (
          <div>
            <h3 className={c.missingHeading}>
              Missing items{" "}
              <Tooltip info side="right">
                {
                  "These items are in this list, but they've been removed from Wookieepedia's timeline and therefore this timeline."
                }
                <br />
                Possible reasons:
                <ul>
                  <li>
                    It was split into multiple items, like a comic book containg multiple stories,
                    or an upcoming TV show being replaced with individual episodes.
                  </li>
                  <li>It was deemed to not have an original story.</li>
                  <li>In rare cases it could be a bug in the bot.</li>
                </ul>
              </Tooltip>
            </h3>
            <div className={c.missingItems}>
              {list.missingItems?.map((item) => (
                <Item item={item} key={item.pageid} list={list} setList={setList} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
