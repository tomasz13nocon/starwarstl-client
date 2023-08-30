import c from "./styles/index.module.scss";

import { useLoaderData } from "react-router-dom";

export default function EmailVerificaiton() {
  const verification = useLoaderData();
  return (
    <div className={c.container}>
      {verification.error ? (
        <div className="error center">{verification.error}</div>
      ) : (
        <div className="success">Email verification successful</div>
      )}
    </div>
  );
}
