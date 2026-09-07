import { PasswordInput } from '@/components/password-input';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

interface SetPasswordFormProps
    extends React.HTMLAttributes<HTMLFormElement> {
    token: string;
}

const formSchema = z
    .object({
        password: z
            .string()
            .min(1, 'Please enter your password.')
            .min(8, 'Password must be at least 8 characters long.'),

        confirmPassword: z
            .string()
            .min(1, 'Please confirm your password.'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match.",
        path: ['confirmPassword'],
    });

export function SetPasswordForm({
    token,
    className,
    ...props
}: SetPasswordFormProps) {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),

        defaultValues: {
            password: '',
            confirmPassword: '',
        },
    });

    function onSubmit(data: z.infer<typeof formSchema>) {
        setIsLoading(true);

        router.post(
            `/set-password/${token}`,
            {
                password: data.password,
                password_confirmation: data.confirmPassword,
            },
            {
                onSuccess: () => {
                    console.log('Password created successfully.');
                },

                onError: (errors) => {
                    console.log('BACKEND ERRORS:', errors);

                    if (errors.password) {
                        form.setError('password', {
                            type: 'server',
                            message: errors.password,
                        });
                    }
                },

                onFinish: () => {
                    setIsLoading(false);
                },
            },
        );
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={cn('grid gap-4', className)}
                {...props}
            >
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>

                            <FormControl>
                                <PasswordInput
                                    placeholder="Enter your password"
                                    {...field}
                                />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirm Password</FormLabel>

                            <FormControl>
                                <PasswordInput
                                    placeholder="Confirm your password"
                                    {...field}
                                />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button
                    type="submit"
                    className="mt-2"
                    disabled={isLoading}
                >
                    {isLoading
                        ? 'Creating Password...'
                        : 'Create Password'}
                </Button>
            </form>
        </Form>
    );
}