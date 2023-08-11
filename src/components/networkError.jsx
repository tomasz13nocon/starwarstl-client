import MessageBox from "@components/messageBox";
import Error from "./error";

export default function NetworkError({ msg = "Failed to fetch data from the server" }) {
  return (
    <MessageBox img="yoda">
      The dark side clouds everything.
      <br />
      Impossible to see, the server is.
      <br />
      <Error msg={msg} />
    </MessageBox>
  );
}
