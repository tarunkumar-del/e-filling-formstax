import { Users } from '@/features/users';
import type { BackendUser } from '@/features/users';

interface UsersPageProps {
    users: {
        data: BackendUser[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export default function UsersPage({
    users,
}: UsersPageProps) {
    return <Users users={users} />;
}