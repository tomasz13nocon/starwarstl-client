import { mdiVolumeHigh } from "@mdi/js";
import Icon from "@mdi/react";
import React from "react";
import "./styles/faq.scss";

// TODO:  TOC
export default function Faq() {
  return (
    <div className="faq">
      <h1>Frequently Asked Questions</h1>
      <h2>I can't see any covers/images</h2>
      <p>
        The covers on this website are in{" "}
        <a href="https://en.wikipedia.org/wiki/WebP">WEBP</a> format, which
        allows them to be much smaller than the equivalent JPEGs at visually
        indistingushable quality. They most notably don't work on Safari with
        MacOS version &lt; 11, because for some reason Apple for the longest
        time didn't want to play with the other kids, but rather hold the
        technology of the internet back, so they only added support for it very
        recently.
      </p>
      <p>
        <strong>Solutions:</strong> Use an up to date version of a modern
        browser like chrome, edge, opera, firefox. Alternatively, if you're on a
        mac and want to keep using Safari, update your MacOS to a newer version
        (11 or higher).
      </p>

      <h2>Audiobooks vs Audio dramas</h2>
      <p>
        Audio dramas are productions that include a cast of actors and they're
        written as dramas with only dialogue, whereas audiobooks are read by a
        single narrator and written in prose. On the timeline audiobooks are
        categorized as <span className="type-indicator book-a">books</span> and
        marked with the speaker icon:
        <Icon
          path={mdiVolumeHigh}
          className="icon audiobook-icon"
          title="audiobook"
        />
        . <span className="type-indicator audio-drama">Audio dramas</span> are a
        seperate category.
      </p>
    </div>
  );
}
