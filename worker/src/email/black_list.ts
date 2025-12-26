import { CONSTANTS } from "../constants";

/**
 * 从 from 中提取域名
 * 支持：
 *  - user@gmail.com
 *  - Name <user@gmail.com>
 */
const extractDomain = (from: string): string | null => {
  if (!from) return null;

  // 尝试提取 <> 中的邮箱
  const m = from.match(/<([^>]+)>/);
  const email = m ? m[1] : from;

  const at = email.lastIndexOf("@");
  if (at === -1) return null;

  return email.slice(at + 1).trim().toLowerCase();
};

/**
 * 域名是否命中白名单
 * 支持：
 *  - 精确匹配：gmail.com
 *  - 后缀匹配：*.gmail.com
 */
const domainAllowed = (domain: string, allowList: string[]): boolean => {
  const d = domain.toLowerCase();

  return allowList.some(item => {
    const rule = (item || "").trim().toLowerCase();
    if (!rule) return false;

    // *.example.com
    if (rule.startsWith("*.")) {
      const suffix = rule.slice(2);
      return d === suffix || d.endsWith("." + suffix);
    }

    // 精确匹配
    return d === rule;
  });
};

export const isBlocked = async (from: string, env: Bindings): Promise<boolean> => {
  const domain = extractDomain(from);
  if (!domain) {
    // 无法解析域名，直接拦截（安全）
    return true;
  }

  // env 白名单
  const envList = (env.BLACK_LIST || "")
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);

  // KV 白名单
  let kvList: string[] = [];
  if (env.KV) {
    kvList = (await env.KV.get<string[]>(CONSTANTS.EMAIL_KV_BLACK_LIST, "json")) || [];
  }

  const allowList = [...envList, ...kvList];

  // 白名单为空：默认全部拦截
  if (allowList.length === 0) {
    return true;
  }

  // 白名单模式：不命中即拦截
  return !domainAllowed(domain, allowList);
};
