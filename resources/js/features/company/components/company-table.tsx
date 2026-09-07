import { Link } from '@inertiajs/react';
import { Eye, Pencil } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import { type Company } from '@/features/company/types';

interface CompanyTableProps {
    companies: Company[];
    onEdit: (company: Company) => void;
    viewUrl: (company: Company) => string;
}

export function CompanyTable({
    companies,
    onEdit,
    viewUrl,
}: CompanyTableProps) {
    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>
                            Business / Entity
                        </TableHead>

                        <TableHead>
                            Email
                        </TableHead>

                        <TableHead>
                            Phone
                        </TableHead>

                        <TableHead className="text-right">
                            Action
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {companies.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={4}
                                className="h-24 text-center text-muted-foreground"
                            >
                                No companies found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        companies.map((company) => (
                            <TableRow key={company.id}>
                                <TableCell className="font-medium">
                                    {company.business_entity_name}
                                </TableCell>

                                <TableCell>
                                    {company.email}
                                </TableCell>

                                <TableCell>
                                    {company.phone}
                                </TableCell>

                                <TableCell>
                                    <div className="flex justify-end gap-2">
                                        {/* View */}
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            asChild
                                        >
                                            <Link
                                                href={viewUrl(company)}
                                            >
                                                <Eye className="mr-2 size-4" />
                                                View
                                            </Link>
                                        </Button>

                                        {/* Edit */}
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            type="button"
                                            onClick={() =>
                                                onEdit(company)
                                            }
                                        >
                                            <Pencil className="mr-2 size-4" />
                                            Edit
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}