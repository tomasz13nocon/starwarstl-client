import React from "react";
import c from "./styles/episodeNumber.module.scss";

export default function EpisodeNumber({ item, children }) {
  if (!item.episode && !item.season) return null;

  return (
    <>
      <span
        title={`${item.season ? `season ${item.season}` : ""}${
          item.seasonNote ? ` ${item.seasonNote}` : ""
        }${item.episode ? `\nepisode ${item.episode}` : ""}`.trim()}
        className={c.seasonEpisode}
      >
        {children ?? item.se}
      </span>
    </>
  );
}
