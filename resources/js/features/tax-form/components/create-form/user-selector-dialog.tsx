import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import {
    Loader2,
    Search,
    UserRound,
} from 'lucide-react';

import { useEffect, useMemo, useState } from 'react';

import type { CreateFormUser } from '../../types';

interface UserSelectorDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSelect: (user: CreateFormUser) => void;
}

export function UserSelectorDialog({
    open,
    onOpenChange,
    onSelect,
}: UserSelectorDialogProps) {
    const [users, setUsers] = useState<CreateFormUser[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!open) {
            return;
        }

        setSearch('');
        setError(null);

        const loadUsers = async () => {
            setLoading(true);

            try {
                const response = await fetch(
                    '/admin/tax-forms/create/users',
                    {
                        method: 'GET',
                        headers: {
                            Accept: 'application/json',
                        },
                    },
                );

                if (!response.ok) {
                    throw new Error('Unable to load users.');
                }

                const data = await response.json();

                setUsers(data.users ?? []);
            } catch (error) {
                console.error(error);

                setUsers([]);
                setError(
                    'Unable to load users. Please try again.',
                );
            } finally {
                setLoading(false);
            }
        };

        loadUsers();
    }, [open]);

    const filteredUsers = useMemo(() => {
        const value = search.trim().toLowerCase();

        if (!value) {
            return users;
        }

        return users.filter((user) => {
            return (
                user.name.toLowerCase().includes(value) ||
                user.email.toLowerCase().includes(value)
            );
        });
    }, [users, search]);

    const handleSelect = (user: CreateFormUser) => {
        onSelect(user);
        onOpenChange(false);
    };

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        Select User
                    </DialogTitle>

                    <DialogDescription>
                        Select the user for whom you want
                        to create this tax form.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                        <Input
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder="Search users..."
                            className="pl-9"
                        />
                    </div>

                    {error && (
                        <div className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                            {error}
                        </div>
                    )}

                    <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
                        {loading ? (
                            <div className="flex items-center justify-center py-10">
                                <Loader2 className="size-5 animate-spin text-muted-foreground" />
                            </div>
                        ) : filteredUsers.length === 0 ? (
                            <div className="py-10 text-center text-sm text-muted-foreground">
                                No users found.
                            </div>
                        ) : (
                            filteredUsers.map((user) => (
                                <Button
                                    key={user.id}
                                    type="button"
                                    variant="outline"
                                    className="h-auto w-full justify-start p-3 text-left"
                                    onClick={() =>
                                        handleSelect(user)
                                    }
                                >
                                    <UserRound className="mr-3 size-4 shrink-0" />

                                    <span className="min-w-0">
                                        <span className="block truncate font-medium">
                                            {user.name}
                                        </span>

                                        <span className="block truncate text-xs text-muted-foreground">
                                            {user.email}
                                        </span>
                                    </span>
                                </Button>
                            ))
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}