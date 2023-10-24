import * as Dialog from "@radix-ui/react-dialog";
import { Blurhash } from "react-blurhash";
import { imgAddress, Size } from "@/util";
import c from "./styles/mediaCover.module.scss";
import { useState } from "react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useWindowSize } from "@hooks/useWindowSize";

export default function MediaCover({ src, alt, width, height, hash }) {
  const [open, setOpen] = useState(false);
  const [windowWidth, windowHeight] = useWindowSize();

  // Calculate dimensions we want to display (fits screen, maintains aspect ratio)
  // TODO on resize
  let fullCoverWidth, fullCoverHeight;
  if (width && height) {
    const margin = 20;
    let ar = width / height;
    let clampedW = Math.min(windowWidth - margin, width);
    let clampedH = Math.min(windowHeight - margin, height);
    fullCoverWidth = clampedH * ar;
    if (fullCoverWidth <= windowWidth - margin) {
      fullCoverHeight = clampedH;
    } else {
      fullCoverHeight = clampedW / ar;
      fullCoverWidth = clampedW;
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={(open) => setOpen(open)}>
      <Dialog.Trigger className={c.coverButton}>
        <Blurhash hash={hash} width={220} height={220 / (width / height)} />
        <img key={Math.random()} width={220} src={imgAddress(src)} alt={alt} className={c.cover} />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={c.overlay} />
        <Dialog.Content className={c.content}>
          <VisuallyHidden asChild>
            <Dialog.Title>Full size {alt}</Dialog.Title>
          </VisuallyHidden>
          <Blurhash
            className={c.blur}
            hash={hash}
            width={fullCoverWidth}
            height={fullCoverHeight}
          />
          <img
            src={imgAddress(src, Size.FULL)}
            width={fullCoverWidth}
            height={fullCoverHeight}
            className={c.coverFull}
            onClick={() => setOpen(false)}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
