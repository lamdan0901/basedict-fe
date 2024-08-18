"use client";

import { REFRESH_TOKEN } from "@/constants";
import { getCookie, setCookie } from "@/lib";
import { Home } from "@/modules/home";
import { signup, setTokenServer, createUser } from "@/service/auth";
import { Suspense, useEffect } from "react";
import { SWRConfig } from "swr";
import { v4 as uuid } from "uuid";
import { useAppStore } from "@/store/useAppStore";

export default function HomePage() {
  // const setProfile = useAppStore((state) => state.setProfile);

  // useEffect(() => {
  //   async function authenticate() {
  //     try {
  //       const refreshToken = getCookie(REFRESH_TOKEN);
  //       if (refreshToken) {
  //         return;
  //       }

  //       const res = await signup({
  //         email: `${uuid()}@basedict.vn`,
  //         password: uuid(),
  //       });

  //       await setTokenServer(res.data);
  //       setProfile(res.data.user);
  //       const userCreated = localStorage.getItem("userCreated") === "true";
  //       if (!userCreated) {
  //         await createUser({ name: res.data.user.email, avatar: null });
  //         localStorage.setItem("userCreated", "true");
  //       }
  //     } catch (err) {
  //       console.log("Err in authentication", err);
  //     }
  //   }

  //   authenticate();
  // }, [setProfile]);

  return (
    <Suspense>
      <SWRConfig value={{ errorRetryCount: 2 }}>
        <Home />
      </SWRConfig>
    </Suspense>
  );
}
