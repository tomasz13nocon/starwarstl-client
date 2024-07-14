import Spinner from "./spinner";
import Button from "./button";
import c from "./styles/fetchButton.module.scss";
import clsx from "clsx";

export function FetchButton({ fetching, disabled = false, className, children, ...props }) {
  return (
    <Button
      disabled={fetching || disabled}
      className={clsx(c.button, fetching && c.fetching, className)}
      {...props}
    >
      {fetching && <Spinner className={c.fetchingIcon} size={20} />}
      <span className={c.content}>{children}</span>
    </Button>
  );
}
