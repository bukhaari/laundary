import { apiBegan } from "../../Actions";
import { EndPoints } from "../endpoints";

export const getPayment = (id) => {
  return apiBegan({
    config: {
      url: EndPoints.payment + "/" + id,
      method: "get",
    },
  });
};

export const updatePayment = (data) => {
  return apiBegan({
    config: {
      url: EndPoints.payment,
      data,
      method: "put",
    },
  });
};
