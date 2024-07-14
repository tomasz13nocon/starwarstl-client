import { createContext, useCallback, useContext, useEffect, useReducer, useState } from "react";
import { listIcons, fetchHelper } from "@/util";
import { produce } from "immer";
import _ from "lodash";

const AuthContext = createContext({});

export const useAuth = () => {
  return useContext(AuthContext);
};

const userReducer = produce((draft, action) => {
  switch (action.type) {
    case "set": {
      // We need to clone because we can't mutate reducer payload
      let clonedUser = _.cloneDeep(action.user);
      if (clonedUser) {
        for (let list of clonedUser.lists) {
          if (list.name in listIcons) list.icon = listIcons[list.name].default;
        }
      }
      return clonedUser;
    }

    case "unset": {
      return null;
    }

    case "addToList": {
      let list = draft.lists.find((list) => list.name === action.listName);
      list.items.push(action.pageid);
      break;
    }

    case "removeFromList": {
      let list = draft.lists.find((list) => list.name === action.listName);
      let idIndex = list.items.findIndex((v) => v === action.pageid);
      if (idIndex !== -1) list.items.splice(idIndex, 1);
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

  const signup = useCallback(async (email, password) => {
    let res = await fetchHelper("auth/signup", "POST", { email, password });

    dispatchUser({ type: "set", user: res });
    return res;
  }, []);

  const login = useCallback(async (email, password) => {
    let res = await fetchHelper("auth/login", "POST", { email, password });

    dispatchUser({ type: "set", user: res });
    return res;
  }, []);

  const logout = useCallback(async () => {
    await fetchHelper("auth/logout", "POST");

    dispatchUser({ type: "unset" });
  }, []);

  const sendVerificationEmail = useCallback(async () => {
    return await fetchHelper("auth/email-verification", "POST");
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
      if (list.name in listIcons) list.icon = listIcons[list.name].default;
      return list;
    } catch (e) {
      if (e.status === 404) return null;
      throw e;
    }
  }, []);

  // This optimistic update implementation has a race condition,
  // but it's a corner case where you spam add/remove on a list that's already been deleted
  // Fixable with Aborts

  // Optimistic
  const addToList = useCallback(async (listName, pageid) => {
    dispatchUser({ type: "addToList", listName, pageid });

    try {
      await fetchHelper("lists/" + encodeURIComponent(listName), "POST", { pageid });
    } catch (e) {
      dispatchUser({ type: "removeFromList", listName, pageid });
      throw e;
    }
  }, []);

  // Optimistic
  const removeFromList = useCallback(async (listName, pageid) => {
    dispatchUser({ type: "removeFromList", listName, pageid });

    try {
      await fetchHelper("lists/" + encodeURIComponent(listName) + "/" + pageid, "DELETE");
    } catch (e) {
      dispatchUser({ type: "addToList", listName, pageid });
      throw e;
    }
  }, []);

  const createList = useCallback(async (listName) => {
    const createdList = await fetchHelper("lists", "POST", { name: listName });

    dispatchUser({ type: "createList", createdList });
  }, []);

  const renameList = useCallback(async (listName, newListName) => {
    await fetchHelper("lists/" + encodeURIComponent(listName), "PATCH", {
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
          logout,
          sendVerificationEmail,
          verifyEmail,
          resetPassword,
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
