import React from "react";

export default function Ellipsis() {
  const [num, setNum] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setNum(s => s > 2 ? 0 : s+1), 200);
    return () => clearInterval(id);
  }, []);
  return (
    <>
      <span style={{visibility:num > 0 ? "visible" : "hidden"}}>.</span>
      <span style={{visibility:num > 1 ? "visible" : "hidden"}}>.</span>
      <span style={{visibility:num > 2 ? "visible" : "hidden"}}>.</span>
    </>
  );
  // return ".".repeat(num) + "\xa0".repeat(3 - num); // nbsp
}
