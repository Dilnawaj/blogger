import { privateAxios } from "./helper";
export const loadAllCategories = () => {
  return privateAxios.get(`/categorie`).then((response) => {
    return response.data;
  });
};
