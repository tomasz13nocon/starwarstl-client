import React from "react";
import "./styles/footer.scss";

export default function Footer() {
  return (
    <footer>
      <div className="footer-container">
        <div className="legal">
          {/* <p>This website contains affiliate links.</p> */}
          <p>
            All text content describing Star Wars media, as well as the{" "}
            <a href="https://starwars.fandom.com/wiki/File:Wiki-shrinkable.png">
              Wookieepedia icon
            </a>{" "}
            come from <a href="https://starwars.fandom.com/">Wookieepedia</a>, and are licensed
            under{" "}
            <a href="https://creativecommons.org/licenses/by-sa/3.0/">
              Creative Commons Attribution-ShareAlike 3.0 Unported license
            </a>
            .
          </p>
          <p>
            Timeline order and basic information about media come from{" "}
            <a href="https://starwars.fandom.com/wiki/Timeline_of_canon_media">
              Wookieepedia&apos;s timeline of canon media
            </a>
            . Detailed information about media comes from respective articles linked to with a
            Wookieepedia icon next to that media&#39;s title.
          </p>
          <p>
            Images showcasing the media, like covers and screenshots, are used under Fair Use
            policy.
          </p>
          <p>
            For more information see the{" "}
            <a href="https://starwars.fandom.com/wiki/Wookieepedia:Copyrights">
              Copyright page on Wookieepedia
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
