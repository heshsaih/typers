export const Role = {
    USER_ROLE: 0,
    ADMIN_ROLE: 1,
    MANAGER_ROLE: 2
} as const;

export type RoleType = typeof Role;
