import { apiBegan } from "../../Actions";
import { EndPoints } from "../endpoints";

export const GROUP_REQUEST = (data, method) => {
  return apiBegan({
    config: {
      url: `${EndPoints.user}/groups`,
      data,
      method,
    },
  });
};
export const USER_REQUEST = (data, method) => {
  return apiBegan({
    config: {
      url: `${EndPoints.user}`,
      data,
      method,
    },
  });
};
export const PASS_RESET = (data) => {
  return apiBegan({
    config: {
      url: `${EndPoints.user}/ForceChangepass`,
      data,
      method: "post",
    },
  });
};
export const PASS_CHANGE = (data) => {
  return apiBegan({
    config: {
      url: `${EndPoints.user}/changepass`,
      data,
      method: "post",
    },
  });
};
