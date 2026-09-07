import { Logo } from '@/assets/logo';
import { usePage } from '@inertiajs/react';
import type { SharedData } from '@/types';

type AuthLayoutProps = {
    children: React.ReactNode;
};

export function AuthLayout({ children }: AuthLayoutProps) {
    const { name } = usePage<SharedData>().props;

    return (
        <div className="container grid h-svh max-w-none items-center justify-center">
            <div className="mx-auto flex w-full flex-col justify-center space-y-2 py-8 sm:w-[480px] sm:p-8">
                <div className="mb-4 flex items-center justify-center">
                    <Logo className="me-2" />

                    <h1 className="text-xl font-medium">
                        {name}
                    </h1>
                </div>

                {children}
            </div>
        </div>
    );
}