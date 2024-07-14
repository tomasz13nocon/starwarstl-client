import Shell from "@layouts/shell";
import c from "./styles/settings.module.scss";
import { useAuth } from "@/context/authContext";
import Spinner from "@components/spinner";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@components/button";
import Alert from "@components/alert";
import { useLocalStorage } from "@hooks/useLocalStorage";
import { useAlert } from "@hooks/useAlert";

const resendEmailTimeout = 60_000;

export default function Settings() {
  const { fetchingAuth, user, actions } = useAuth();
  const { alert, setSuccess, setInfo, setError, resetAlert } = useAlert();
  const [fetching, setFetching] = useState(false);
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
    resetAlert(null);
    setFetching(true);
    try {
      let res = await actions.sendVerificationEmail();
      if (res.info) setInfo(res.info);
      else {
        setSuccess("Email sent!");
        setLastVerificationTime(Date.now());
        setVerificationTimeout(resendEmailTimeout / 1000);
      }
    } catch (e) {
      setError(e);
    } finally {
      setFetching(false);
    }
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
  // TODO use FetchButton
  return (
    <Shell>
      <h1>Settings</h1>

      <h2>Account</h2>
      {user?.emailUnverified && (
        <Alert type="warning">
          <div className={c.emailUnverifiedWarningText}>
            Your email is unverified. Please check your inbox for a verification email.
          </div>
          <Button
            className={c.resendEmailBtn}
            onClick={handleVerifyEmail}
            aria-busy={fetching}
            disabled={fetching || verificationTimeout > 0}
          >
            {fetching ? (
              <Spinner size={16} className={c.btnSpinner} />
            ) : (
              "Resend verification email" +
              (verificationTimeout > 0 ? ` (${verificationTimeout}s)` : "")
            )}
          </Button>
          <Alert alert={alert} slim />
        </Alert>
      )}
    </Shell>
  );
}
