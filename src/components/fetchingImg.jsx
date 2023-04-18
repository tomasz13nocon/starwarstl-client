import MessageImg from "./messageImg";
import Ellipsis from "./ellipsis";

export default function FetchingImg() {
  return (
    <MessageImg img="jediTexts">
      Accessing sacred Jedi texts
      <Ellipsis />
    </MessageImg>
  );
}
