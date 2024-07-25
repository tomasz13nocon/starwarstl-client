import Shell from "@layouts/shell";
import c from "./styles/settings.module.scss";
import { useAuth } from "@/context/authContext";
import Spinner from "@components/spinner";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "@components/alert";
import { useLocalStorage } from "@hooks/useLocalStorage";
import { useFetch } from "@hooks/useFetch";
import FetchButton from "@components/fetchButton";

const resendEmailTimeout = 60_000;

export default function Settings() {
  const { fetchingAuth, user, actions } = useAuth();
  const [fetchVerifyEmail, fetching, alert] = useFetch(actions.sendVerificationEmail, {
    successAlert: "Email sent!",
  });
  const [lastVerificationTime, setLastVerificationTime] = useLocalStorage(
    "lastEmailVerificationTime",
    0,
  );
  const [verificationTimeout, setVerificationTimeout] = useState(
    Math.round(Math.max(0, lastVerificationTime + resendEmailTimeout - Date.now()) / 1000),
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (!fetchingAuth && !user) {
      navigate("/timeline");
    }
  }, [fetchingAuth, user]);

  const handleVerifyEmail = async () => {
    await fetchVerifyEmail();
    setLastVerificationTime(Date.now());
    setVerificationTimeout(resendEmailTimeout / 1000);
  };

  useEffect(() => {
    let intervalID = setInterval(() => {
      setVerificationTimeout((old) => {
        let newTimeout = Math.max(0, old - 1);
        // This technically makes this function unpure, but surely it's fine (clearInterval is idempotent)
        if (newTimeout === 0) clearInterval(intervalID);
        return newTimeout;
      });
    }, 1000);

    return () => clearInterval(intervalID);
  }, [lastVerificationTime]);

  if (fetchingAuth) {
    return (
      <Shell>
        <h1>Settings</h1>
        <Spinner />
      </Shell>
    );
  }

  return (
    <Shell>
      <h1>Settings</h1>

      <h2>Account</h2>
      {user?.emailUnverified && (
        <Alert type="warning">
          <div className={c.emailUnverifiedWarningText}>
            Your email is unverified. Please check your inbox for a verification email.
          </div>
          <FetchButton
            className={c.resendEmailBtn}
            onClick={handleVerifyEmail}
            fetching={fetching}
            disabled={verificationTimeout > 0}
          >
            Resend verification email
            {verificationTimeout > 0 ? ` (${verificationTimeout}s)` : ""}
          </FetchButton>
          <Alert alert={alert} slim />
        </Alert>
      )}
    </Shell>
  );
}
