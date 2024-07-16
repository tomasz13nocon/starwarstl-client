import c from "./styles/selectedActions.module.scss";

export default function SelectedActions({ selected }) {
  return <div className={c.container}>{selected.size} items selected.</div>;
}
