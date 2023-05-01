import { createContext } from "react";

export const AppearancesContext = createContext({
  hideMentions: false,
  hideIndirectMentions: false,
  hideFlashbacks: false,
  hideHolograms: false,
});
