import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants";
import { createUser, getRefreshToken, signup } from "@/service/auth";
import { TAuthBody } from "@/service/types";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";

export async function middleware() {
  const accessToken = cookies().get(ACCESS_TOKEN)?.value;
  const refreshToken = cookies().get(REFRESH_TOKEN)?.value;
  const response = NextResponse.next();

  if (!accessToken && refreshToken) {
    const res = await getRefreshToken(refreshToken);
    saveTokens(res.data);
  }

  async function saveTokens(tokens: TAuthBody) {
    try {
      const { access_token, expires_in, refresh_token, expires_at } = tokens;

      if (access_token) {
        response.cookies.set({
          name: ACCESS_TOKEN,
          value: access_token,
          secure: true,
          maxAge: expires_in,
          sameSite: "strict",
          path: "/",
        });
        response.cookies.set({
          name: REFRESH_TOKEN,
          value: refresh_token,
          secure: true,
          maxAge: expires_at,
          sameSite: "strict",
          path: "/",
        });
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
    }
  }

  if (!refreshToken) {
    const { data } = await signup({
      email: `${uuid()}@basedict.vn`,
      password: uuid(),
    });

    await saveTokens(data);

    const userCreated = cookies().get("userCreated")?.value === "true";
    if (!userCreated) {
      await createUser(
        { name: data.user.email, avatar: null },
        data.access_token
      );
      response.cookies.set({
        name: "userCreated",
        value: "true",
        secure: true,
        sameSite: "strict",
        path: "/",
      });
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
