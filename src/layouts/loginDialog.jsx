import * as Dialog from "@radix-ui/react-dialog";
import c from "./styles/loginDialog.module.scss";
import { AuthContext } from "@/context/authContext";
import { useContext, useEffect, useState } from "react";
import Icon from "@mdi/react";
import { mdiClose } from "@mdi/js";
import Spinner from "@components/spinner";
import DialogContents from "@components/dialogContents";

export default function LoginDialog({ children, ...props }) {
  const { signup, login, resetPassword } = useContext(AuthContext);
  const [screen, setScreen] = useState("login"); // login | signup | reset
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  // Clear messages when changing screens
  useEffect(() => {
    setError("");
    setInfo("");
  }, [screen]);

  const handleSignup = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    setError("");
    setFetching(true);
    signup(email, password)
      .catch((e) => setError(e.message))
      .finally(() => setFetching(false));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    setError("");
    setFetching(true);
    login(email, password)
      .catch((e) => setError(e.message))
      .finally(() => setFetching(false));
  };

  const handleReset = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    setError("");
    setFetching(true);
    resetPassword(email)
      .then((msg) => setInfo(msg))
      .catch((e) => setError(e.message))
      .finally(() => setFetching(false));
  };

  let form = null,
    title = null;
  if (screen === "login") {
    title = "Log in";
    form = (
      <form onSubmit={handleLogin} className={c.form}>
        <Input type="email" name="email" required label="Email" />
        <Input type="password" name="password" required minLength={6} label="Password" />
        {/* <button type="button" className={c.forgot} onClick={() => setScreen("reset")}> */}
        {/*   Forgot password? */}
        {/* </button> */}
        <button className={c.submit + " btn"} disabled={fetching}>
          {fetching ? <Spinner /> : "Log in"}
        </button>
        <div>
          Don&apos;t have an account?{" "}
          <button type="button" className="link" onClick={() => setScreen("signup")}>
            Sign up
          </button>
        </div>
      </form>
    );
  } else if (screen === "signup") {
    title = "Sign up";
    form = (
      <form onSubmit={handleSignup} className={c.form}>
        <Input type="email" name="email" required label="Email" />
        <Input type="password" name="password" required minLength={6} label="Password" />
        <button type="submit" className={c.submit + " btn"} disabled={fetching}>
          {fetching ? <Spinner /> : "Sign up"}
        </button>
        <div>
          Already have an account?{" "}
          <button type="button" className="link" onClick={() => setScreen("login")}>
            Log in
          </button>
        </div>
      </form>
    );
  } else if (screen === "reset") {
    title = "Reset password";
    form = (
      <form onSubmit={handleReset} className={c.form}>
        <Input type="email" name="email" required minLength={4} label="Email" />
        <button type="submit" className={c.submit + " btn"} disabled={fetching}>
          {fetching ? <Spinner /> : "Reset password"}
        </button>
        <div>
          <button type="button" className="link" onClick={() => setScreen("login")}>
            Log in instead
          </button>
        </div>
      </form>
    );
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger {...props}>{children}</Dialog.Trigger>
      <DialogContents title={title}>
        {error && <div className="error">{error}</div>}
        {info && <div className="info">{info}</div>}
        {form}
      </DialogContents>
    </Dialog.Root>
  );
}

function Input({ label, ...props }) {
  return (
    <label>
      <span className={c.labelText}>{label}</span>
      <input {...props} className={c.input} />
    </label>
  );
}
