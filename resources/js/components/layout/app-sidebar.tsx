import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from '@/components/ui/sidebar';

import { useLayout } from '@/context/layout-provider';
import { usePage } from '@inertiajs/react';

import {
    getSidebarData,
    type SidebarUser,
} from '@/components/layout/data/sidebar-data';

import { NavGroup } from './nav-group';
import { NavUser } from './nav-user';
import { TeamSwitcher } from './team-switcher';

interface AuthProps {
    auth: {
        user: SidebarUser | null;
    };
}

export function AppSidebar() {
    const { collapsible, variant } = useLayout();

    const { auth } = usePage().props as unknown as AuthProps;

    if (!auth.user) {
        return null;
    }

    const sidebarData = getSidebarData(auth.user);

    return (
        <Sidebar collapsible={collapsible} variant={variant}>
            <SidebarContent>
                {sidebarData.navGroups.map((props) => (
                    <NavGroup
                        key={props.title}
                        {...props}
                    />
                ))}
            </SidebarContent>

            <SidebarFooter>
                <NavUser user={sidebarData.user} />
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    );
}