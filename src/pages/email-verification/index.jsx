// import classes from "./styles/emailVerification.module.scss";

import Error from "@components/error";
import { useLoaderData } from "react-router-dom";

export default function EmailVerificaiton() {
  const verification = useLoaderData();
  return verification.error ? (
    <Error msg={verification.error} />
  ) : (
    <div>
      <h1>Email Verification successful</h1>
    </div>
  );
}
