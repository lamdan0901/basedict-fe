import { axiosData } from "@/lib/axios";
import { AxiosRequestConfig } from "axios";

export const getRequest = async (url: string, config?: AxiosRequestConfig) => {
  try {
    const res = await axiosData.get(url, config);
    return res.data.data;
  } catch (err) {
    throw err;
  }
};

export const postRequest = async (url: string, { arg }: { arg: any }) => {
  try {
    const res = await axiosData.post(url, arg);
    return res.data.data;
  } catch (err) {
    throw err;
  }
};

export const patchRequest = async (url: string, { arg }: { arg: any }) => {
  try {
    const res = await axiosData.patch(url, arg);
    return res.data.data;
  } catch (err) {
    throw err;
  }
};

export const deleteRequest = async (url: string, { arg }: { arg: any }) => {
  try {
    const res = await axiosData.delete(url, arg);
    return res.data.data;
  } catch (err) {
    throw err;
  }
};
