import Icon from "./icon";
import c from "./styles/iconText.module.scss";

// TODO should this really be a component? For something that is clearly just one css class?
export default function IconText({ after = false, children, ...props }) {
  let icon = <Icon {...props} />;
  return (
    <>
      {!after && icon}
      <span>{children}</span>
      {after && icon}
    </>
  );
}
