import Icon from "@mdi/react";
import "./styles/appearancesIcons.scss";
import {
  mdiAccount,
  mdiCat,
  mdiRobot,
  mdiCalendar,
  mdiEarth,
  mdiMapMarker,
  mdiMedal,
  mdiShape,
  mdiFamilyTree,
  mdiSpaceStation,
  mdiSwordCross,
} from "@mdi/js";

const appearancesIcons = {
  characters: mdiAccount,
  creatures: mdiCat,
  droids: mdiRobot,
  events: mdiCalendar,
  locations: mdiMapMarker,
  organizations: mdiMedal,
  species: mdiFamilyTree,
  vehicles: mdiSpaceStation,
  technology: mdiSwordCross,
  miscellanea: mdiShape,
};

export default function AppearancesIcons({ handleClick }) {
  return (
    <div className="appearances-icons">
      {Object.entries(appearancesIcons).map(([name, icon]) => (
        <button key={name} className="appearances-icon" onClick={() => handleClick(name)}>
          <Icon path={icon} size={0.8333333333} className="icon" alt={name} />
        </button>
      ))}
    </div>
  );
}
