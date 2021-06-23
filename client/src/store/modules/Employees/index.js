import { apiBegan } from "../../Actions";
import { EndPoints } from "../endpoints";
import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";

const slice = createSlice({
  name: "employees",
  initialState: {
    list: [],
  },
  reducers: {
    employeesReceived: (employees, { payload }) => {
      employees.list = payload;
      return employees;
    },
    employeesAdded: (employees, action) => {
      employees.list.push(action.payload);
      return employees;
    },
    employeesUpdated: (employees, action) => {
      employees.list = employees.list.map((oldemployee) =>
        action.payload._id === oldemployee._id
          ? { ...oldemployee, ...action.payload }
          : oldemployee
      );
      return employees;
    },
  },
});

export default slice.reducer;

export const getAllEmployees = createSelector(
  (state) => state.employees,
  (employees) => employees.list
);

export const loadEmployees = () => {
  return apiBegan({
    config: {
      url: EndPoints.employees,
      method: "get",
    },
    customSuccess: slice.actions.employeesReceived.type,
  });
};

export const addNewEmployee = (data) => {
  return apiBegan({
    config: {
      url: EndPoints.employees,
      data,
      method: "post",
    },
    customSuccess: slice.actions.employeesAdded.type,
  });
};

export const updateEmployee = (data) => {
  return apiBegan({
    config: {
      url: EndPoints.employees,
      data,
      method: "put",
    },
    customSuccess: slice.actions.employeesUpdated.type,
  });
};
