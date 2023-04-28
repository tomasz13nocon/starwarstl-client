import "./styles/error.scss";

export default function ErrorSmall({ msg }) {
  return (
    <div className="error-msg-container">
      <div className="small">{msg ?? "Failed to fetch data from the server"}</div>
    </div>
  );
}
