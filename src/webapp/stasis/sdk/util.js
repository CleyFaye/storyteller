import axios from "axios";

export const callAPI = (method, url, data) =>
  axios[method](`/api/v1/stasis${url}`, method == "get" ? {params: data} : data)
    .then((response) => response.data.data)
    .catch((error) => {
      if (error.response) {
        throw error.response;
      }
      throw error;
    });
