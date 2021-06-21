import { apiBegan } from "../../Actions";
import { EndPoints } from "../endpoints";
import { createSlice, createSelector } from "@reduxjs/toolkit";

const slice = createSlice({
  initialState: {
    list: [],
  },
  name: "services",
  reducers: {
    servicesReceived: (bugs, action) => {
      bugs.list = action.payload;
    },
    servicesAdded: (bugs, action) => {
      bugs.list.push(action.payload);
      return state;
    },
    servicesUpdated: (state, action) => {
      state.list = state.list.map((service) =>
        action.payload._id === service._id
          ? { ...service, ...action.payload }
          : service
      );
      return state;
    },
  },
});

export default slice.reducer;

export const getAllService = createSelector(
  (state) => state.services.list,
  (list) => list
);

export const loadServices = () =>
  apiBegan({
    config: {
      url: EndPoints.branch,
      data,
      method: "post",
    },
    customSuccess: slice.actions.servicesReceived.type,
  });

export const addNewService = (data) => {
  return apiBegan({
    config: {
      url: EndPoints.service,
      data,
      method: "post",
    },
    customSuccess: slice.actions.servicesAdded.type,
  });
};

export const updateService = (data) => {
  return apiBegan({
    config: {
      url: EndPoints.service,
      data,
      method: "put",
    },
    customSuccess: slice.actions.servicesUpdated.type,
  });
};
