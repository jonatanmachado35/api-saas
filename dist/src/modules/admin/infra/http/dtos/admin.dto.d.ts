export declare enum AdminRoleType {
    USER = "user",
    MODERATOR = "moderator",
    ADMIN = "admin",
    NONE = "none"
}
export declare enum AdminPlanType {
    FREE = "free",
    PRO = "pro",
    CUSTOM = "custom"
}
export declare enum AdminSubscriptionStatus {
    ACTIVE = "active",
    CANCELED = "canceled",
    PENDING = "pending"
}
export declare class ChangeUserRoleDto {
    role: AdminRoleType;
}
export declare class CreateAdminSubscriptionDto {
    user_id: string;
    plan: AdminPlanType;
    status?: AdminSubscriptionStatus;
    credits?: number;
}
export declare class UpdateAdminSubscriptionDto {
    plan?: AdminPlanType;
    status?: AdminSubscriptionStatus;
    credits?: number;
}
export declare class CreateAdminAgentDto {
    user_id: string;
    name: string;
    avatar?: string;
    description?: string;
}
