import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { ResetPasswordForm } from './components/reset-password-form';
import { AuthLayout } from '../auth-layout';

interface ResetPasswordProps {
    token: string;
}

export function ResetPassword({ token }: ResetPasswordProps) {
    return (
        <AuthLayout>
            <Card className="gap-4">
                <CardHeader>
                    <CardTitle className="text-lg tracking-tight">
                        Reset Password
                    </CardTitle>

                    <CardDescription>
                        Enter your new password below.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <ResetPasswordForm token={token} />
                </CardContent>
            </Card>
        </AuthLayout>
    );
}