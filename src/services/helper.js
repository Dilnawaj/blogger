import axios from "axios";
import jwtDecode from "jwt-decode";
import { doLogout, getToken } from "../auth/Index";

export const BASE_URL = "http://16.171.172.94:8081/";

export const myAxios = axios.create({
  baseURL: BASE_URL,
});

export const privateAxios = axios.create({
  baseURL: BASE_URL,
});


privateAxios.interceptors.request.use(
  (config) => {

    const accessToken = getToken();
    console.log("accessToken is", accessToken);
    if (accessToken) {
      config.headers.accessToken = accessToken;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

