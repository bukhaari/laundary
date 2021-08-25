import { apiBegan } from "../../Actions";
import { EndPoints } from "../endpoints";

export const getClient = (id) => {
  return apiBegan({
    config: {
      url: EndPoints.client + "/" + id,
      method: "get",
    },
  });
};

export const getAllClient = (id) => {
  return apiBegan({
    config: {
      url: EndPoints.client,
      method: "get",
    },
  });
};
