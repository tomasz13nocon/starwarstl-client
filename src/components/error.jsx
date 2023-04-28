import MessageImg from "@components/messageImg";
import "./styles/error.scss";
import ErrorSmall from "./errorSmall";

export default function Error({ msg }) {
  return (
    <MessageImg img="yoda">
      The dark side clouds everything.
      <br />
      Impossible to see, the server is.
      <br />
      <ErrorSmall msg={msg} />
    </MessageImg>
  );
}
