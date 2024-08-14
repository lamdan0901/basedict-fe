import { AuthClient } from "@supabase/auth-js";

const customFetch = (url: RequestInfo | URL, options = {}) => {
  return fetch(url, {
    ...options,
    mode: "no-cors",
    credentials: "include",
  });
};

export const auth = new AuthClient({
  url: process.env.NEXT_PUBLIC_AUTH_BASE_URL,
  persistSession: true,
  autoRefreshToken: true,
  fetch: customFetch,
});
