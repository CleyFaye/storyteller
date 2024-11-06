import axios from "axios";

export const callAPI = async (method, url, data) => {
  try {
    const response = await axios[method](url, method === "get" ? {params: data} : data);
    return response.data.data;
  } catch (error) {
    if (error.response) throw error.response;
    throw error;
  }
};
