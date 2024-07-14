import { Suspense } from "react";
import { Await } from "react-router-dom";

export default function SuspenseAwait({ children, fallback, ...props }) {
  return (
    <Suspense fallback={fallback}>
      <Await {...props}>{children}</Await>
    </Suspense>
  );
}
