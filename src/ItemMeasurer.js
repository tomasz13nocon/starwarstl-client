import React from "react";

// This basically calls `measure` (from virutalItem) whenever the element resizes
// stolen from: https://github.com/TanStack/react-virtual/issues/28#issuecomment-817182500
export default function ItemMeasurer({ children, measure, tagName, ...restProps }) {
  const roRef = React.useRef(null);
  const elRef = React.useRef(null);

  const measureRef = React.useRef(measure);
  measureRef.current = measure;

  const refSetter = React.useCallback((el) => {
    const ro = roRef.current;

    if (ro !== null && elRef.current !== null) {
      ro.unobserve(elRef.current);
    }

    elRef.current = el;

    if (ro !== null && elRef.current !== null) {
      ro.observe(elRef.current);
    }
  }, []);

  React.useLayoutEffect(() => {
    const update = () => {
      measureRef.current(elRef.current);
    };

    // sync measure for initial render ?
    update();

    const ro = roRef.current ? roRef.current : new ResizeObserver(update);

    const el = elRef.current;
    if (el !== null) {
      ro.observe(el);
    }
    roRef.current = ro;

    return () => {
      ro.disconnect();
    };
  }, []);

  const Tag = tagName;

  return (
    <Tag ref={refSetter} {...restProps}>
      {children}
    </Tag>
  );
};
