import { useEffect, useState } from 'react';
import { CheckCircle2, X, XCircle } from 'lucide-react';
import { usePage } from '@inertiajs/react';

import type { SharedData } from '@/types';

type ToastType = 'success' | 'error';

interface Toast {
    id: number;
    type: ToastType;
    message: string;
}

export function FlashToast() {
    const { flash } =
        usePage<SharedData>().props;

    const [toasts, setToasts] = useState<Toast[]>(
        [],
    );

    /*
    |--------------------------------------------------------------------------
    | Success Flash
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (!flash?.success) {
            return;
        }

        const id = Date.now();

        setToasts((current) => [
            ...current,
            {
                id,
                type: 'success',
                message: flash.success as string,
            },
        ]);

        const timeout = window.setTimeout(() => {
            setToasts((current) =>
                current.filter(
                    (toast) => toast.id !== id,
                ),
            );
        }, 4000);

        return () => {
            window.clearTimeout(timeout);
        };
    }, [flash?.success]);

    /*
    |--------------------------------------------------------------------------
    | Error Flash
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (!flash?.error) {
            return;
        }

        const id = Date.now();

        setToasts((current) => [
            ...current,
            {
                id,
                type: 'error',
                message: flash.error as string,
            },
        ]);

        const timeout = window.setTimeout(() => {
            setToasts((current) =>
                current.filter(
                    (toast) => toast.id !== id,
                ),
            );
        }, 5000);

        return () => {
            window.clearTimeout(timeout);
        };
    }, [flash?.error]);

    /*
    |--------------------------------------------------------------------------
    | Remove Toast
    |--------------------------------------------------------------------------
    */

    const removeToast = (id: number) => {
        setToasts((current) =>
            current.filter(
                (toast) => toast.id !== id,
            ),
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    if (toasts.length === 0) {
        return null;
    }

    return (
        <div className="pointer-events-none fixed right-4 top-4 z-[9999] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className="pointer-events-auto flex items-start gap-3 rounded-lg border bg-background p-4 shadow-lg"
                    role="status"
                    aria-live="polite"
                >
                    {/* Icon */}

                    <div className="mt-0.5 shrink-0">
                        {toast.type === 'success' ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : (
                            <XCircle className="h-5 w-5 text-red-600" />
                        )}
                    </div>

                    {/* Content */}

                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold">
                            {toast.type ===
                            'success'
                                ? 'Success'
                                : 'Error'}
                        </p>

                        <p className="mt-1 text-sm text-muted-foreground">
                            {toast.message}
                        </p>
                    </div>

                    {/* Close */}

                    <button
                        type="button"
                        onClick={() =>
                            removeToast(
                                toast.id,
                            )
                        }
                        className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        aria-label="Close notification"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            ))}
        </div>
    );
}