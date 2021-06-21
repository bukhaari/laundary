import axios from "axios";
import * as actions from "../Actions";
import { logOutAction } from "../modules/auth";
// import { allReq } from "../../axiosfiles/axios-outh";
axios.defaults.baseURL = "/api-v1";

export const apiCall = ({ dispatch, getState }) => (next) => async (action) => {
  // console.log(getState());

  return new Promise(async (resolve, reject) => {
    if (action.type !== actions.apiBegan.type) {
      resolve(action.type);
      return next(action);
    }
    const { config, onStart, customSuccess, onError } = action.payload;

    try {
      if (onStart) dispatch({ type: onStart });
      next(action);
      let token = getState().auth.authKey;
      // console.log(token);

      axios.defaults.headers.common["athorization"] = token;
      const response = await axios.request(config);
      dispatch({ type: actions.onSuccess.type, payload: response.data });
      if (customSuccess)
        dispatch({ type: customSuccess, payload: response.data });
      resolve(response);
      // return response.data;
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 401) {
        dispatch(logOutAction());
      }
      let errMsg = {
        message: error && error.response && error.response.data,
        status:
          (error && error.status) || (error.response && error.response.status),
      };
      dispatch({ type: actions.OnError.type, payload: errMsg });
      if (onError) dispatch({ type: onError, payload: errMsg });
      reject(errMsg);
    }
  });
};
