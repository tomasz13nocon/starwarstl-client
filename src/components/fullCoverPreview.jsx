import React from "react";
import { Blurhash } from "react-blurhash";
import { CSSTransition } from "react-transition-group";
import { imgAddress, Size } from "@/util";

export default function FullCoverPreview({ fullCover, setFullCover }) {
  const nodeRef = React.useRef();

  React.useEffect(() => {
    return document.addEventListener(
      "keydown",
      (e) => {
        if (e.key === "Escape") setFullCover((prev) => ({ ...prev, show: false }));
      },
      false
    );
  }, []);

  // Calculate dimensions we want to display (fits screen, maintains aspect ratio)
  let fullCoverWidth, fullCoverHeight;
  if (fullCover.width && fullCover.height) {
    const margin = 40;
    let ar = fullCover.width / fullCover.height;
    let clampedW = Math.min(window.innerWidth - margin, fullCover.width);
    let clampedH = Math.min(window.innerHeight - margin, fullCover.height);
    fullCoverWidth = clampedH * ar;
    if (fullCoverWidth <= window.innerWidth - margin) {
      fullCoverHeight = clampedH;
    } else {
      fullCoverHeight = clampedW / ar;
      fullCoverWidth = clampedW;
    }
  }

  return (
    <>
      <CSSTransition
        in={fullCover.show}
        timeout={200}
        classNames="full-image-parent"
        mountOnEnter
        unmountOnExit
        nodeRef={nodeRef}
      >
        <div
          ref={nodeRef}
          className="full-image-container"
          onClick={() => setFullCover({ ...fullCover, show: false })}
        >
          <div className="full-image-helper">
            <img
              src={imgAddress(fullCover.name, Size.FULL)}
              width={fullCoverWidth}
              height={fullCoverHeight}
              className="cover"
            />
            <Blurhash
              className="blur"
              hash={fullCover.hash}
              width={fullCoverWidth}
              height={fullCoverHeight}
            />
          </div>
        </div>
      </CSSTransition>
    </>
  );
}
