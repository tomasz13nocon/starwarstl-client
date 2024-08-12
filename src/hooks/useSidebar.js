import React from "react";
import { useSwipeable } from "react-swipeable";

export default function (setShow, preventSwipe) {
  const { ref: documentRef } = useSwipeable({
    onSwipedRight: (e) => {
      if (e.deltaX > 100 && !preventSwipe) {
        setShow(true);
      }
    },
    onSwipedLeft: (e) => {
      if (e.deltaX < -100 && !preventSwipe) {
        setShow(false);
      }
    },
  });

  React.useEffect(() => {
    documentRef(document);
    return () => documentRef({});
  });
}
