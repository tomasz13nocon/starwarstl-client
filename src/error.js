import React from "react";

export default function Error({ children }) {
  if (children === null || children === undefined || children === "")
    return null;
  return <div className="error-box">{children}</div>;
}
