import { appearancesTemplateNames } from "@/util";
import AppearancesNode from "./appearancesList";

const displayParamsTemplates = ["1stID", "1st", "1stm", "C"];
const simultaneousTemplates = ["1st", "1stm"];

export default function AppearanceShield({ template, hidden = false }) {
  let prettyName = appearancesTemplateNames[template.name];
  return (
    prettyName !== undefined && (
      <small
        className={`apps-list-item-text ${template.name.replaceAll(/\d/g, "")} ${
          hidden ? "hidden" : ""
        }`}
      >
        {prettyName}
        {displayParamsTemplates.includes(template.name) && !!template.parameters[0]?.value[0] && (
          <>
            {simultaneousTemplates.includes(template.name) && ", simultaneous with "}
            {template.parameters[0].value.map((node, i) => (
              <AppearancesNode key={i} appearances={node} />
            ))}
          </>
        )}
      </small>
    )
  );
}
