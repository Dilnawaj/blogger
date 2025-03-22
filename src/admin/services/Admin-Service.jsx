import { privateAxios } from "../../services/helper";
export const signUp = (user) => {
  return privateAxios.post("/admin/account/signup", user).then((response) => response.data);
};
export const googleSignUp = (code) => {
  console.log("Hahha code is", code);
  console.log("Request  is", `/admin/googlesignupprocess/${code}`);
  return privateAxios
    .get(`admin/account/googlesignupprocess/${code}`)
    .then((response) => response.data);
};

export const googleLogin = (code) => {
  console.log("Hahha code is", `/admin/account/google/login/${code}`);
  return privateAxios
    .get(`admin/account/google/login/${code}`)
    .then((response) => response.data);
};
export const getUser = (userId) => {
  return privateAxios.get(`/admin/user/account/${userId}`).then((resp) => resp.data);
};
export const login = (user) => {
  return privateAxios.post("admin/account/login", user).then((response) => response.data);
};

export const resetPassword = (user) => {
  return privateAxios.post("/admin/account/reset", user).then((response) => response.data);
};
export const grantAdmin = (email) => {
  return privateAxios.get(`/admin/account/permission?email=${email}`).then((resp) => resp.data);
};
export const forgotPassword = (user) => {
  return privateAxios
    .post("/admin/account/forgot", user)
    .then((response) => response.data);
};

export const updatePassword = (user) => {
  console.log("Your user is:", user);
  return privateAxios.put(`/admin/account/update`, user).then((resp) => resp.data);
};

export const cancelUpdatePassword = (userId) => {
  console.log("Your user is:", userId);
  return privateAxios
    .get(`/admin/account/cancelpassword/${userId}`)
    .then((resp) => resp.data);
};

export const updateUser = (user) => {
  return privateAxios.put(`/user`, user).then((resp) => resp.data);
};

export const getBackgroundImage = () => {
  return privateAxios.get(`/post/image/background.png`).then((resp) => resp.data);
};
