import { usePage } from '@inertiajs/react';
import type { SharedData } from '@/types';

export function FlashMessage() {
    const { flash } = usePage<SharedData>().props;

    if (flash?.success) {
        return (
            <div className="px-6">
                <div
                    role="alert"
                    className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
                >
                    {flash.success}
                </div>
            </div>
        );
    }

    if (flash?.error) {
        return (
            <div className="px-6">
                <div
                    role="alert"
                    className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                    {flash.error}
                </div>
            </div>
        );
    }

    return null;
}