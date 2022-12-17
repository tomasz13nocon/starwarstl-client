import React from "react";

export default function Spinner() {
  return (
    <div className="spinner-container">
      <div className="lds-dual-ring"></div>
      <div className="spinner-text">Reaching out to the force...</div>
    </div>
  );
}
