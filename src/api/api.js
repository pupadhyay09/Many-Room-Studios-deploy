import {
  localGetItem,
  // localRemoveItem,
  // localSetItem,
} from "../services/localStorage";
import axios from "axios";
import { URLS } from "./Urls";
import { StorageKyes } from "../constant/constant";

export const withoutAuthApi = axios.create({
  baseURL: URLS.BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const withAuthApi = axios.create({
  baseURL: URLS.BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

withAuthApi.interceptors.request.use((config) => {
  const token = localGetItem(StorageKyes.token);
  if (config.headers && token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// const resetPage = () => {
//   localRemoveItem("token");
//   localRemoveItem("refresh");
//   window.location.href = "/";
// };

// withAuthApi.interceptors.response.use(
//   (response) => response,
//   async (err) => {
//     console.log("err===err=>", err);
//     const originalRequest = err.config;

//     if (
//       err.response &&
//       err.response.status === 401 &&
//       !originalRequest._retry
//     ) {
// originalRequest._retry = true;
// try {
//   const refreshToken = localGetItem("refresh");
//   if (!refreshToken) {
//     resetPage();
//     return Promise.reject(err);
//   }
//   const res = await axios.post(URLS.BASE_URL + '/riffresh', {
//     refresh: refreshToken,
//   });
//   if (res.status === 200) {
//     const { token } = res.data;
// localSetItem(StorageKyes.token, token);
//     originalRequest.headers["Authorization"] = `Bearer ${token}`;
//     return withAuthApi(originalRequest);
//   } else {
//     resetPage();
//     return Promise.reject(err);
//   }
// } catch (e) {
//   console.error("Token refresh failed:", e);
//   resetPage();
//   return Promise.reject(e);
// }
// }

//   return Promise.reject(err);
// }
// );
