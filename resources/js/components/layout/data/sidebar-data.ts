import {
    Building2,
    FileText,
    LayoutDashboard,
    Users,
} from 'lucide-react';

import { type SidebarData } from '../types';

export interface SidebarUser {
    id?: number;
    name: string;
    email: string;
    avatar?: string;
    roles: string[];
}

export const getSidebarData = (user: SidebarUser): SidebarData => {
    const isAdmin = user.roles.includes('admin');

    const navItems = [
        {
            title: 'Dashboard',
            url: isAdmin ? '/admin/dashboard' : '/dashboard',
            icon: LayoutDashboard,
        },

        {
            title: 'Companies',
            url: isAdmin ? '/admin/companies' : '/companies',
            icon: Building2,
        },

        ...(isAdmin
            ? [
                {
                      title: 'Users',
                      url: '/admin/users',
                      icon: Users,
                },
                {
                      title: 'Tax Forms',
                      url: '/admin/tax-forms',
                      icon: FileText,
                  },
              ]
            : []),
    ];

    return {
        user: {
            name: user.name,
            email: user.email,
            avatar: user.avatar ?? '/avatars/shadcn.jpg',
        },

        navGroups: [
            {
                title: 'General',
                items: navItems,
            },
        ],
    };
};