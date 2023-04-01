import React from "react";
import { useSwipeable } from "react-swipeable";

export default function (setShow) {
  const { ref: documentRef } = useSwipeable({
    onSwipedRight: (e) => {
      if (e.deltaX > 100) {
        setShow(true);
      }
    },
    onSwipedLeft: (e) => {
      if (e.deltaX < -100) {
        setShow(false);
      }
    },
  });

  React.useEffect(() => {
    documentRef(document);
    return () => documentRef({});
  });
}
