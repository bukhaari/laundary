import {
  configureStore,
  combineReducers,
  getDefaultMiddleware,
} from "@reduxjs/toolkit";
import AuthReducer from "./modules/auth";
import BranchReducer from "./modules/Branch";
import { apiCall } from "./middleware/API";

const store = configureStore({
  reducer: combineReducers({
    auth: AuthReducer,
    branches: BranchReducer,
  }),
  middleware: [...getDefaultMiddleware(), apiCall],
});

export default store;
