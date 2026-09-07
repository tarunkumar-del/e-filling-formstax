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
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
    email: z.email({
        error: (iss) =>
            iss.input === ''
                ? 'Please enter your email'
                : 'Please enter a valid email address',
    }),
});

type ForgotPasswordFormData = z.infer<typeof formSchema>;

export function ForgotPasswordForm({
    className,
    ...props
}: React.HTMLAttributes<HTMLFormElement>) {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
        },
    });

    function onSubmit(data: ForgotPasswordFormData) {
        setIsLoading(true);

        form.clearErrors();

        router.post('/forgot-password', data, {
            onError: (errors) => {
                if (errors.email) {
                    form.setError('email', {
                        type: 'server',
                        message: errors.email,
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
                className={cn('grid gap-2', className)}
                {...props}
            >
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

                <Button
                    type="submit"
                    className="mt-2"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            Sending...
                            <Loader2 className="animate-spin" />
                        </>
                    ) : (
                        <>
                            Continue
                            <ArrowRight />
                        </>
                    )}
                </Button>
            </form>
        </Form>
    );
}