import MessageBox from "./messageBox";
import Ellipsis from "./ellipsis";

export default function Fetching() {
  return (
    <MessageBox img="jediTexts">
      Accessing sacred Jedi texts
      <Ellipsis />
    </MessageBox>
  );
}
