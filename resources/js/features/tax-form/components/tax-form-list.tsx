import { Link } from '@inertiajs/react';
import { Settings2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import type { FormDefinition } from '../types';

interface TaxFormListProps {
    definitions: FormDefinition[];
}

export function TaxFormList({
    definitions,
}: TaxFormListProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {definitions.map((definition) => (
                <Card key={definition.id}>
                    <CardHeader>
                        <CardTitle>
                            {definition.name}
                        </CardTitle>

                        <CardDescription>
                            Tax Year {definition.tax_year}
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <div className="flex items-center justify-between gap-4">
                            <div className="text-sm text-muted-foreground">
                                {definition.is_active
                                    ? 'Active'
                                    : 'Inactive'}
                            </div>

                            <Button asChild>
                                <Link
                                    href={`/admin/tax-forms/${definition.id}/configuration`}
                                >
                                    <Settings2 className="mr-2 h-4 w-4" />
                                    Manage Fields
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}