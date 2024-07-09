import jwtDecode from "jwt-decode";
export const isLoggedIn = () => {
  try {
    console.log("bolo")
  let data = localStorage.getItem("data");
  if (data != null) {
    console.log("I love you")
    return true;
  } else {
    console.log("kya")
    return false;
  }
} catch (error) {
  console.log("kuch bhi")
  return false;
}
};


export const doLogin = (data, next) => {
  localStorage.setItem("data", JSON.stringify(data));
  next();
};

export const doLogout = (next) => {
  localStorage.removeItem("data");
  next();
};

export const getCurrentUserDetail = () => {
  console.log("byy")
  if (isLoggedIn()) {
    console.log("loggedIn")
    return JSON.parse(localStorage.getItem("data"))?.user;
  } else {
    console.log("loggedOut")
    return undefined;
  }
};
export const getCurrentUserDetails = () => {

    return undefined;
  
};
export const getToken = () => {
  if (isLoggedIn()) {
    return JSON.parse(localStorage.getItem("data")).accessToken;
  } else {
    return null;
  }
};

export function isTokenExpired(token) {
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;

  } catch (error) {
    return true; // Return true if token decoding fails
  }
}

