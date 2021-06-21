const axios = require("axios");
const Request = (req) => {
  // req.headers.common.athorization = store.default.getters.showToken;
  req.headers.common.athorization = "Abdullahi Abas";
  return req;
};
const Response = (response) => {
  let { athorization } = response.config.headers;
  if (athorization) response.config.headers.athorization = "";
  // console.log(response.config);
  return response;
};
const ResponseError = (error) => {
  // if (error.response && error.response.status === 401)
  //   store.default.commit("OnLogout");
  return Promise.reject(error);
};
const allReq = axios.create({
  baseURL: "/api-v1",
  // timeout: 10000
  // headers: { athorization: GetItemFromStorage(StorageKeys.token) },
});
allReq.interceptors.request.use(Request);

allReq.interceptors.response.use(Response, ResponseError);

const logInReq = axios.create({
  baseURL: "/api-v1",
});

module.exports = {
  allReq,
  logInReq,
};
