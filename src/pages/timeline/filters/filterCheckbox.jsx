import React from "react";
import Checkbox from "@components/checkbox";
import { blurIfMouse } from "@/util";
import Icon from "@components/icon";
import c from "./styles/filterCheckbox.module.scss";
import clsx from "clsx";

export default React.memo(function FilterCheckbox({
  name,
  value,
  onChange,
  path,
  indeterminate = false,
  icon,
  iconOnClick,
  wrapperClassName,
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
        onChange={(to) => onChange({ path: path, to: to })}
        indeterminate={indeterminate}
        wrapperClassName={clsx(c[`level${(path?.match(/\./g) || []).length}`], wrapperClassName)}
        textClassName={clsx(path && c.typeIndicatorFilter, path && path.split(".").pop())}
        labelProps={{ onContextMenu: path === undefined ? undefined : solo }}
      >
        {icon !== undefined && <Icon onClick={iconOnClick} path={icon} className="expand-button" />}
      </Checkbox>
    </>
  );
});
