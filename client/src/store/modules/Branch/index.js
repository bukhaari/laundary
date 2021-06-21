import { apiBegan } from "../../Actions";
import { EndPoints } from "../endpoints";
import { createSlice, createSelector } from "@reduxjs/toolkit";

const slice = createSlice({
  initialState: {
    list: [],
  },
  name: "branches",
  reducers: {
    SaveBaranches: (state, { payload }) => {
      state.list = payload;
      return state;
    },
    AddBranch: (state, { payload }) => {
      state.list.push(payload);
      return state;
    },
    Update: (state, { payload }) => {
      state.list = state.list.map((branch) =>
        payload._id === branch._id ? { ...branch, ...payload } : branch
      );
      return state;
    },
  },
});

export default slice.reducer;

export const getAllBranches = createSelector(
  (state) => state.branches.list,
  (list) => list
);

export const loadBranches = (data) => {
  let params = { filter: {}, range: [0, 9], sort: ["id", 1], ...data };

  return apiBegan({
    config: {
      url: EndPoints.branch,
      params,
      method: "get",
    },
    customSuccess: slice.actions.SaveBaranches.type,
  });
};

export const addNewBranch = (data) => {
  return apiBegan({
    config: {
      url: EndPoints.branch,
      data,
      method: "post",
    },
    customSuccess: slice.actions.AddBranch.type,
  });
};

export const updateBrunch = (data) => {
  return apiBegan({
    config: {
      url: EndPoints.branch,
      data,
      method: "put",
    },
    customSuccess: slice.actions.Update.type,
  });
};
