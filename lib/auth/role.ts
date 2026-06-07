export const USER_ROLES = {
  ADMIN: 'admin',
  TUTOR: 'tutor',
} as const

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES]

export type ProfileRole = {
  id: string
  role: UserRole
  fullName: string
  active: boolean
}

export function isUserRole(value: string): value is UserRole {
  return value === USER_ROLES.ADMIN || value === USER_ROLES.TUTOR
}

export function isAdmin(role: UserRole | null | undefined) {
  return role === USER_ROLES.ADMIN
}

export function isTutor(role: UserRole | null | undefined) {
  return role === USER_ROLES.TUTOR
}
