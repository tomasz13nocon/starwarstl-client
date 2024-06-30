import { createContext, useContext, useEffect, useState } from "react";
import { API, watchedName, watchlistName } from "@/util";
import { jsonErrors } from "@/fetch";
import { ToastContext } from "./toastContext";
import { mdiClockOutline, mdiEyeOutline } from "@mdi/js";

export const AuthContext = createContext({});

export const useAuth = () => {
  return useContext(AuthContext);
};

const listIcons = {
  Watched: mdiEyeOutline,
  Watchlist: mdiClockOutline,
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [fetchingAuth, setFetchingAuth] = useState(true);
  const { pushToast } = useContext(ToastContext);

  useEffect(() => {
    console.log("EFFECT");
    setFetchingAuth(true);
    fetch(API + "auth/user")
      .then((res) => (res.status === 401 ? null : jsonErrors(res)))
      .then((json) => {
        if (json !== null) {
          for (let list of json.lists) {
            if (list.name in listIcons) list.icon = listIcons[list.name];
          }
          console.log(json.lists);
          setUser(json);
        }
      })
      .catch((e) => {
        // network or server error
        console.log(e);
      })
      .finally(() => setFetchingAuth(false));
  }, []);

  const signup = async (email, password) => {
    let res = await fetch(API + "auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    let json = await jsonErrors(res);
    setUser(json);
    pushToast({
      title: "Account created. Confirmation email sent to: " + json.email,
    });
  };

  const login = async (email, password) => {
    let res = await fetch(API + "auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    let json = await jsonErrors(res);
    setUser(json);
    pushToast({
      title: "Logged in as " + json.email,
    });
  };

  const logout = async () => {
    let res = await fetch(API + "auth/logout", {
      method: "POST",
    });
    await jsonErrors(res);
    setUser(null);
    pushToast({
      title: "Logged out",
    });
  };

  const sendVerificationEmail = async () => {
    let res = await fetch(API + "auth/email-verification", {
      method: "POST",
    });
    return await jsonErrors(res);
  };

  const resetPassword = async () => {
    let res = await fetch(API + "auth/reset-password", {
      method: "POST",
    });
    await jsonErrors(res);
    return res.message;
  };

  return (
    <AuthContext.Provider
      value={{
        fetchingAuth,
        user,
        setUser,
        signup,
        login,
        logout,
        sendVerificationEmail,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
