import AppearanceShield from "@components/rowDetails/appearanceShield";
import { Fragment } from "react";

export default function MatchedAppearances({ appearances, children }) {
  return (
    <div className="filter-indicator">
      {children}
      {appearances?.map((app, i) => (
        <Fragment key={app.name}>
          {i > 0 && " ⋅ "}
          <span>{app.name}</span>
          {app.t
            // ?.filter((t) => t.name === "1st" || t.name === "1stm")
            ?.map((t, j) => (
              <Fragment key={j}>
                {" "}
                <AppearanceShield template={t} />
              </Fragment>
            ))}
        </Fragment>
      ))}
    </div>
  );
}
