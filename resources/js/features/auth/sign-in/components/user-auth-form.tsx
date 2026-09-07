import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/password-input';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
    email: z.email({
        error: (iss) =>
            iss.input === ''
                ? 'Please enter your email.'
                : 'Please enter a valid email address.',
    }),

    password: z
        .string()
        .min(1, 'Please enter your password.'),

    redirect: z.string().optional(),
});

type UserAuthFormData = z.infer<typeof formSchema>;

interface UserAuthFormProps
    extends React.HTMLAttributes<HTMLFormElement> {
    redirectTo?: string;
}

export function UserAuthForm({
    className,
    redirectTo,
    ...props
}: UserAuthFormProps) {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<UserAuthFormData>({
        resolver: zodResolver(formSchema),

        defaultValues: {
            email: '',
            password: '',
            redirect: redirectTo,
        },
    });

    function onSubmit(data: UserAuthFormData) {
        setIsLoading(true);

        form.clearErrors();

        router.post('/sign-in', data, {
            onError: (errors) => {
                console.log('BACKEND ERRORS:', errors);

                if (errors.email) {
                    form.setError('email', {
                        type: 'server',
                        message: errors.email,
                    });
                }

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
                {/* Email */}
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>

                            <FormControl>
                                <Input
                                    type="email"
                                    placeholder="name@example.com"
                                    {...field}
                                    onChange={(event) => {
                                        field.onChange(event);

                                        if (
                                            form.formState.errors.email
                                                ?.type === 'server'
                                        ) {
                                            form.clearErrors('email');
                                        }
                                    }}
                                />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Password */}
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex items-center justify-between">
                                <FormLabel>Password</FormLabel>

                                <a
                                    href="/forgot-password"
                                    className="text-sm underline underline-offset-4 hover:text-primary"
                                >
                                    Forgot password?
                                </a>
                            </div>

                            <FormControl>
                                <PasswordInput
                                    placeholder="Enter your password"
                                    {...field}
                                    onChange={(event) => {
                                        field.onChange(event);

                                        if (
                                            form.formState.errors.password
                                                ?.type === 'server'
                                        ) {
                                            form.clearErrors('password');
                                        }
                                    }}
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
                            Signing in...
                            <Loader2 className="animate-spin" />
                        </>
                    ) : (
                        'Sign In'
                    )}
                </Button>
            </form>
        </Form>
    );
}