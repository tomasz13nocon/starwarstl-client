import { mdiOpenInNew } from "@mdi/js";
import Icon from "./icon";

export default function ExternalLink({ children, ...props }) {
  return (
    <a className="external" target="_blank" {...props}>
      {children}
      <Icon path={mdiOpenInNew} />
    </a>
  );
}
