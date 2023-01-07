import { mdiVolumeHigh } from "@mdi/js";
import { Icon } from "@mdi/react";
import React from "react";
import "./styles/faq.scss";

// TODO:  TOC
export default function Faq() {
  return (
    <div className="faq">
      <h2 className="faq-title">Frequently Asked Questions</h2>
      <h3>
        Something's incorrectly placed on the timeline/Some data is incorrect
      </h3>
      <p>
        All content on this timeline is sourced from{" "}
        <a href="https://starwars.fandom.com/wiki/Main_Page">Wookieepedia</a>.
        Please check{" "}
        <a href="https://starwars.fandom.com/wiki/Timeline_of_canon_media">
          Wookieepedia's timeline of canon media
        </a>{" "}
        or a specific media's article and see if the error also exists there. If it
        does you can edit the article. If you're new to editing a wiki check out{" "}
        <a href="https://starwars.fandom.com/wiki/Wookieepedia:Welcome,_newcomers">
          this page
        </a>
        . The change on Wookieepedia should be reflected on this website within a day
        {/* MENTION: script running interval */}.
      </p>
      <p>
        If you however see a mismatch of data between here and Wookieepedia you
        can message me at tomasz13nocon@gmail.com {/* different contanct info? */}
      </p>

      <h3>I can't see any covers/images</h3>
      <p>
        <strong>Solutions:</strong> Use an up to date version of a modern
        browser like chrome, edge, opera, firefox. Alternatively, if you're on a
        mac and want to keep using Safari, update your MacOS to a newer version
        (11 or higher).
      </p>
      <p>
        The covers on this website are in{" "}
        <a href="https://en.wikipedia.org/wiki/WebP">WEBP</a> format, which
        allows them to be much smaller than equivalent JPEGs. They most notably don't work on Safari with
        MacOS version &lt; 11.
      </p>

      <h3>Searching the page doesn't work</h3>
      <p>
        <strong>Solution:</strong> Please use the search button in the bottom right corner.
      </p>
      <p>
        In order to have a really fast and large table, table
        virtualization is employed, which means that only the visible portion of
        the table is rendered. This makes it really fast to filter, sort etc.
        but makes the native browser search not work.
      </p>

      {/* <h3>Audiobooks vs Audio dramas</h3> */}
      {/* <p> */}
      {/*   Audio dramas are productions that include a cast of actors and they're */}
      {/*   written as dramas with only dialogue, whereas audiobooks are read by a */}
      {/*   single narrator and written in prose. On the timeline audiobooks are */}
      {/*   categorized as <span className="type-indicator book-a">books</span> and */}
      {/*   marked with the speaker icon: */}
      {/*   <Icon */}
      {/*     path={mdiVolumeHigh} */}
      {/*     className="icon audiobook-icon" */}
      {/*     title="audiobook" */}
      {/*     /> */}
      {/*   . <span className="type-indicator audio-drama">Audio dramas</span> are a */}
      {/*   seperate category. */}
      {/* </p> */}

    </div>
  );
}
