import { useButton, useOverlayTrigger } from "react-aria";
import { useOverlayTriggerState } from "react-stately";
import { Blurhash } from "react-blurhash";
import { imgAddress, Size } from "@/util";
import Modal from "@components/modal";
import Dialog from "@components/dialog";
import "./styles/mediaCover.scss";

export default function MediaCover({ src, alt, width, height, hash }) {
  let state = useOverlayTriggerState({});
  let { triggerProps, overlayProps } = useOverlayTrigger({ type: "dialog" }, state);
  let { buttonProps } = useButton(triggerProps, triggerProps.buttonRef);

  // Calculate dimensions we want to display (fits screen, maintains aspect ratio)
  let fullCoverWidth, fullCoverHeight;
  if (width && height) {
    const margin = 20;
    let ar = width / height;
    let clampedW = Math.min(window.innerWidth - margin, width);
    let clampedH = Math.min(window.innerHeight - margin, height);
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
      <button className="reset-button cover-button" ref={triggerProps.buttonRef} {...buttonProps}>
        <Blurhash hash={hash} width={220} height={220 / (width / height)} />
        <img key={Math.random()} width={220} src={imgAddress(src)} alt={alt} className={"cover"} />
      </button>

      <Modal state={state} isDismissable>
        <Dialog {...overlayProps}>
          <Blurhash className="blur" hash={hash} width={fullCoverWidth} height={fullCoverHeight} />
          <img
            src={imgAddress(src, Size.FULL)}
            width={fullCoverWidth}
            height={fullCoverHeight}
            className="cover-full"
            onClick={state.close}
          />
        </Dialog>
      </Modal>
    </>
  );
}
