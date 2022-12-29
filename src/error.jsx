import React from "react";
import MessageImg from "./messageImg";

export default function Error() {
  return (
    <MessageImg img="yoda">
      The dark side clouds everything.
      <br/>
      Impossible to see, the server is.
      <br/>
      <span className="small">(Error fetching data from the server)</span>
    </MessageImg>
  );
}
