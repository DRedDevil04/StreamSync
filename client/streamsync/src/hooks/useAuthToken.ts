// src/hooks/useAuthToken.ts
import { useCookies } from "react-cookie";

export const useAuthToken = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);

  const setToken = (token: string) => {
    setCookie("token", token, {
      path: "/",
      maxAge: 60 * 60, // 1 hour
      sameSite: "lax",
      secure: false, // true in production with HTTPS
    });
  };

  const removeToken = () => {
    removeCookie("token", { path: "/" });
  };

  return {
    token: cookies.token,
    setToken,
    removeToken,
  };
};
