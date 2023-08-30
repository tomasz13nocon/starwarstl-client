import { createContext, useContext, useEffect, useState } from "react";
import { API } from "@/util";

export const AuthContext = createContext({});

// Return json from response and throw error if present
async function jsonErrors(res) {
  let json = await res.json();
  if (!res.ok || json?.error) throw new Error(json.error ?? "An unknown error occured");
  return json;
}

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
    <AuthContext.Provider value={{ fetching, user, signup, login, logout, sendVerificationEmail }}>
      {children}
    </AuthContext.Provider>
  );
};
