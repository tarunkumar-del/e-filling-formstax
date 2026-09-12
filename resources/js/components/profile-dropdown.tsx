import { SignOutDialog } from '@/components/sign-out-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import useDialogState from '@/hooks/use-dialog-state';
import { usePage } from '@inertiajs/react';

interface AuthUser {
    id: number;
    name: string;
    email: string;
    roles: string[];
    avatar?: string | null;
}

interface AuthProps {
    auth: {
        user: AuthUser | null;
    };
}

export function ProfileDropdown() {
    const [open, setOpen] = useDialogState();

    const { auth } = usePage().props as unknown as AuthProps;

    const user = auth.user;

    if (!user) {
        return null;
    }

    const displayName = user.name || 'User';
    const displayEmail = user.email || '';

    const role = user.roles?.[0] || 'user';

    const displayRole =
        role.toLowerCase() === 'admin' ? 'Administrator' : '';

    const initials =
        displayName
            .trim()
            .split(/\s+/)
            .filter(Boolean)
            .map((name) => name.charAt(0))
            .join('')
            .slice(0, 2)
            .toUpperCase() || 'U';

    return (
        <>
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="relative h-8 w-8 rounded-full"
                    >
                        <Avatar className="h-8 w-8">
                            <AvatarImage
                                src={user.avatar || '/avatars/01.png'}
                                alt={displayName}
                            />

                            <AvatarFallback>
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    className="w-56"
                    align="end"
                    forceMount
                >
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col gap-1.5">
                            <p className="text-sm leading-none font-medium">
                                {displayName}
                            </p>

                            <p className="text-xs leading-none text-muted-foreground">
                                {displayEmail}
                            </p>

                            <p className="text-xs leading-none font-medium text-primary">
                                {displayRole}
                            </p>
                        </div>
                    </DropdownMenuLabel>

                    {/* <DropdownMenuSeparator />

                    <DropdownMenuGroup>
                        <DropdownMenuItem asChild>
                            <a href="/settings">
                                Profile
                                <DropdownMenuShortcut>
                                    ⇧⌘P
                                </DropdownMenuShortcut>
                            </a>
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild>
                            <a href="/settings">
                                Billing
                                <DropdownMenuShortcut>
                                    ⌘B
                                </DropdownMenuShortcut>
                            </a>
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild>
                            <a href="/settings">
                                Settings
                                <DropdownMenuShortcut>
                                    ⌘S
                                </DropdownMenuShortcut>
                            </a>
                        </DropdownMenuItem>

                        <DropdownMenuItem>
                            New Team
                        </DropdownMenuItem>
                    </DropdownMenuGroup> */}

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                        variant="destructive"
                        onClick={() => setOpen(true)}
                    >
                        Sign out

                        <DropdownMenuShortcut className="text-current">
                            ⇧⌘Q
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <SignOutDialog
                open={!!open}
                onOpenChange={setOpen}
            />
        </>
    );
}