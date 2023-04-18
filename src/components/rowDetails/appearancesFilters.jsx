import Checkbox from "@components/checkbox";
import { useContext } from "react";
import { AppearancesContext } from "./context";

export default function AppearancesFilters() {
  const {
    hideMentions,
    toggleHideMentions,
    hideIndirectMentions,
    toggleHideIndirectMentions,
    hideFlashbacks,
    toggleHideFlashbacks,
  } = useContext(AppearancesContext);

  return (
    <div className="apps-filters">
      <Checkbox name="Hide mentions" value={hideMentions} onChange={toggleHideMentions} />
      <Checkbox
        name="Hide indirect mentions"
        value={hideIndirectMentions}
        onChange={toggleHideIndirectMentions}
      />
      <Checkbox name="Hide flashbacks" value={hideFlashbacks} onChange={toggleHideFlashbacks} />
    </div>
  );
}
