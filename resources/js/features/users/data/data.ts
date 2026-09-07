import { Shield, User } from 'lucide-react';

export const roles = [
    {
        label: 'Admin',
        value: 'admin',
        icon: Shield,
    },
    {
        label: 'User',
        value: 'user',
        icon: User,
    },
] as const;