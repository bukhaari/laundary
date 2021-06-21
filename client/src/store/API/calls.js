import { allReq } from "../../axiosfiles/axios-outh";

// actions part
export const actions = {
  DELETE({ url, data }) {
    return allReq
      .delete(url, { data })
      .then((data) => {
        return data;
      })
      .catch((err) => {
        throw err;
      });
  },
  GET({ url, query }) {
    let params = { filter: {}, range: [0, 9], sort: ["id", "ASC"] };
    if (query) params = { ...params, ...query };
    return allReq
      .get(url, {
        params,
      })
      .then((data) => {
        return data;
      })
      .catch((err) => {
        throw err;
      });
  },
  INSERT({ url, data }) {
    // return postReq(value.url, value.data);
    return allReq
      .post(url, data)
      .then((data) => {
        return data;
      })
      .catch((err) => {
        // console.log("error");
        throw err;
        // return err;
      });
  },
  UPDATE({ url, data }) {
    // return postReq(value.url, value.data);
    return allReq
      .put(url, data)
      .then((val) => {
        return val;
      })
      .catch((err) => {
        // console.log("error");
        throw err;
        // return err;
      });
  },
};
//gettes part
