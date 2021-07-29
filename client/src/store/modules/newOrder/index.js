import { apiBegan } from "../../Actions";
import { EndPoints } from "../endpoints";

export const addNewOrder = (data) => {
  return apiBegan({
    config: {
      url: EndPoints.newOrder,
      data,
      method: "post",
    },
  });
};
