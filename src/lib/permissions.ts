// Define all distinct permission flags that control granular access in the application
export type Permission =
    | 'view_dashboard_admin'   // General access to the admin dashboard area
    | 'view_dashboard_athlete' // General access to the athlete dashboard area
    | 'manage_blogs'           // Create, edit, and delete blog posts
    | 'assign_plans'           // Assign training macrocycles/microcycles to athletes
    | 'manage_staff'           // Create or manage other staff roles
    | 'manage_billing'         // Handle financial/payment data
    | 'view_all_athletes'      // Can view all registered athletes' profiles
    | 'edit_all_athletes'      // Can edit any registered athlete's profile
    | 'manage_calendar';       // Add, edit, or delete public competitions

// Define the precise scalable roles available
export type Role =
    | 'developer'
    | 'head_coach'
    | 'physio'
    | 'assistant_coach'
    | 'nutritionist'
    | 'athlete'
    // Legacy mapping (temporarily treated as head_coach/admin for backward compatibility)
    | 'admin';

// Map each role to their specific granted permissions
const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
    developer: [
        'view_dashboard_admin', 'manage_blogs', 'assign_plans',
        'manage_staff', 'manage_billing', 'view_all_athletes', 'edit_all_athletes', 'manage_calendar'
    ],
    head_coach: [
        'view_dashboard_admin', 'manage_blogs', 'assign_plans',
        'view_all_athletes', 'edit_all_athletes', 'manage_calendar'
    ],
    physio: [
        'view_dashboard_admin', 'view_all_athletes'
    ],
    assistant_coach: [
        'view_dashboard_admin', 'view_all_athletes', 'manage_calendar'
        // Intentionally missing 'assign_plans' and 'manage_blogs'
    ],
    nutritionist: [
        'view_dashboard_admin', 'view_all_athletes'
    ],
    admin: [
        // Legacy 'admin' receives full capabilities until migrated
        'view_dashboard_admin', 'manage_blogs', 'assign_plans',
        'manage_staff', 'manage_billing', 'view_all_athletes', 'edit_all_athletes', 'manage_calendar'
    ],
    athlete: [
        'view_dashboard_athlete'
    ]
};

// Constant array of all possible roles that are considered "admin staff" 
// (Useful for high-level UI checks like Sidebar rendering without deep permission checks)
export const STAFF_ROLES: Role[] = [
    'developer', 'head_coach', 'physio', 'assistant_coach', 'nutritionist', 'admin'
];

/**
 * Checks if a specific role has a given permission.
 * 
 * @param role The user's role
 * @param permission The permission to check
 * @returns boolean returning true if granted, false otherwise.
 */
export function hasPermission(role: Role | undefined | null, permission: Permission): boolean {
    if (!role) return false;

    const permissions = ROLE_PERMISSIONS[role];
    if (!permissions) return false;

    return permissions.includes(permission);
}
