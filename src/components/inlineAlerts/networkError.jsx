import MessageBox from "@components/inlineAlerts/messageBox";

export default function NetworkError({ msg = "Failed to fetch data from the server" }) {
  return (
    <MessageBox img="yoda">
      The dark side clouds everything.
      <br />
      Impossible to see, the server is.
      <br />
      <div className="error">{msg}</div>
    </MessageBox>
  );
}
