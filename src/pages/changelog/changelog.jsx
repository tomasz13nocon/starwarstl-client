import Shell from "@layouts/shell";
import c from "./styles/changelog.module.scss";
// import Markdown from "react-markdown";
// import changelogMd from "./changelog.md?raw";

export default function Changelog() {
  return (
    <Shell>
      <main className={c.changelog}>
        <h1 className={c.title}>Changelog</h1>

        <VersionChangelog version="0.5" releaseDate="2023-??-??">
          <ul>
            <li>Added this changelog page</li>
            <li>
              User accounts:
              <ul>
                <li>You can now mark media as seen, or add them to your watchlist.</li>
              </ul>
            </li>
            <li>
              Added a feedback form. If you see a bug, or have ideas about improving the website, I
              would love to hear about it!
            </li>
            <li>
              Fixed "Collapse adjacent episodes" sometimes breaking the website.{" "}
              <small className={c.tinyNote}>(error boundary? never heard of her)</small>
            </li>
            <li>Fixed date range filter breaking if "From" date was after "To" date.</li>
          </ul>
        </VersionChangelog>

        <article className={c.versionSection}>
          <h2 className={`${c.versionNumber} ${c.versionHeading}`}>Prior to 0.5</h2>
          <ul>
            <li>
              Appearances!
              <ul>
                <li>
                  Every media has a list of all its appearances. Click on a title in the timeline,
                  then click "Show appearances"
                </li>
                <li>You can hide mentions, flashback, and hologram appearances.</li>
                <li>
                  You can filter the timeline by appearances, use the icons underneath the filter
                  input box.
                </li>
                <li>
                  With multiple appearances filters, ANY match will result in showing the media.
                  Check "Must include all" to require ALL your appearances filters to match in order
                  to show the media.
                </li>
                <li>You can also exclude mentions, flashbacks, and holograms from the search.</li>
              </ul>
            </li>
            <li>State of filters is now remembered across sessions.</li>
            <li>You can now reset all filters with a single button.</li>
            <li>
              Multiple entries linking to a single article in wookieepedia timeline are now
              correctly displayed (like BF2 missions)
            </li>
            <li>
              Timeline range:
              <ul>
                <li>
                  You can now select a range of years to display in the timeline. This accepts years
                  like "5 BBY" or "5 ABY" ("-5" and "5" also work).
                </li>
                <li>You can also switch to a release date range, like "2005-05-19".</li>
                <li>
                  In both cases you can put titles of media like "Star Wars: Episode III Revenge of
                  the Sith". The title has to be exact. If the background of the input box turns
                  blue, that means it's working.
                </li>
                <li>There's a couple of premade ranges availible.</li>
              </ul>
            </li>
            <li>Many wookieepedia script improvements.</li>
          </ul>
        </article>
      </main>
    </Shell>
  );
}

function VersionChangelog({ version, releaseDate, children }) {
  return (
    <article className={c.versionSection}>
      <hgroup className={c.versionHeading}>
        <h2 className={c.versionNumber}>Version {version}</h2>
        <h3 className={c.releaseDate}>{releaseDate}</h3>
      </hgroup>
      {children}
    </article>
  );
}
