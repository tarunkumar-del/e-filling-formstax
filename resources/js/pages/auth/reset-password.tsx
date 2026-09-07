import { ResetPassword as ResetPasswordFeature } from '@/features/auth/reset-password';

interface ResetPasswordPageProps {
    token: string;
}

export default function ResetPasswordPage({
    token,
}: ResetPasswordPageProps) {
    return <ResetPasswordFeature token={token} />;
}