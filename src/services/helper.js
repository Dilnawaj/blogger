import axios from "axios";
import jwtDecode from "jwt-decode";
import { doLogout, getToken } from "../auth/Index";

export const BASE_URL = "http://localhost:5000/";

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

