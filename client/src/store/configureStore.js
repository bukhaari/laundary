import {
  configureStore,
  combineReducers,
  getDefaultMiddleware,
} from "@reduxjs/toolkit";
import AuthReducer from "./modules/auth";
import BranchReducer from "./modules/Branch";
import ServiceReducer from "./modules/service";
import EmployeesReducer from "./modules/Employees";
import Order from "./modules/Order";
import { apiCall } from "./middleware/API";

const store = configureStore({
  reducer: combineReducers({
    auth: AuthReducer,
    branches: BranchReducer,
    services: ServiceReducer,
    employees: EmployeesReducer,
    Order: Order,
  }),
  middleware: [...getDefaultMiddleware(), apiCall],
});

export default store;
