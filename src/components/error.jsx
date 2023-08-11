import c from "./styles/error.module.scss";

export default function Error({ msg = "An unknown error occured" }) {
  return <div className={c.errorMsgContainer}>{msg}</div>;
}
