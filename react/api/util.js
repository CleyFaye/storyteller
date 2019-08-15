import axios from "axios";

export const callAPI = (method, url, data) => axios[method](url, data)
  .then(response => response.data.data)
  .catch(error => {
    if (error.response) {
      throw error.response;
    }
    throw error;
  });