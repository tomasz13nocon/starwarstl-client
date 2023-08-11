import * as Dialog from "@radix-ui/react-dialog";
import classes from "./styles/loginDialog.module.scss";
import { AuthContext } from "@/context/authContext";
import { useContext, useState } from "react";
import Icon from "@mdi/react";
import { mdiClose } from "@mdi/js";
import Spinner from "@components/spinner";
import Error from "@components/error";

export default function LoginDialog() {
  const { signup, login } = useContext(AuthContext);
  const [screen, setScreen] = useState("login"); // login | signup | reset
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState("");

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
    // TODO
  };

  let form = null,
    title = null;
  if (screen === "login") {
    title = "Log in";
    form = (
      <form onSubmit={handleLogin}>
        <Input type="email" name="email" required label="Email" />
        <Input type="password" name="password" required minLength={6} label="Password" />
        <button type="button" className={classes.forgot} onClick={() => setScreen("reset")}>
          Forgot password?
        </button>
        <button className={classes.submit + " btn"} disabled={fetching}>
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
      <form onSubmit={handleSignup}>
        <Input type="email" name="email" required label="Email" />
        <Input type="password" name="password" required minLength={6} label="Password" />
        <button type="submit" className={classes.submit + " btn"} disabled={fetching}>
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
      <form onSubmit={handleReset}>
        <Input type="email" name="email" required minLength={4} label="Email" />
        <button type="submit" className={classes.submit + " btn"} disabled={fetching}>
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
      <Dialog.Trigger className={classes.trigger + " btn-inv"}>Log in</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={classes.overlay} />
        <Dialog.Content className={classes.content}>
          <div className={classes.header}>
            <Dialog.Title className={classes.title}>{title}</Dialog.Title>
            <Dialog.Close className={classes.close}>
              <Icon className={`icon`} path={mdiClose} size={1.5} />
            </Dialog.Close>
          </div>
          {error && <Error msg={error} />}
          {form}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function Input({ label, ...props }) {
  return (
    <label>
      <span className={classes.labelText}>{label}</span>
      <input {...props} className={classes.input} />
    </label>
  );
}
