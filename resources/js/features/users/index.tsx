import { ConfigDrawer } from '@/components/config-drawer';
import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';
import { UsersDialogs } from './components/users-dialogs';
import { UsersPrimaryButtons } from './components/users-primary-buttons';
import { UsersProvider } from './components/users-provider';
import { UsersTable } from './components/users-table';

export interface BackendUser {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    phoneNumber: string | null;
    status: string;
    role: string;
    companyCount: number;
    createdAt: string | null;
    updatedAt: string | null;
}

export interface BackendUsersPagination {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface UsersPageProps {
    users: {
        data: BackendUser[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export function Users({
    users,
}: UsersPageProps) {
    return (
        <UsersProvider>
            <Header>
                <Search />

                <div className="ms-auto flex items-center space-x-4">
                    <ThemeSwitch />
                    {/* <ConfigDrawer /> */}
                    <ProfileDropdown />
                </div>
            </Header>

            <Main>
                <div className="mb-2 flex items-center justify-between space-y-2">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            User List
                        </h2>

                        <p className="text-muted-foreground">
                            Manage your users here.
                        </p>
                    </div>

                    <UsersPrimaryButtons />
                </div>

                <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
                    <UsersTable
                        data={users.data}
                        pagination={{
                            current_page:
                                users.current_page,
                            last_page:
                                users.last_page,
                            per_page:
                                users.per_page,
                            total:
                                users.total,
                        }}
                    />
                </div>
            </Main>

            <UsersDialogs />
        </UsersProvider>
    );
}