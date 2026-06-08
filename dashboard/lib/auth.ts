import { SignJWT, jwtVerify } from 'jose'

export type UserRole = 'admin' | 'editor' | 'viewer'

export interface AuthPayload {
  id: string
  email: string
  name: string
  role: UserRole
}

export const COOKIE_NAME = 'auth_token'
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

function getSecret() {
  return new TextEncoder().encode(process.env.AUTH_SECRET ?? 'change-this-secret-in-production-min-32-chars')
}

export async function signToken(payload: AuthPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getSecret())
}

export async function verifyToken(token: string): Promise<AuthPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret())
    return payload as unknown as AuthPayload
  } catch {
    return null
  }
}

/** Helper: can this role mutate data? */
export function canWrite(role: UserRole) {
  return role === 'admin' || role === 'editor'
}

/** Helper: is admin? */
export function isAdmin(role: UserRole) {
  return role === 'admin'
}
