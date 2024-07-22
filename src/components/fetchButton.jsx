import Spinner from "./spinner";
import Button from "./button";
import c from "./styles/fetchButton.module.scss";
import clsx from "clsx";
import { forwardRef } from "react";

export default forwardRef(function FetchButton(
  { fetching, disabled = false, noSpinner, className, children, ...props },
  ref,
) {
  return (
    <Button
      disabled={fetching || disabled}
      className={clsx(c.button, fetching && !noSpinner && c.fetching, className)}
      ref={ref}
      {...props}
    >
      {fetching && !noSpinner ? (
        <>
          <Spinner className={c.fetchingIcon} size={20} />
          {/* render content and hide it, to maintain button size with spinner over it */}
          <span className={c.content}>{children}</span>
        </>
      ) : (
        children
      )}
    </Button>
  );
});
