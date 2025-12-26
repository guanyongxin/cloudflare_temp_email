import { CONSTANTS } from "../constants";

const hit = (from: string, words: string[]) =>
  words.map(w => (w || "").trim()).filter(Boolean).some(w => from.includes(w));

export const isBlocked = async (from: string, env: Bindings): Promise<boolean> => {
  const envList = (env.BLACK_LIST || "")
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);

  let kvList: string[] = [];
  if (env.KV) {
    kvList = (await env.KV.get<string[]>(CONSTANTS.EMAIL_KV_BLACK_LIST, "json")) || [];
    kvList = kvList.map(s => (s || "").trim()).filter(Boolean);
  }

  const allowList = [...envList, ...kvList];

  // 白名单为空：默认全部拦截（更安全）
  if (allowList.length === 0) return true;

  // 白名单模式：不命中就拦截
  return !hit(from, allowList);
};
