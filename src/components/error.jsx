import MessageImg from "@components/messageImg";
import "./styles/error.scss";

export default function Error(p) {
  return (
    <MessageImg img="yoda">
      The dark side clouds everything.
      <br />
      Impossible to see, the server is.
      <br />
      <div className="error-msg-container">
        <div className="small">{p.details ?? "Failed to fetch data from the server"}</div>
      </div>
    </MessageImg>
  );
}
