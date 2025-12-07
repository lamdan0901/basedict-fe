import { client } from "@/lib/supabase/client";
import axios, { AxiosError } from "axios";

const axiosData = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AUTH_BASE_URL,
});

const sharedInterceptor = async (config: any) => {
  const {
    data: { session },
  } = await client.auth.getSession();

  const token = session?.access_token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};

axiosData.interceptors.request.use(sharedInterceptor);

const responseInterceptor = async (error: any) => {
  if (axios.isAxiosError(error)) {
    if (error.code === AxiosError.ERR_NETWORK) {
      return Promise.reject("ERR_NETWORK_MSG");
    }
  }

  return Promise.reject(error.response?.data?.message as string);
};

axiosData.interceptors.response.use((res) => res, responseInterceptor);

export { axiosData };
