import { Button } from '@/components/ui/button';
import { PasswordInput } from '@/components/password-input';
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
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z
    .object({
        password: z
            .string()
            .min(1, 'Please enter your password.')
            .min(8, 'Password must be at least 8 characters long.'),

        password_confirmation: z
            .string()
            .min(1, 'Please confirm your password.'),
    })
    .refine(
        (data) => data.password === data.password_confirmation,
        {
            message: "Passwords don't match.",
            path: ['password_confirmation'],
        },
    );

type ResetPasswordFormData = z.infer<typeof formSchema>;

interface ResetPasswordFormProps
    extends React.HTMLAttributes<HTMLFormElement> {
    token: string;
}

export function ResetPasswordForm({
    token,
    className,
    ...props
}: ResetPasswordFormProps) {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<ResetPasswordFormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: '',
            password_confirmation: '',
        },
    });

    function onSubmit(data: ResetPasswordFormData) {
        setIsLoading(true);

        form.clearErrors();

        router.post(`/reset-password/${token}`, data, {
            onError: (errors) => {
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
        });
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
                            <FormLabel>New Password</FormLabel>

                            <FormControl>
                                <PasswordInput
                                    placeholder="Enter your new password"
                                    {...field}
                                />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password_confirmation"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirm Password</FormLabel>

                            <FormControl>
                                <PasswordInput
                                    placeholder="Confirm your new password"
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
                    {isLoading ? (
                        <>
                            Resetting Password...
                            <Loader2 className="animate-spin" />
                        </>
                    ) : (
                        'Reset Password'
                    )}
                </Button>
            </form>
        </Form>
    );
}