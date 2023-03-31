import React from "react";
import { Icon } from "@mdi/react";
import Checkbox from "../../../components/checkbox";
import { blurIfMouse } from "../../../util";
// import "./styles/checkbox.scss"; // TODO resolve

export default React.memo(function FilterCheckbox({
  name,
  value,
  onChange,
  path,
  indeterminate = false,
  icon,
  iconOnClick,
}) {
  const solo = (e) => {
    onChange({ path: path.split(".")[0], to: false });
    onChange({ path: path, to: true });
    blurIfMouse(e);
    e.preventDefault();
  };

  return (
      <>
        <Checkbox
          name={name}
          value={value}
          onChange={to => onChange({ path: path, to: to })}
          indeterminate={indeterminate}
          wrapperClassName={`level-${(path?.match(/\./g) || []).length}`}
          textClassName={`${path ? "type-indicator-filter" : ""} ${path ? path.split(".").pop() : ""}`}
          labelProps={{onContextMenu: path === undefined ? undefined : solo}}
        >
          {icon !== undefined && (
            <Icon
              onClick={iconOnClick}
              path={icon}
              className="icon expand-button"
            />
          )}
        </Checkbox>
      </>
    );
  });
