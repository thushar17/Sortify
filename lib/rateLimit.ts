import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "./redis";

export const createLinkLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(6, "1 h"),
});

export const redirectLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(100, "1 h"),
});