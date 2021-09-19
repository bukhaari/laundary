import { apiBegan } from "../../Actions";
import { EndPoints } from "../endpoints";
import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";

const slice = createSlice({
  name: "orderList",
  initialState: {
    list: [],
  },
  reducers: {
    orderListReceived: (orderList, { payload }) => {
      orderList.list = payload;
      return orderList;
    },
    orderListAdded: (orderList, action) => {
      orderList.list.push(action.payload);
      return orderList;
    },
    orderListUpdated: (orderList, action) => {
      orderList.list = orderList.list.map((oldOrderList) =>
        action.payload._id === oldOrderList._id
          ? { ...oldOrderList, ...action.payload }
          : oldOrderList
      );
      return orderList;
    },
  },
});

export default slice.reducer;

export const getOrderList = createSelector(
  (state) => state.orderList,
  (orderList) => orderList.list
);

export const loadOrderList = () => {
  return apiBegan({
    config: {
      url: EndPoints.order + "/list",
      method: "get",
    },
    // customSuccess: slice.actions.orderListReceived.type,
  });
};

export const addNewOrder = (data) => {
  return apiBegan({
    config: {
      url: EndPoints.order,
      data,
      method: "post",
    },
    // customSuccess: slice.actions.orderListAdded.type,
  });
};

// export const updateOrderList = (data) => {
//   return apiBegan({
//     config: {
//       url: EndPoints.order,
//       data,
//       method: "put",
//     },
//     customSuccess: slice.actions.orderListUpdated.type,
//   });
// };

export const updateReady = (data) => {
  return apiBegan({
    config: {
      url: EndPoints.order + "/ready",
      data,
      method: "put",
    },
  });
};

export const updateTaken = (data) => {
  return apiBegan({
    config: {
      url: EndPoints.order + "/taken",
      data,
      method: "put",
    },
  });
};

export const updateMissed = (data) => {
  return apiBegan({
    config: {
      url: EndPoints.order + "/missed",
      data,
      method: "put",
    },
  });
};
