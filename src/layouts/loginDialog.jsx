import * as Dialog from "@radix-ui/react-dialog";
import c from "./styles/loginDialog.module.scss";
import { useAuth } from "@/context/authContext";
import { useEffect, useState } from "react";
import Spinner from "@components/spinner";
import DialogContents from "@components/dialogContents";
import { useToast } from "@/context/toastContext";
import Button from "@components/button";
import Alert from "@components/alert";

export default function LoginDialog({ children, ...props }) {
  const { actions } = useAuth();
  const [screen, setScreen] = useState("login"); // login | signup | reset
  const [fetching, setFetching] = useState(false);
  const [alert, setAlert] = useState(null);
  const { pushToast } = useToast();

  // Clear messages when changing screens
  useEffect(() => {
    setAlert(null);
  }, [screen]);

  async function handleForm(e, action) {
    e.preventDefault();
    setAlert(null);
    setFetching(true);
    try {
      switch (action) {
        case "signup": {
          let res = await actions.signup(e.target.email.value, e.target.password.value);
          pushToast({
            title: "Account created.",
            description: "Confirmation email sent to: " + res.email,
          });
          break;
        }
        case "login": {
          let res = await actions.login(e.target.email.value, e.target.password.value);
          pushToast({
            title: "Logged in as " + res.email,
          });
          break;
        }
        case "reset": {
          let res = await actions.resetPassword(e.target.email.value);
          setAlert({ type: "info", message: res.message });
          break;
        }
      }
    } catch (e) {
      setAlert({ type: "error", message: e.message });
    } finally {
      setFetching(false);
    }
  }

  let form = null,
    title = null;
  if (screen === "login") {
    title = "Log in";
    form = (
      <form onSubmit={(e) => handleForm(e, "login")} className={c.form}>
        <Input type="email" name="email" required label="Email" />
        <Input type="password" name="password" required minLength={6} label="Password" />
        {/* <button type="button" className={c.forgot} onClick={() => setScreen("reset")}> */}
        {/*   Forgot password? */}
        {/* </button> */}
        <Button className={c.submit} disabled={fetching} primary>
          {fetching ? <Spinner /> : "Log in"}
        </Button>
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
      <form onSubmit={(e) => handleForm(e, "signup")} className={c.form}>
        <Input type="email" name="email" required label="Email" />
        <Input type="password" name="password" required minLength={6} label="Password" />
        <Button type="submit" className={c.submit} disabled={fetching} primary>
          {fetching ? <Spinner /> : "Sign up"}
        </Button>
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
      <form onSubmit={(e) => handleForm(e, "reset")} className={c.form}>
        <Input type="email" name="email" required minLength={4} label="Email" />
        <Button type="submit" className={c.submit} disabled={fetching} primary>
          {fetching ? <Spinner /> : "Reset password"}
        </Button>
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
        <Alert alert={alert} />
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
