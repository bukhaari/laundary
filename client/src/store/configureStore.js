import {
  configureStore,
  combineReducers,
  getDefaultMiddleware,
} from "@reduxjs/toolkit";
import AuthReducer from "./modules/auth";
import BranchReducer from "./modules/Branch";
import ServiceReducer from "./modules/service";
import EmployeesReducer from "./modules/Employees";
import { apiCall } from "./middleware/API";

const store = configureStore({
  reducer: combineReducers({
    auth: AuthReducer,
    branches: BranchReducer,
    services: ServiceReducer,
    employees: EmployeesReducer,
  }),
  middleware: [...getDefaultMiddleware(), apiCall],
});

export default store;
