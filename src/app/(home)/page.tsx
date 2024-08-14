"use client";

// import { REFRESH_TOKEN } from "@/constants";
// import { auth, getCookie } from "@/lib";
// import { v4 as uuid } from "uuid";
import { Home } from "@/modules/home";
import { Suspense, useEffect } from "react";
import { SWRConfig } from "swr";

export default function HomePage() {
  // async function handleAuth() {
  //   const refreshToken = getCookie(REFRESH_TOKEN);
  //   if (!refreshToken) {
  //     const newId = uuid();
  //     const newPass = uuid();
  //     const res = await auth.signUp({
  //       email: `user${newId}@basedict.vn`,
  //       password: newPass,
  //     });
  //     console.log("res", res);
  //     return;
  //   }

  //   auth.refreshSession();
  // }

  // useEffect(() => {
  //   handleAuth();
  // }, []);

  return (
    <Suspense>
      <SWRConfig value={{ errorRetryCount: 2 }}>
        <Home />
      </SWRConfig>
    </Suspense>
  );
}
