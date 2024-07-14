import MessageBox from "./messageBox";

export default function Unauthenticated() {
  return (
    <MessageBox img="sith">
      At last we will reveal ourselves to the Jedi.
      <br />
      <span style={{ fontStyle: "normal" }}>
        Reveal your identity by logging in to view this page.
      </span>
    </MessageBox>
  );
}
