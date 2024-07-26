import * as SeparatorRadix from "@radix-ui/react-separator";
import c from "./styles/separator.module.scss";

export default function Separator({ ...props }) {
  return <SeparatorRadix.Root className={c.separator} {...props} />;
}
