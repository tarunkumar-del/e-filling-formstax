import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { AuthLayout } from '../auth-layout';
import { UserAuthForm } from './components/user-auth-form';
import { Link } from '@inertiajs/react';
export function SignIn() {
    const searchParams = new URLSearchParams(window.location.search);

    const redirect =
        searchParams.get('redirect') || undefined;

    return (
        <AuthLayout>
            <Card className="gap-4">
                <CardHeader>
                    <CardTitle className="text-lg tracking-tight">
                        Sign in
                    </CardTitle>

                    <CardDescription>
                        Enter your email and password below to <br />
                        log into your account
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <UserAuthForm
                        redirectTo={redirect}
                    />
                </CardContent>

               <CardFooter>
                    <p className="mx-auto px-8 text-center text-sm text-balance text-muted-foreground">
                        Don't have an account?{' '}
                        <Link
                            href="/sign-up"
                            className="underline underline-offset-4 hover:text-primary"
                        >
                            Sign up
                        </Link>
                        .
                    </p>
                </CardFooter>
            </Card>
        </AuthLayout>
    );
}