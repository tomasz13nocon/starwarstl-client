import { appearancesCategoriesNames, appearancesIcons } from "@/util";
import Icon from "@components/icon";
import { mdiLoading } from "@mdi/js";
import c from "./styles/appearancesIcons.module.scss";
import clsx from "clsx";

export default function AppearancesIcons({ handleClick, activeCategory, fetching }) {
  return (
    <div className={c.appearancesIcons}>
      {Object.entries(appearancesIcons).map(([name, icon]) => (
        <button
          key={name}
          className={clsx(c.appearancesIcon, activeCategory === name && c.active)}
          onClick={() => handleClick(name)}
          title={appearancesCategoriesNames[name]}
        >
          {fetching === name ? (
            <Icon path={mdiLoading} size={null} className={clsx(c.icon, c.spin)} alt={name} />
          ) : (
            <Icon path={icon} size={null} className={c.icon} alt={name} />
          )}
        </button>
      ))}
    </div>
  );
}
