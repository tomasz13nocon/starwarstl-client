import Shell from "@layouts/shell";
import c from "./styles/settings.module.scss";
import { useAuth } from "@/context/authContext";
import Spinner from "@components/spinner";
import { useEffect, useRef, useState } from "react";
import Alert from "@components/alert";
import { useLocalStorage } from "@hooks/useLocalStorage";
import { useFetch } from "@hooks/useFetch";
import FetchButton from "@components/fetchButton";
import Unauthenticated from "@components/inlineAlerts/unauthenticated";
import Icon from "@components/icon";
import { mdiTick } from "@/util";
import { mdiClose } from "@mdi/js";
import clsx from "clsx";

const resendEmailTimeout = 60_000;

export default function Settings() {
  const { fetchingAuth, user } = useAuth();

  if (fetchingAuth) {
    return (
      <Shell>
        <h1>Settings</h1>
        <Spinner />
      </Shell>
    );
  }
  if (!user) return <Unauthenticated />;

  return (
    <Shell>
      <h1>Settings</h1>
      <h2>Account</h2>
      {user.authType === "email" && user.emailUnverified && <VerifyEmail user={user} />}
      <AccountSettings />
    </Shell>
  );
}

function AccountSettings() {
  const { user, actions } = useAuth();
  const [newName, setNewName] = useState(user.name);
  const [nameAvailable, setNameAvailable] = useState(null);
  const [fetchIsNameAvailable, fetchingIsNameAvailable] = useFetch(actions.isNameAvailable, {
    toastOnError: true,
  });
  const [fetchChangeName, fetchingChangeName, changeNameAlert] = useFetch(actions.changeName, {
    successAlert: "Changed username successfully",
  });
  const nameChangeTimeoutId = useRef(null);

  function handleNewNameChange(e) {
    setNewName(e.target.value);
    setNameAvailable(null);

    if (nameChangeTimeoutId.current) clearTimeout(nameChangeTimeoutId.current);
    if (e.target.value !== user.name && e.target.value.length >= 3 && e.target.value.length <= 32) {
      nameChangeTimeoutId.current = setTimeout(async () => {
        const res = await fetchIsNameAvailable(e.target.value);
        setNameAvailable(res);
      }, 500);
    }
  }

  const nameValid = newName.length >= 3 && newName.length <= 32;
  const readyToChangeName = nameValid && nameAvailable && newName !== user.name;

  function handleApply() {
    if (readyToChangeName) {
      fetchChangeName(newName);
    }
  }

  return (
    <div className={c.accountSettings}>
      <div className={c.setting}>
        <div className={c.usernameLabel}>
          <span className={c.label}>Username:</span>
          <small>Between 3 and 32 characters</small>
        </div>
        <div>
          <input
            type="text"
            value={newName}
            onChange={handleNewNameChange}
            className={clsx(!nameValid && c.error)}
            minLength={3}
            maxLength={32}
          />
          {fetchingIsNameAvailable ? (
            <Spinner />
          ) : (
            <>
              {readyToChangeName && <Icon path={mdiTick} className={c.allowed} size={1.2} />}
              {nameAvailable === false && (
                <span className={c.notAllowed}>
                  <Icon path={mdiClose} size={1.2} /> Username taken
                </span>
              )}
            </>
          )}
        </div>
      </div>
      <Alert alert={changeNameAlert} className={c.alert} />
      <FetchButton
        className={c.applyButton}
        disabled={!readyToChangeName}
        onClick={handleApply}
        fetching={fetchingChangeName}
      >
        Apply
      </FetchButton>
    </div>
  );
}

function VerifyEmail() {
  const { actions } = useAuth();
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

  const handleVerifyEmail = async () => {
    await fetchVerifyEmail();
    setLastVerificationTime(Date.now());
    setVerificationTimeout(resendEmailTimeout / 1000);
  };

  useEffect(() => {
    const intervalID = setInterval(() => {
      setVerificationTimeout((old) => {
        const newTimeout = Math.max(0, old - 1);
        // This technically makes this function unpure, but surely it's fine (clearInterval is idempotent)
        if (newTimeout === 0) clearInterval(intervalID);
        return newTimeout;
      });
    }, 1000);

    return () => clearInterval(intervalID);
  }, [lastVerificationTime]);

  return (
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
  );
}
