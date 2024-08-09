import { createContext, useCallback, useContext, useEffect, useReducer, useState } from "react";
import { fetchHelper } from "@/util";
import { produce } from "immer";

const AuthContext = createContext({});

export const useAuth = () => {
  return useContext(AuthContext);
};

const userReducer = produce((draft, action) => {
  switch (action.type) {
    case "set": {
      return action.user;
    }

    case "unset": {
      return null;
    }

    case "setName": {
      draft.name = action.name;
      break;
    }

    case "setLists": {
      draft.lists = action.lists;
      break;
    }

    case "addToList": {
      let list = draft.lists.find((list) => list.name === action.listName);
      list.items = Array.from(new Set([...list.items, ...action.pageids]));
      break;
    }

    case "removeFromList": {
      let list = draft.lists.find((list) => list.name === action.listName);
      list.items = list.items.filter((pageid) => !action.pageids.includes(pageid));
      // for (let i = list.items.length; i >= 0; i--) {
      //   if (action.pageids.includes(list.items[i])) list.items.splice(i, 1);
      // }
      // let idIndex = list.items.findIndex((v) => v === action.pageid);
      // if (idIndex !== -1) list.items.splice(idIndex, 1);
      break;
    }

    case "createList": {
      draft.lists.push(action.createdList);
      break;
    }

    case "renameList": {
      draft.lists.find((list) => list.name === action.listName).name = action.newListName;
      break;
    }

    case "deleteList": {
      let listIndex = draft.lists.findIndex((list) => list.name === action.listName);
      if (listIndex !== -1) draft.lists.splice(listIndex, 1);
      break;
    }
  }
});

export const AuthProvider = ({ children }) => {
  const [user, dispatchUser] = useReducer(userReducer, null);
  const [fetchingAuth, setFetchingAuth] = useState(true);

  useEffect(() => {
    setFetchingAuth(true);
    (async () => {
      try {
        let res = await fetchHelper("auth/user");

        dispatchUser({ type: "set", user: res });
      } catch (e) {
        if (e.status === 401) return;

        // 500 or network error
        // TODO perhaps show a global error box here
        console.error("Failed to authenticate", e.status, e.message);
      } finally {
        setFetchingAuth(false);
      }
    })();
  }, []);

  const signup = useCallback(async (email, name, password) => {
    let res = await fetchHelper("auth/signup", "POST", { email, name, password });

    dispatchUser({ type: "set", user: res });
    return res;
  }, []);

  const login = useCallback(async (email, password) => {
    let res = await fetchHelper("auth/login", "POST", { email, password });

    dispatchUser({ type: "set", user: res });
    return res;
  }, []);

  const loginWithGoogle = useCallback(async () => {
    return await fetchHelper("auth/login/google");
  }, []);

  const changeName = useCallback(async (name) => {
    await fetchHelper("auth/user", "PATCH", { name });

    dispatchUser({ type: "setName", name });
  }, []);

  const logout = useCallback(async () => {
    await fetchHelper("auth/logout", "POST");

    dispatchUser({ type: "unset" });
  }, []);

  const sendVerificationEmail = useCallback(async () => {
    try {
      await fetchHelper("auth/email-verification", "POST");
    } catch (e) {
      if (e.status === 410) return { info: "Email already verified. Please refresh the browser." };
      throw e;
    }
  }, []);

  const verifyEmail = useCallback(async (token) => {
    let res = await fetchHelper("auth/email-verification/" + token);

    if (res.info) return res;
    else dispatchUser({ type: "set", user: res });
  }, []);

  const resetPassword = useCallback(async () => {
    return await fetchHelper("auth/reset-password", "POST");
  }, []);

  const getList = useCallback(async (listName) => {
    try {
      let list = await fetchHelper("lists/" + encodeURIComponent(listName));
      return list;
    } catch (e) {
      if (e.status === 404) return null;
      throw e;
    }
  }, []);

  const isNameAvailable = useCallback(async (name) => {
    try {
      await fetchHelper("auth/users/" + name);
      return false;
    } catch (e) {
      if (e.status === 404) return true;
      throw e;
    }
  }, []);

  // This optimistic update implementation has a race condition,
  // but it's a corner case where you spam add/remove on a list that's already been deleted
  // Fixable with Aborts

  // Optimistic
  const addToList = useCallback(async (listName, pageids) => {
    dispatchUser({ type: "addToList", listName, pageids });

    try {
      let res = await fetchHelper("lists/" + encodeURIComponent(listName), "POST", { pageids });
      dispatchUser({ type: "setLists", lists: res.lists });
    } catch (e) {
      dispatchUser({ type: "removeFromList", listName, pageids });
      throw e;
    }
  }, []);

  // Optimistic
  const removeFromList = useCallback(async (listName, pageids) => {
    dispatchUser({ type: "removeFromList", listName, pageids });

    try {
      await fetchHelper("lists/" + encodeURIComponent(listName), "PATCH", {
        action: "removeItems",
        pageids,
      });
    } catch (e) {
      dispatchUser({ type: "addToList", listName, pageids });
      throw e;
    }
  }, []);

  const createList = useCallback(async (listName) => {
    const createdList = await fetchHelper("lists", "POST", { name: listName });

    dispatchUser({ type: "createList", createdList });
  }, []);

  const renameList = useCallback(async (listName, newListName) => {
    await fetchHelper("lists/" + encodeURIComponent(listName), "PATCH", {
      action: "renameList",
      name: newListName,
    });

    dispatchUser({ type: "renameList", listName, newListName });
  }, []);

  const deleteList = useCallback(async (listName) => {
    await fetchHelper("lists/" + encodeURIComponent(listName), "DELETE");

    dispatchUser({ type: "deleteList", listName });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        fetchingAuth,
        user,
        actions: {
          signup,
          login,
          loginWithGoogle,
          logout,
          sendVerificationEmail,
          verifyEmail,
          changeName,
          resetPassword,
          isNameAvailable,
          getList,
          addToList,
          removeFromList,
          createList,
          renameList,
          deleteList,
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
