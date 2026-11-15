import { createHash, timingSafeEqual } from 'node:crypto';
export class Problem extends Error {
  constructor(status, code) { super(code); this.status = status; }
}
export function text(value, max = 64) {
  if (typeof value !== 'string' || !value.trim() || value.length > max) throw new Problem(400, 'invalid_text');
  return value.trim();
}
export function identifier(value) {
  const s = text(value);
  if (!/^[A-Za-z0-9-]+$/.test(s)) throw new Problem(400, 'invalid_identifier');
  return s;
}
export function integer(value, min, max) {
  if (!Number.isSafeInteger(value) || value < min || value > max) throw new Problem(400, 'invalid_integer');
  return value;
}
export function authorized(header, token) {
  if (typeof token !== 'string' || !token) throw new Problem(503, 'token_unconfigured');
  if (typeof header !== 'string' || !header.startsWith('Bearer ')) throw new Problem(401, 'unauthorized');
  const digest = x => createHash('sha256').update(x).digest();
  if (!timingSafeEqual(digest(header.slice(7)), digest(token))) throw new Problem(401, 'unauthorized');
}
export const wrap = fn => (req, res, next) => Promise.resolve().then(() => fn(req, res)).catch(next);
export function errors(error, _req, res, _next) {
  if (error instanceof Problem) return res.status(error.status).json({ error: error.message });
  if (error?.type === 'entity.parse.failed') return res.status(400).json({ error: 'invalid_json' });
  if (error?.type === 'entity.too.large') return res.status(413).json({ error: 'body_too_large' });
  res.status(503).json({ error: 'dependency_or_internal_unavailable' });
}
