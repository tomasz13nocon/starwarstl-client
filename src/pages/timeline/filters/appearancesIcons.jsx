import Icon from "@mdi/react";
import "./styles/appearancesIcons.scss";
import { appearancesIcons } from "@/util";
import { mdiLoading } from "@mdi/js";

export default function AppearancesIcons({ handleClick, activeCategory, fetching }) {
  return (
    <div className="appearances-icons">
      {Object.entries(appearancesIcons).map(([name, icon]) => (
        <button
          key={name}
          className={`appearances-icon ${activeCategory === name ? "active" : ""}`}
          onClick={() => handleClick(name)}
        >
          {fetching === name ? (
            <Icon path={mdiLoading} className="icon loading" alt={name} />
          ) : (
            <Icon path={icon} className="icon" alt={name} />
          )}
        </button>
      ))}
    </div>
  );
}
