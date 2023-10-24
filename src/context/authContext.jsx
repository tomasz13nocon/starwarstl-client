import { createContext, useContext, useEffect, useState } from "react";
import { API } from "@/util";
import { jsonErrors } from "@/fetch";

export const AuthContext = createContext({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    // TODO network error unhandled
    setFetching(true);
    fetch(API + "auth/user")
      .then((res) => jsonErrors(res))
      .then((json) => {
        setUser(json);
      })
      .finally(() => setFetching(false));
  }, []);

  const signup = async (email, password) => {
    let res = await fetch(API + "auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    let json = await jsonErrors(res);
    setUser(json);
  };

  const login = async (email, password) => {
    let res = await fetch(API + "auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    let json = await jsonErrors(res);
    setUser(json);
  };

  const logout = async () => {
    let res = await fetch(API + "auth/logout", {
      method: "POST",
    });
    await jsonErrors(res);
    setUser(null);
  };

  const sendVerificationEmail = async () => {
    let res = await fetch(API + "auth/email-verification", {
      method: "POST",
    });
    await jsonErrors(res);
  };

  return (
    <AuthContext.Provider
      value={{ fetching, user, setUser, signup, login, logout, sendVerificationEmail }}
    >
      {children}
    </AuthContext.Provider>
  );
};
