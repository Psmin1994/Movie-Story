// config/cookieOptions.ts
import { CookieOptions } from "express";

export const COOKIE_OPTIONS: CookieOptions = {
  sameSite: "strict",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
};
