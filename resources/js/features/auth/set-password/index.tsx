import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { usePage } from '@inertiajs/react';
import { AuthLayout } from '../auth-layout';
import { SetPasswordForm } from './components/set-password-form';

interface SetPasswordPageProps {
    token: string;
}

export function SetPassword() {
    const { token } = usePage().props as unknown as SetPasswordPageProps;

    return (
        <AuthLayout>
            <Card className="gap-4">
                <CardHeader>
                    <CardTitle className="text-lg tracking-tight">
                        Create your password
                    </CardTitle>

                    <CardDescription>
                        Create a secure password to finish setting up your
                        account.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <SetPasswordForm token={token} />
                </CardContent>
            </Card>
        </AuthLayout>
    );
}