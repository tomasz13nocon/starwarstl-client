import * as Dialog from "@radix-ui/react-dialog";
import { Blurhash } from "react-blurhash";
import { imgAddress, Size } from "@/util";
import c from "./styles/mediaCover.module.scss";
import { useState } from "react";

export default function MediaCover({ src, alt, width, height, hash }) {
  const [open, setOpen] = useState(false);

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
    <Dialog.Root open={open} onOpenChange={(open) => setOpen(open)}>
      <Dialog.Trigger className={c.coverButton}>
        <Blurhash hash={hash} width={220} height={220 / (width / height)} />
        <img key={Math.random()} width={220} src={imgAddress(src)} alt={alt} className={c.cover} />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={c.overlay} />
        <Dialog.Content>
          <Dialog.Title>Full size {alt}</Dialog.Title>
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
