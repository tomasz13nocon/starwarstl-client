import { createContext, useEffect, useState } from "react";
import { API } from "@/util";

export const AuthContext = createContext({});

// Return json from response and throw error if present
async function jsonErrors(res) {
  let json = await res.json();
  if (!res.ok || json?.error) throw new Error(json.error ?? "An unknown error occured");
  return json;
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // TODO network error unhandled
    fetch(API + "auth/user")
      .then((res) => jsonErrors(res))
      .then((json) => {
        setUser(json);
      });
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

  return (
    <AuthContext.Provider value={{ user, signup, login, logout }}>{children}</AuthContext.Provider>
  );
};
