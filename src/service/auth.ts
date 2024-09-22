import { axiosData } from "@/lib/axios";
import { TAuthBody } from "@/service/types";

export const login = (data: { email: string; password: string }) => {
  return axiosData.post<TAuthBody>("/token?grant_type=password", data);
};

export const updateUser = (data: { name: string; avatar: string | null }) => {
  return axiosData.post("/v1/users", data);
};
