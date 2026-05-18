export type UserRole = 'ADMIN' | 'CUSTOMER' | 'WHOLESALER';

export interface UserProfile {
    id: string;
    email: string;
    phone?: string | null;
    role: UserRole;
    businessName?: string | null;
    businessAddress?: string | null;
    businessPhone?: string | null;
    businessRegistrationUrl?: string | null;
    bankStatementUrl?: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface WholesalerProfile extends UserProfile {
    role: 'WHOLESALER';
    // Keeping status since you might need it later, even though it's not in the screenshot schema.
    // Assuming status might be derived or added later, but I'll remove it for strict schema match.
}
