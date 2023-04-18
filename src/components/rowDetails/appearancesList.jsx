// import "./styles/appearancesList.scss";

import { Fragment, useContext } from "react";
import WookieeLink from "@components/wookieeLink";
import { AppearancesContext } from "./context";

// ul
//  li
//    span
//    ul
//      li
//        ...
//  li
//    ...

export default function AppearancesNode({ appearances }) {
  const { hideMentions, hideIndirectMentions, hideFlashbacks } = useContext(AppearancesContext);

  // console.log("appearances", appearances);
  if ("List" in appearances) {
    return (
      <ul className="apps-list">
        {appearances.List.map((nodes, i) => {
          // Split nodes because we want to style only the "text" part (span),
          // without the contained list, based on templates
          let nodesFlat = nodes.filter((node) => !("List" in node));
          let nodesList = nodes.filter((node) => "List" in node);
          return (
            <li key={i} className="apps-list-item">
              <span className="apps-list-item-text">
                {nodesFlat.map((node, j) => (
                  <Fragment key={j}>
                    <AppearancesNode appearances={node} />
                  </Fragment>
                ))}
              </span>
              {nodesList.map((node, j) => (
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
    return <>{appearances.Text.replaceAll(/\(\(.*?\)\)/g, "")}</>;
  } else if ("Template" in appearances) {
    // console.log("appearances.Template", appearances.Template);
    return <span data-template={appearances.Template.name} />;
  }
  return <>{console.log(appearances)}</>;
}
