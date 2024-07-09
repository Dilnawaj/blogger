import { getToken } from "../auth/Index";
import { privateAxios } from "./helper";
import { myAxios } from "./helper";

export const createPost = (postData) => {
  return privateAxios
    .post(
      `/post/user/${postData.userId}/category/${postData.categoryId}/post`,
      postData
    )
    .then((response) => response.data);
};

export const createCategory = (categoryDetail) => {
  return privateAxios
    .post(`/categorie`, categoryDetail)
    .then((response) => response.data);
};
export const feedback = (feedbackDetail) => {
  return privateAxios
    .post(`/account/help`, feedbackDetail)
    .then((response) => response.data);
};

export const createFeedback = (feedbackDetail) => {
  return privateAxios
    .post(`/categorie`, feedbackDetail)
    .then((response) => response.data);
};
//get all posts

export const loadAllPosts = (pageNumber, pageSize, sortBy) => {
  return privateAxios
    .get(
      `/post/getall/posts?pageNumber=${pageNumber}&pageSize=${pageSize}&sortBy=${sortBy}`
    )
    .then((reponse) => reponse.data);
};

export const savePosts = (userId, pageNumber, pageSize) => {
  return privateAxios
    .get(`/post/user/${userId}?pageNumber=${pageNumber}&pageSize=${pageSize}`)
    .then((reponse) => reponse.data);
};

export const loadPost = (postId) => {
  console.log("Private post loaded Axios",getToken())
  
    return privateAxios.get("/post/account/" + postId).then((response) => response.data);

};

export const createComment = (comment, postId, userId) => {
  console.log("Comment is", comment);
  return privateAxios
    .post(`/comment/post/${postId}/user/${userId}/comment`, comment)
    .then((response) => response.data);
};
export const createReport = ( postId, userId) => {
  return privateAxios
    .post(`/post/report?postId=${postId}&userId=${userId}`)
    .then((response) => response.data);
};
export const addLikeANdDislike = (postId, likeANdDislike, userId) => {
  console.log("Here what button is", likeANdDislike);
  return privateAxios
    .get(`/post/${postId}/${likeANdDislike}/${userId}`)
    .then((response) => response.data);
};
export const downloadPost=(postId)=>{
  return privateAxios
    .get(`/post/download/${postId}`)
    .then((response) => response.data);
}

export const saveSubscriber = (userId, currentUserId) => {
  console.log("Here what button is", currentUserId);
  return privateAxios
    .post(`/post/subscribe/user/${userId}/${currentUserId}`)
    .then((response) => response.data);
};

export const search = (keyword, pageNumber, pageSize, sortBy) => {
  return privateAxios
    .get(
      `/post/account/search?keyword=${keyword}&pageNumber=${pageNumber}&pageSize=${pageSize}&sortBy=${sortBy}`
    )
    .then((response) => response.data);
};
export const searchByUser = (keyword, pageNumber, pageSize, sortBy) => {
  return privateAxios
    .get(
      `/post/search/user?keyword=${keyword}&pageNumber=${pageNumber}&pageSize=${pageSize}&sortBy=${sortBy}`
    )
    .then((response) => response.data);
};
export const unSaveSubscriber = (userId, currentUserId) => {
  console.log("Here what button is", currentUserId);
  return privateAxios
    .post(`/post/unsubscribe/user/${userId}/${currentUserId}`)
    .then((response) => response.data);
};
export const isSubscribe = (userId, currentUserId) => {
  console.log("Here what button is", currentUserId);
  return privateAxios
    .get(`/post/subscribe/user/${userId}/${currentUserId}`)
    .then((response) => response.data);
};
export const shareEmail = (shareEmailRequest) => {
  return privateAxios
    .post(`/post/share`, shareEmailRequest)
    .then((response) => response.data);
};

export const createSavePost = (postId, userId) => {
  return privateAxios
    .get(`/post/${postId}/user/${userId}`)
    .then((response) => response.data);
};
export const unSavePost = (postId, userId) => {
  return privateAxios
    .get(`/post/unsave/${postId}/user/${userId}`)
    .then((response) => response.data);
};
export const isPostSave = (postId, userId) => {
  return privateAxios
    .get(`/post/${postId}/user/${userId}/save`)
    .then((response) => response.data);
};

export const uploadPostImage = (image, postId) => {
  let formData = new FormData();
console.log("dekhte h",`/post/image/upload/${postId}`)
  formData.append("image", image);
  return privateAxios
    .post(`/post/image/upload/${postId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((response) => response.data);
};
export const uploadUserImage = (image, userId) => {
  let formData = new FormData();

  formData.append("image", image);
  return privateAxios
    .post(`/user/image/upload/${userId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((response) => response.data);
};
//get Categoryvise data from post

export const loadPostCategoryWise = (categoryId) => {
  return privateAxios.get(`/post/category/${categoryId}/posts`).then((res) => {
    return res.data;
  });
};

export const loadPostCategoryAndUserWise = (categoryId, userId) => {
  return privateAxios
    .get(`/post/category/${categoryId}/user/${userId}/posts`)
    .then((res) => {
      return res.data;
    });
};

export const loadSavePostCategoryAndUserWise = (categoryId, userId) => {
  return privateAxios
    .get(`/post/save/category/${categoryId}/user/${userId}/posts`)
    .then((res) => {
      return res.data;
    });
};
export const loadAllPostsByUser = (userId, pageNumber, pageSize, sortBy) => {
  return privateAxios
    .get(
      `/post/user/${userId}/post?pageNumber=${pageNumber}&pageSize=${pageSize}&sortBy=${sortBy}`
    )
    .then((reponse) => reponse.data);
};

export function loadPostUserWise(userId) {
  return privateAxios
    .get(`/post/user/${userId}/posts`)
    .then((response) => response.data);
}

export function updatePasswordAlert() {
  return privateAxios
    .get(`/account/updatepasswordalert`)
    .then((response) => response.data);
}
export function deletePostService(postId) {
  return privateAxios.delete(`/post/${postId}`).then((res) => res.data);
}

export function updatePosts(post, postId) {
  return privateAxios.put(`/post`, post).then((resp) => resp.data);
}
