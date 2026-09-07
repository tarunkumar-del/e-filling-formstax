'use client';

import {
    DataTablePagination,
    DataTableToolbar,
} from '@/components/data-table';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { router } from '@inertiajs/react';
import {
    type ColumnFiltersState,
    type SortingState,
    type VisibilityState,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { type User } from '../data/schema';
import { usersColumns } from './users-columns';

type UsersPagination = {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
};

type DataTableProps = {
    data: User[];
    pagination: UsersPagination;
};

const USERS_URL = '/admin/users';

function parseArrayParam(
    value: string | null,
): string[] {
    if (!value) {
        return [];
    }

    try {
        const parsed = JSON.parse(value);

        return Array.isArray(parsed)
            ? parsed.map(String)
            : [];
    } catch {
        return [];
    }
}

export function UsersTable({
    data,
    pagination: backendPagination,
}: DataTableProps) {
    const searchParams =
        new URLSearchParams(
            window.location.search,
        );

    const usernameParam =
        searchParams.get('username') ?? '';

    const roleParam = parseArrayParam(
        searchParams.get('role'),
    );

    const pageParam =
        searchParams.get('page');

    const pageSizeParam =
        searchParams.get('pageSize');

    const [rowSelection, setRowSelection] =
        useState({});

    const [sorting, setSorting] =
        useState<SortingState>([]);

    const [columnVisibility, setColumnVisibility] =
        useState<VisibilityState>({});

    const [columnFilters, setColumnFilters] =
        useState<ColumnFiltersState>(() => {
            const filters: ColumnFiltersState = [];

            if (usernameParam) {
                filters.push({
                    id: 'username',
                    value: usernameParam,
                });
            }

            /*
             * Kept only so old URLs containing
             * ?role=... do not break.
             *
             * There is no Role filter in the UI.
             */
            if (roleParam.length > 0) {
                filters.push({
                    id: 'role',
                    value: roleParam,
                });
            }

            return filters;
        });

    const [pagination, setPagination] =
        useState({
            pageIndex: pageParam
                ? Math.max(
                      parseInt(
                          pageParam,
                          10,
                      ) - 1,
                      0,
                  )
                : Math.max(
                      backendPagination.current_page -
                          1,
                      0,
                  ),

            pageSize: pageSizeParam
                ? Math.min(
                      Math.max(
                          parseInt(
                              pageSizeParam,
                              10,
                          ),
                          1,
                      ),
                      100,
                  )
                : backendPagination.per_page,
        });

    /*
     * Navigate to backend and request
     * only the users prop.
     */
    const navigateWithQuery = (
        params: URLSearchParams,
    ) => {
        const queryString =
            params.toString();

        const url = queryString
            ? `${USERS_URL}?${queryString}`
            : USERS_URL;

        window.history.replaceState(
            {},
            '',
            url,
        );

        router.reload({
            only: ['users'],
            preserveScroll: true,
            preserveState: true,
        });
    };

    /*
     * Search/filter
     */
    const handleColumnFiltersChange = (
        updater:
            | ColumnFiltersState
            | ((
                  old: ColumnFiltersState,
              ) => ColumnFiltersState),
    ) => {
        const newFilters =
            typeof updater === 'function'
                ? updater(columnFilters)
                : updater;

        setColumnFilters(newFilters);

        const params =
            new URLSearchParams(
                window.location.search,
            );

        /*
         * Start search from page 1.
         */
        params.delete('page');

        params.delete('username');
        params.delete('role');

        newFilters.forEach((filter) => {
            if (
                filter.id === 'username' &&
                typeof filter.value ===
                    'string' &&
                filter.value.trim()
            ) {
                params.set(
                    'username',
                    filter.value.trim(),
                );
            }

            /*
             * Backward compatibility only.
             */
            if (
                filter.id === 'role' &&
                Array.isArray(filter.value) &&
                filter.value.length > 0
            ) {
                params.set(
                    'role',
                    JSON.stringify(
                        filter.value,
                    ),
                );
            }
        });

        setPagination((current) => ({
            ...current,
            pageIndex: 0,
        }));

        navigateWithQuery(params);
    };

    /*
     * Server-side pagination
     */
    const handlePaginationChange = (
        updater:
            | typeof pagination
            | ((
                  old: typeof pagination,
              ) => typeof pagination),
    ) => {
        const newPagination =
            typeof updater === 'function'
                ? updater(pagination)
                : updater;

        setPagination(newPagination);

        const params =
            new URLSearchParams(
                window.location.search,
            );

        const page =
            newPagination.pageIndex + 1;

        if (page > 1) {
            params.set(
                'page',
                String(page),
            );
        } else {
            params.delete('page');
        }

        if (
            newPagination.pageSize !== 10
        ) {
            params.set(
                'pageSize',
                String(
                    newPagination.pageSize,
                ),
            );
        } else {
            params.delete('pageSize');
        }

        navigateWithQuery(params);
    };

    const columns = useMemo(
        () => usersColumns,
        [],
    );

    // eslint-disable-next-line react-hooks/incompatible-library
    const table = useReactTable({
        data,
        columns,

        state: {
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
            pagination,
        },

        enableRowSelection: true,

        onRowSelectionChange:
            setRowSelection,

        onSortingChange:
            setSorting,

        onColumnVisibilityChange:
            setColumnVisibility,

        onColumnFiltersChange:
            handleColumnFiltersChange,

        /*
         * Search is handled by Laravel.
         */
        manualFiltering: true,

        /*
         * Pagination is handled by Laravel.
         */
        manualPagination: true,

        pageCount:
            backendPagination.last_page,

        onPaginationChange:
            handlePaginationChange,

        getCoreRowModel:
            getCoreRowModel(),

        getSortedRowModel:
            getSortedRowModel(),
    });

    return (
        <div
            className={cn(
                'max-sm:has-[div[role="toolbar"]]:mb-16',
                'flex flex-1 flex-col gap-4',
            )}
        >
            <DataTableToolbar
                table={table}
                searchPlaceholder="Search users..."
                searchKey="username"
                filters={[]}
            />

            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        {table
                            .getHeaderGroups()
                            .map(
                                (
                                    headerGroup,
                                ) => (
                                    <TableRow
                                        key={
                                            headerGroup.id
                                        }
                                        className="group/row"
                                    >
                                        {headerGroup.headers.map(
                                            (
                                                header,
                                            ) => (
                                                <TableHead
                                                    key={
                                                        header.id
                                                    }
                                                    colSpan={
                                                        header.colSpan
                                                    }
                                                    className={cn(
                                                        'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
                                                        header
                                                            .column
                                                            .columnDef
                                                            .meta
                                                            ?.className,
                                                        header
                                                            .column
                                                            .columnDef
                                                            .meta
                                                            ?.thClassName,
                                                    )}
                                                >
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(
                                                              header
                                                                  .column
                                                                  .columnDef
                                                                  .header,
                                                              header.getContext(),
                                                          )}
                                                </TableHead>
                                            ),
                                        )}
                                    </TableRow>
                                ),
                            )}
                    </TableHeader>

                    <TableBody>
                        {table.getRowModel()
                            .rows?.length ? (
                            table
                                .getRowModel()
                                .rows.map(
                                    (
                                        row,
                                    ) => (
                                        <TableRow
                                            key={
                                                row.id
                                            }
                                            data-state={
                                                row.getIsSelected() &&
                                                'selected'
                                            }
                                            className="group/row"
                                        >
                                            {row
                                                .getVisibleCells()
                                                .map(
                                                    (
                                                        cell,
                                                    ) => (
                                                        <TableCell
                                                            key={
                                                                cell.id
                                                            }
                                                            className={cn(
                                                                'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
                                                                cell
                                                                    .column
                                                                    .columnDef
                                                                    .meta
                                                                    ?.className,
                                                                cell
                                                                    .column
                                                                    .columnDef
                                                                    .meta
                                                                    ?.tdClassName,
                                                            )}
                                                        >
                                                            {flexRender(
                                                                cell
                                                                    .column
                                                                    .columnDef
                                                                    .cell,
                                                                cell.getContext(),
                                                            )}
                                                        </TableCell>
                                                    ),
                                                )}
                                        </TableRow>
                                    ),
                                )
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={
                                        columns.length
                                    }
                                    className="h-24 text-center"
                                >
                                    No users found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <DataTablePagination
                table={table}
                className="mt-auto"
            />
        </div>
    );
}