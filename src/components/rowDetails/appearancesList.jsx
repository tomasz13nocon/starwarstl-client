// import "./styles/appearancesList.scss";

import { Fragment, useContext } from "react";
import WookieeLink from "@components/wookieeLink";
import { AppearancesContext } from "./context";
import AppearanceShield from "./appearanceShield";

export default function AppearancesNode({ appearances }) {
  const { hideMentions, hideIndirectMentions, hideFlashbacks, hideHolograms } =
    useContext(AppearancesContext);

  if ("List" in appearances) {
    return (
      <ul className="apps-list">
        {appearances.List.map((nodes, i) => {
          return (
            <li key={i} className="apps-list-item">
              {nodes.map((node, j) => (
                <Fragment key={j}>
                  <AppearancesNode appearances={node} />
                </Fragment>
              ))}
            </li>
          );
        })}
      </ul>
    );
  } else if ("Link" in appearances) {
    return <WookieeLink title={appearances.Link.target}>{appearances.Link.text}</WookieeLink>;
  } else if ("Text" in appearances) {
    return <>{appearances.Text}</>;
  } else if ("Template" in appearances) {
    let hidden =
      (hideMentions && appearances.Template.name === "Mo") ||
      (hideIndirectMentions && appearances.Template.name === "Imo") ||
      (hideFlashbacks && appearances.Template.name === "Flash") ||
      (hideHolograms && appearances.Template.name === "Hologram");
    return <AppearanceShield template={appearances.Template} hidden={hidden} />;
  }

  // unreachable
  if (import.meta.env.PROD) return null;
  throw new Error("Unknown appearances node: " + JSON.stringify(appearances));
}
