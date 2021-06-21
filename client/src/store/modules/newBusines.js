import { apiBegan } from "../Actions";
import { EndPoints } from "./endpoints";
// const slice = createSlice({
//   initialState: {
//     success: null,
//     error: null,
//   },
//   name: "newBussines",
//   reducers: {
//     onSuccess: (state, { payload }) => {
//       state.success = payload;
//       state.error = null;
//       return state;
//     },
//     onError: (state, { payload }) => {
//       state.error = payload;
//       state.success = null;
//       return state;
//     },
//   },
// });

// export default slice.reducer;

export const newBussiness = (data) => {
  return apiBegan({
    config: {
      url: EndPoints.newBussines,
      data,
      method: "post",
    },
    // onSuccess: slice.actions.onSuccess.type,
    // onError: slice.actions.onError.type,
  });
};
