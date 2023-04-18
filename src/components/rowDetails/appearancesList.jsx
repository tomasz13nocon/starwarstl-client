// import "./styles/appearancesList.scss";

import { Fragment, useContext } from "react";
import WookieeLink from "@components/wookieeLink";
import { AppearancesContext } from "./context";
import { appearancesTemplateNames } from "@/util";

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
    return <>{appearances.Text.replaceAll(/\(\(.*?\)\)/g, "")}</>;
  } else if ("Template" in appearances) {
    // console.log("appearances.Template", appearances.Template);
    return (
      <small className={`apps-list-item-text ${appearances.Template.name.replaceAll(/\d/g, "")}`}>
        {appearancesTemplateNames[appearances.Template.name]}
      </small>
    );
  }
  return <>{console.log(appearances)}</>;
}
