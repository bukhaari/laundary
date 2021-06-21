import { colors } from "@material-ui/core";
import { createSlice, createSelector } from "@reduxjs/toolkit";
import { apiBegan } from "../Actions";

class MyStorage {
  #preFix = "Loaundry-";

  links = this.#preFix + "links";
  user = this.#preFix + "user";
  settings = this.#preFix + "settings";
  branchInfo = this.#preFix + "currentBranch";
  token = this.#preFix + "token";
  #Storage = null;

  constructor(strg = localStorage) {
    this.#Storage = strg;
  }
  getItem = (key, parse = true) =>
    parse ? JSON.parse(this.#Storage.getItem(key)) : this.#Storage.getItem(key);
  setItem = (key, value, parse = true) =>
    this.#Storage.setItem(key, parse ? JSON.stringify(value) : value);
  removeItem = (key) => this.#Storage.removeItem(key);
}

let { getItem, setItem, removeItem, ...StrgKeys } = new MyStorage();

const Storagelinks = getItem(StrgKeys.links);
const StorageUser = getItem(StrgKeys.user);
const StorageSettings = getItem(StrgKeys.settings);
const StorageToken = getItem(StrgKeys.token, false);

const initialState = {
  user: {
    systemName: "Loundary System",
    userName: null,
    FullName: null,
    UserType: null,
    ...StorageUser,
  },
  settings: {
    appParColor: colors.orange[400],
    textColor: "black",
    sideColor: colors.orange[400],
    title: "Loundary App",
    duration: 500,
    loginHeadColor: "#1c6691",
    loginColor: "#ffff",
    ...StorageSettings,
  },
  branchInfo: getItem(StrgKeys.branchInfo),
  links: Storagelinks || [],
  authKey: StorageToken,
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    successLogin: (state, { payload }) => {
      state.settings = { ...state.settings, ...payload.User.settings };
      state.user = payload.User.user;
      state.links = payload.User.links;
      state.authKey = payload.token;

      state.branchInfo = payload.User.branchInfo || null;
      setItem(StrgKeys.branchInfo, state.branchInfo);

      setItem(StrgKeys.settings, state.settings);
      setItem(StrgKeys.user, state.user);
      setItem(StrgKeys.links, state.links);
      setItem(StrgKeys.token, state.authKey, false);
      return state;
    },
    openBranch: (state, { payload }) => {
      removeItem(StrgKeys.token);

      state.branchInfo = payload.User.branchInfo;
      setItem(StrgKeys.branchInfo, state.branchInfo);

      state.user = { ...state.user, ...payload.User.user };
      state.links = payload.User.links;
      state.authKey = payload.token;

      setItem(StrgKeys.user, state.user);
      setItem(StrgKeys.links, state.links);
      setItem(StrgKeys.token, state.authKey, false);
      return state;
    },
    backToHQ: (state, { payload }) => {
      state.user = { ...state.user, ...payload.User.user };
      state.links = payload.User.links;
      state.authKey = payload.token;
      state.branchInfo = null;
      removeItem(StrgKeys.branchInfo);
      setItem(StrgKeys.user, state.user);
      setItem(StrgKeys.links, state.links);
      setItem(StrgKeys.token, state.authKey, false);
      return state;
    },
    logOutAction: (state) => {
      removeItem(StrgKeys.links);
      removeItem(StrgKeys.user);
      removeItem(StrgKeys.token);
      removeItem(StrgKeys.branchInfo);
      state.branchInfo = null;
      state.links = [];
      state.user = {
        systemName: "Loundary System",
        userName: null,
        FullName: null,
        UserType: null,
      };
      state.authKey = null;
      return state;
    },

    setUsser: (state, { payload }) =>
      (state.user = {
        ...state.user,
        ...payload,
      }),
    setSettings: (state, { payload }) =>
      (state.settings = {
        ...state.settings,
        ...payload,
      }),
  },
});

export const getSettings = createSelector(
  (state) => state.auth.settings,
  (settings) => settings
);
export const isAuthenticated = createSelector(
  (state) => state.auth.authKey,
  (outh) => outh
);

export const getUser = createSelector(
  (state) => state.auth.user,
  (user) => user
);
export const getBranches = createSelector(
  (state) => state.auth.branchInfo,
  (branch) => branch
);
export const getLinks = createSelector(
  (state) => state.auth.links,
  (links) => {
    if (process.env.NODE_ENV === "development") return links;
    return links.filter((link) => link.title !== "New Company");
  }
);

export const {
  setUsser,
  setSettings,
  successLogin,
  logOutAction,
} = slice.actions;
export default slice.reducer;

export const loginCall = ({ userName, password }) => {
  let data = {
    userName,
    password,
  };
  return apiBegan({
    config: {
      url: "/login",
      data,
      method: "post",
    },
    customSuccess: successLogin.type,
  });
};
export const switchBranch = (data) => {
  return apiBegan({
    config: {
      url: "/login/SuperAdmin",
      data,
      method: "post",
    },
    customSuccess: slice.actions.openBranch.type,
  });
};
export const baranchExit = () => {
  return apiBegan({
    config: {
      url: "/login/switchAccount",
      method: "get",
    },
    customSuccess: slice.actions.backToHQ.type,
  });
};
