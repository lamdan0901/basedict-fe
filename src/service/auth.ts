import { axiosAuth, axiosData } from "@/lib/axios";
import { TAuthBody } from "@/service/types";
import axios from "axios";

const login = (data: { email: string; password: string }) => {
  return axiosAuth.post<TAuthBody>("/token?grant_type=password", data);
};

const signup = (data: { email: string; password: string }) => {
  return axiosAuth.post<TAuthBody>("/signup", data);
};

const logout = () => {
  return axiosAuth.post("/logout?scope=local");
};

const createUser = (data: { name: string; avatar: string | null }) => {
  return axiosData.post("/v1/users", data);
};

const getRefreshToken = (refresh_token: string): Promise<TAuthBody> => {
  return axiosAuth.post("/token?grant_type=refresh_token", {
    refresh_token,
  });
};

const setTokenServer = async (data: object) => {
  try {
    const res = await axios.post("/api/auth", { data });
    return res;
  } catch (error) {
    console.log("errors", error);
  }
};

const deleteTokenServer = async () => {
  try {
    const res = await axios.delete("/api/auth");
    return res;
  } catch (error) {
    console.log("errors", error);
  }
};

export {
  login,
  setTokenServer,
  getRefreshToken,
  logout,
  deleteTokenServer,
  createUser,
  signup,
};
