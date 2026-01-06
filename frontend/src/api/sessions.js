import axiosInstance from "../lib/axios.js";
export const sessionApi = {
  createSession : async(data) => {
    const response = await axiosInstance.post("/sessions",data)
    return response.data
  }
}