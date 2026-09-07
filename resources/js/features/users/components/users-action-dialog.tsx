'use client';

import { PasswordInput } from '@/components/password-input';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { router } from '@inertiajs/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { type User } from '../data/schema';

const formSchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(1, 'Name is required.')
            .max(255, 'Name must not exceed 255 characters.'),

        email: z
            .string()
            .trim()
            .min(1, 'Email is required.')
            .email('Please enter a valid email address.'),

        password: z.string(),

        password_confirmation: z.string(),

        isEdit: z.boolean(),
    })
    .refine(
        (data) => {
            if (data.isEdit && !data.password) {
                return true;
            }

            return data.password.length > 0;
        },
        {
            message: 'Password is required.',
            path: ['password'],
        },
    )
    .refine(
        (data) => {
            if (data.isEdit && !data.password) {
                return true;
            }

            return data.password.length >= 8;
        },
        {
            message:
                'Password must be at least 8 characters long.',
            path: ['password'],
        },
    )
    .refine(
        (data) => {
            if (data.isEdit && !data.password) {
                return true;
            }

            return /[a-z]/.test(data.password);
        },
        {
            message:
                'Password must contain at least one lowercase letter.',
            path: ['password'],
        },
    )
    .refine(
        (data) => {
            if (data.isEdit && !data.password) {
                return true;
            }

            return /\d/.test(data.password);
        },
        {
            message:
                'Password must contain at least one number.',
            path: ['password'],
        },
    )
    .refine(
        (data) => {
            if (data.isEdit && !data.password) {
                return true;
            }

            return (
                data.password ===
                data.password_confirmation
            );
        },
        {
            message: "Passwords don't match.",
            path: ['password_confirmation'],
        },
    );

type UserForm = z.infer<typeof formSchema>;

