import { apiBegan } from "../../Actions";
import { EndPoints } from "../endpoints";
import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";

const slice = createSlice({
  name: "services",
  initialState: {
    list: [],
  },
  reducers: {
    servicesReceived: (services, { payload }) => {
      services.list = payload;
      return services;
    },
    servicesAdded: (state, action) => {
      state.list.push(action.payload);
      return state;
    },
    servicesUpdated: (state, action) => {
      state.list = state.list.map((oldState) =>
        action.payload._id === oldState._id
          ? { ...oldState, ...action.payload }
          : oldState
      );
      return state;
    },
  },
});

export default slice.reducer;

export const getAllService = createSelector(
  (state) => state.services,
  (services) => services.list
);

export const loadServices = () => {
  return apiBegan({
    config: {
      url: EndPoints.service,
      method: "get",
    },
    customSuccess: slice.actions.servicesReceived.type,
  });
};

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
