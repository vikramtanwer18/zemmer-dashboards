import Cookies from "js-cookie";

const ACCESS_TOKEN_COOKIE = "gymos_access_token";
const COOKIE_OPTIONS: Cookies.CookieAttributes = {
  path: "/",
  sameSite: "lax",
  secure: typeof window !== "undefined" && window.location.protocol === "https:",
};

let inMemoryToken: string | null = null;

export function setAccessToken(token: string) {
  inMemoryToken = token;
  if (typeof window !== "undefined") {
    Cookies.set(ACCESS_TOKEN_COOKIE, token, { ...COOKIE_OPTIONS, expires: 1 });
  }
}

export function getAccessToken(): string | null {
  if (inMemoryToken) return inMemoryToken;
  if (typeof window === "undefined") return null;
  const fromCookie = Cookies.get(ACCESS_TOKEN_COOKIE);
  if (fromCookie) {
    inMemoryToken = fromCookie;
    return fromCookie;
  }
  return null;
}

export function clearAccessToken() {
  inMemoryToken = null;
  if (typeof window !== "undefined") {
    Cookies.remove(ACCESS_TOKEN_COOKIE, { path: "/" });
  }
}

export const ACCESS_TOKEN_COOKIE_NAME = ACCESS_TOKEN_COOKIE;
