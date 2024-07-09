import { privateAxios } from "./helper";

export const signUp = (user) => {
  return privateAxios.post("/user/account/signup", user).then((response) => response.data);
};
export const googleSignUp = (code) => {
  console.log("Hahha code is", code);
  console.log("Request  is", `/user/googlesignupprocess/${code}`);
  return privateAxios
    .get(`/user/account/googlesignupprocess/${code}`)
    .then((response) => response.data);
};

export const googleLogin = (code) => {
  console.log("Hahha code is", `/account/google/login/${code}`);
  return privateAxios
    .get(`/account/google/login/${code}`)
    .then((response) => response.data);
};
export const getUser = (userId) => {
  return privateAxios.get(`/user/account/${userId}`).then((resp) => resp.data);
};
export const login = (user) => {
  return privateAxios.post("/account/login", user).then((response) => response.data);
};

export const resetPassword = (user) => {
  return privateAxios.post("/account/reset", user).then((response) => response.data);
};

export const forgotPassword = (user) => {
  return privateAxios
    .post("/account/forgot", user)
    .then((response) => response.data);
};

export const updatePassword = (user) => {
  console.log("Your user is:", user);
  return privateAxios.put(`/account/update`, user).then((resp) => resp.data);
};

export const cancelUpdatePassword = (userId) => {
  console.log("Your user is:", userId);
  return privateAxios
    .get(`/account/cancelpassword/${userId}`)
    .then((resp) => resp.data);
};

export const updateUser = (user) => {
  return privateAxios.put(`/user`, user).then((resp) => resp.data);
};

export const getBackgroundImage = () => {
  return privateAxios.get(`/post/image/background.png`).then((resp) => resp.data);
};