type UserActionDialogProps = {
    currentRow?: User;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function UsersActionDialog({
    currentRow,
    open,
    onOpenChange,
}: UserActionDialogProps) {
    const isEdit = !!currentRow;

    /*
     * Request processing state.
     */
    const [processing, setProcessing] =
        useState(false);

    /*
     * React Hook Form.
     *
     * This is now the SINGLE source of truth
     * for the form values.
     */
    const form = useForm<UserForm>({
        resolver: zodResolver(formSchema),

        defaultValues: {
            name: '',
            email: '',
            password: '',
            password_confirmation: '',
            isEdit: false,
        },
    });

    /*
     * Populate form when Add/Edit dialog opens.
     */
    useEffect(() => {
        if (!open) {
            return;
        }

        if (currentRow) {
            const fullName =
                `${currentRow.firstName ?? ''} ${
                    currentRow.lastName ?? ''
                }`
                    .trim()
                    .replace(/\s+/g, ' ');

            form.reset({
                name: fullName,
                email: currentRow.email ?? '',
                password: '',
                password_confirmation: '',
                isEdit: true,
            });
        } else {
            form.reset({
                name: '',
                email: '',
                password: '',
                password_confirmation: '',
                isEdit: false,
            });
        }
    }, [open, currentRow]);

    const isPasswordTouched =
        !!form.formState.dirtyFields.password;

    /*
     * Close dialog.
     */
    const handleClose = (
        state: boolean,
    ) => {
        if (!state && !processing) {
            form.reset();
            form.clearErrors();
        }

        onOpenChange(state);
    };

    /*
     * Submit Add / Edit User.
     */
    const onSubmit = (
        values: UserForm,
    ) => {
        /*
         * IMPORTANT:
         *
         * We directly use React Hook Form values.
         *
         * No setData().
         * No separate Inertia form state.
         *
         * This guarantees the exact values typed
         * by the user are sent to Laravel.
         */
        const payload = {
            name: values.name.trim(),
            email: values.email.trim(),
            password: values.password,
            password_confirmation:
                values.password_confirmation,

            /*
             * Role is always user.
             * There is no role field in the UI.
             */
            role: 'user',
        };

        setProcessing(true);

        /*
         * Clear old backend errors.
         */
        form.clearErrors();

        /*
         * Backend validation errors.
         */
        const handleError = (
            errors: Record<string, string>,
        ) => {
            setProcessing(false);

            Object.entries(errors).forEach(
                ([field, message]) => {
                    if (
                        field === 'name' ||
                        field === 'email' ||
                        field === 'password' ||
                        field ===
                            'password_confirmation'
                    ) {
                        form.setError(
                            field as
                                | 'name'
                                | 'email'
                                | 'password'
                                | 'password_confirmation',
                            {
                                type: 'server',
                                message,
                            },
                        );
                    }
                },
            );
        };

        /*
         * Successful request.
         */
        const handleSuccess = () => {
            setProcessing(false);

            form.reset();
            form.clearErrors();

            onOpenChange(false);
        };

        /*
         * ADD USER
         */
        if (!currentRow) {
            router.post(
                '/admin/users',
                payload,
                {
                    preserveScroll: true,

                    onSuccess:
                        handleSuccess,

                    onError:
                        handleError,

                    onFinish: () => {
                        setProcessing(false);
                    },
                },
            );

            return;
        }

        /*
         * EDIT USER
         */
        router.put(
            `/admin/users/${currentRow.id}`,
            payload,
            {
                preserveScroll: true,

                onSuccess:
                    handleSuccess,

                onError:
                    handleError,

                onFinish: () => {
                    setProcessing(false);
                },
            },
        );
    };

    return (
        <Dialog
            open={open}
            onOpenChange={handleClose}
        >
            <DialogContent className="sm:max-w-lg">
                <DialogHeader className="text-start">
                    <DialogTitle>
                        {isEdit
                            ? 'Edit User'
                            : 'Add New User'}
                    </DialogTitle>

                    <DialogDescription>
                        {isEdit
                            ? 'Update the user information here.'
                            : 'Create a new user account here.'}{' '}
                        Click save when you&apos;re done.
                    </DialogDescription>
                </DialogHeader>

                <div className="max-h-[26.25rem] overflow-y-auto py-1 pe-3">
                    <Form {...form}>
                        <form
                            id="user-form"
                            onSubmit={form.handleSubmit(
                                onSubmit,
                            )}
                            className="space-y-4 px-0.5"
                        >
                            {/* NAME */}
                            <FormField
                                control={form.control}
                                name="name"
                                render={({
                                    field,
                                }) => (
                                    <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                                        <FormLabel className="col-span-2 text-end">
                                            Name
                                        </FormLabel>

                                        <FormControl>
                                            <Input
                                                placeholder="John Doe"
                                                className="col-span-4"
                                                autoComplete="name"
                                                {...field}
                                            />
                                        </FormControl>

                                        <FormMessage className="col-span-4 col-start-3" />
                                    </FormItem>
                                )}
                            />

                            {/* EMAIL */}
                            <FormField
                                control={form.control}
                                name="email"
                                render={({
                                    field,
                                }) => (
                                    <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                                        <FormLabel className="col-span-2 text-end">
                                            Email
                                        </FormLabel>

                                        <FormControl>
                                            <Input
                                                type="email"
                                                placeholder="john.doe@gmail.com"
                                                className="col-span-4"
                                                autoComplete="email"
                                                {...field}
                                            />
                                        </FormControl>

                                        <FormMessage className="col-span-4 col-start-3" />
                                    </FormItem>
                                )}
                            />

                            {/* PASSWORD */}
                            <FormField
                                control={form.control}
                                name="password"
                                render={({
                                    field,
                                }) => (
                                    <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                                        <FormLabel className="col-span-2 text-end">
                                            Password
                                        </FormLabel>

                                        <FormControl>
                                            <PasswordInput
                                                placeholder={
                                                    isEdit
                                                        ? 'Leave blank to keep current password'
                                                        : 'Enter password'
                                                }
                                                className="col-span-4"
                                                autoComplete="new-password"
                                                {...field}
                                            />
                                        </FormControl>

                                        <FormMessage className="col-span-4 col-start-3" />
                                    </FormItem>
                                )}
                            />

                            {/* CONFIRM PASSWORD */}
                            <FormField
                                control={form.control}
                                name="password_confirmation"
                                render={({
                                    field,
                                }) => (
                                    <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                                        <FormLabel className="col-span-2 text-end">
                                            Confirm Password
                                        </FormLabel>

                                        <FormControl>
                                            <PasswordInput
                                                disabled={
                                                    !isPasswordTouched &&
                                                    !isEdit
                                                }
                                                placeholder="Confirm password"
                                                className="col-span-4"
                                                autoComplete="new-password"
                                                {...field}
                                            />
                                        </FormControl>

                                        <FormMessage className="col-span-4 col-start-3" />
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form>
                </div>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                            handleClose(false)
                        }
                        disabled={processing}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        form="user-form"
                        disabled={processing}
                    >
                        {processing
                            ? 'Saving...'
                            : isEdit
                              ? 'Save changes'
                              : 'Create User'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}