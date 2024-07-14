import Checkbox from "@components/checkbox";
import { useContext } from "react";
import { AppearancesContext } from "./context";
import c from "./styles/appearances.module.scss";

export default function AppearancesSettings() {
  const {
    hideMentions,
    toggleHideMentions,
    hideIndirectMentions,
    toggleHideIndirectMentions,
    hideFlashbacks,
    toggleHideFlashbacks,
    hideHolograms,
    toggleHideHolograms,
  } = useContext(AppearancesContext);

  return (
    <div className={c.appsFilters}>
      <Checkbox name="Hide mentions" value={hideMentions} onChange={toggleHideMentions} />
      <Checkbox
        name="Hide indirect mentions"
        value={hideIndirectMentions}
        onChange={toggleHideIndirectMentions}
      />
      <Checkbox name="Hide flashbacks" value={hideFlashbacks} onChange={toggleHideFlashbacks} />
      <Checkbox name="Hide holograms" value={hideHolograms} onChange={toggleHideHolograms} />
    </div>
  );
}
