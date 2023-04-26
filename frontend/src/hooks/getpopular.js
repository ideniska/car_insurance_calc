import {
  apiAdapter
} from "../services/api/adapter";


export const requestPopularModels = () => {
  return apiAdapter
    .get('/popular/')
    .then((response) => response.data);
};