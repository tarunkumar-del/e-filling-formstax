'use client';

import { ConfirmDialog } from '@/components/confirm-dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { router } from '@inertiajs/react';
import { AlertTriangle, Building2, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { type User } from '../data/schema';

type UserDeleteDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    currentRow: User;
};

export function UsersDeleteDialog({
    open,
    onOpenChange,
    currentRow,
}: UserDeleteDialogProps) {
    const [value, setValue] = useState('');
    const [processing, setProcessing] = useState(false);

    const hasCompanies = currentRow.companyCount > 0;

    useEffect(() => {
        if (!open) {
            setValue('');
            setProcessing(false);
        }
    }, [open]);

    const handleDelete = () => {
        // User has companies -> deletion is not allowed.
        if (hasCompanies) {
            return;
        }

        // Username confirmation required.
        if (value.trim() !== currentRow.username) {
            return;
        }

        setProcessing(true);

        router.delete(`/admin/users/${currentRow.id}`, {
            preserveScroll: true,

            onSuccess: () => {
                onOpenChange(false);
            },

            onFinish: () => {
                setProcessing(false);
            },
        });
    };

    return (
        <ConfirmDialog
            open={open}
            onOpenChange={(state) => {
                if (!processing) {
                    onOpenChange(state);
                }
            }}
            handleConfirm={handleDelete}
            disabled={
                hasCompanies ||
                processing ||
                value.trim() !== currentRow.username
            }
            title={
                <span className="text-destructive">
                    <AlertTriangle
                        className="me-1 inline-block stroke-destructive"
                        size={18}
                    />
                    Delete User
                </span>
            }
            desc={
                <div className="space-y-4">
                    {hasCompanies ? (
                        <>
                            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                                <div className="flex items-start gap-3">
                                    <Building2
                                        className="mt-0.5 shrink-0 text-destructive"
                                        size={20}
                                    />

                                    <div className="space-y-1">
                                        <p className="font-semibold text-destructive">
                                            User cannot be deleted
                                        </p>

                                        <p className="text-sm text-muted-foreground">
                                            <span className="font-medium text-foreground">
                                                {currentRow.username}
                                            </span>{' '}
                                            has{' '}
                                            <span className="font-semibold text-foreground">
                                                {currentRow.companyCount}{' '}
                                                {currentRow.companyCount === 1
                                                    ? 'company'
                                                    : 'companies'}
                                            </span>{' '}
                                            associated with their account.
                                        </p>

                                        <p className="text-sm text-muted-foreground">
                                            Please remove  all
                                            associated companies before
                                            deleting this user.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <Alert variant="destructive">
                                <AlertTriangle className="h-4 w-4" />

                                <AlertTitle>
                                    Deletion blocked
                                </AlertTitle>

                                <AlertDescription>
                                    This user cannot be deleted while they
                                    have associated companies.
                                </AlertDescription>
                            </Alert>
                        </>
                    ) : (
                        <>
                            <p className="mb-2">
                                Are you sure you want to delete{' '}
                                <span className="font-bold">
                                    {currentRow.username}
                                </span>
                                ?
                                <br />
                                This action will permanently remove the user
                                from the system. This cannot be undone.
                            </p>

                            <Label className="my-2 flex flex-col items-start gap-1.5">
                                <span>Username:</span>

                                <Input
                                    value={value}
                                    onChange={(e) =>
                                        setValue(e.target.value)
                                    }
                                    placeholder="Enter username to confirm deletion."
                                    disabled={processing}
                                />
                        </Label>

                            <Alert variant="destructive">
                                <AlertTriangle className="h-4 w-4" />

                                <AlertTitle>Warning!</AlertTitle>

                                <AlertDescription>
                                    Please be careful, this operation cannot
                                    be rolled back.
                                </AlertDescription>
                            </Alert>
                        </>
                    )}
                </div>
            }
            confirmText={processing ? 'Deleting...' : 'Delete'}
            destructive
        />
    );
}