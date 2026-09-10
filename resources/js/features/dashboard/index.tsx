import {
    Activity,
    ArrowRight,
    CalendarDays,
    CheckCircle2,
    Clock3,
    FileCheck2,
    FileText,
    FileUp,
    Link2,
    ShoppingCart,
    UserPlus,
    Users,
} from 'lucide-react';

import { useMemo, useState } from 'react';

import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

import { ConfigDrawer } from '@/components/config-drawer';
import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';

import { Button } from '@/components/ui/button';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import { Link, usePage } from '@inertiajs/react';

import { CreateFormSelector } from './components/create-form-selector';

/*
|--------------------------------------------------------------------------
| Types
|--------------------------------------------------------------------------
*/

interface DashboardPayer {
    id: number;
    name: string;
    recipients: number;
    in_progress: number;
    in_cart: number;
    filed: number;
}

interface DashboardStats {
    forms_in_progress: number;
    forms_in_cart: number;
    filed_forms: number;
    form_credits: number;
    tin_credits: number;
    total_companies: number;
    total_recipients: number;
}

interface FilingActivity {
    month: string;
    filed: number;
    inProgress: number;
}

interface RecentFiling {
    id: number;
    form: string;
    recipient: string;
    filedDate: string;
    status: string;
}

interface DashboardData {
    stats: DashboardStats;
    payers: DashboardPayer[];
    filing_activity: FilingActivity[];
    recent_filings: RecentFiling[];
}

interface DashboardPageProps {
    dashboard: DashboardData;
    isAdmin?: boolean;
}

/*
|--------------------------------------------------------------------------
| Quick Actions
|--------------------------------------------------------------------------
*/

const quickActions = [
    {
        title: 'Create a Form',
        description:
            'Start a new tax form and enter your filing information.',
        icon: FileText,
        action: 'Select Form',
    },
    {
        title: 'Import My Forms',
        description:
            'Import your existing forms using our Excel template.',
        icon: FileUp,
        action: 'Import Forms',
    },
    {
        title: 'Import Payers & Recipients',
        description:
            'Import payer and recipient information in bulk.',
        icon: Users,
        action: 'Import Data',
    },
    {
        title: 'Connect to Software',
        description:
            'Connect your accounting or payroll software.',
        icon: Link2,
        action: 'Connect Software',
    },
];

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

export function Dashboard() {
    const { dashboard } =
        usePage<DashboardPageProps>().props;

    const [payerView, setPayerView] = useState<
        'chart' | 'table'
    >('chart');

    const [createFormOpen, setCreateFormOpen] =
        useState(false);

    const stats = dashboard?.stats ?? {
        forms_in_progress: 0,
        forms_in_cart: 0,
        filed_forms: 0,
        form_credits: 0,
        tin_credits: 0,
        total_companies: 0,
        total_recipients: 0,
    };

    const payers = dashboard?.payers ?? [];

    const filingActivity =
        dashboard?.filing_activity ?? [];

    const recentFilings =
        dashboard?.recent_filings ?? [];

    /*
     * ---------------------------------------------------------------------
     * Top Companies
     * ---------------------------------------------------------------------
     */

    const topPayers = useMemo(() => {
        return [...payers]
            .sort(
                (a, b) =>
                    b.recipients - a.recipients,
            )
            .slice(0, 10);
    }, [payers]);

    /*
     * ---------------------------------------------------------------------
     * Chart Data
     * ---------------------------------------------------------------------
     */

    const payerChartData = topPayers.map(
        (payer) => ({
            name:
                payer.name.length > 18
                    ? `${payer.name.substring(
                          0,
                          18,
                      )}...`
                    : payer.name,
            recipients: payer.recipients,
        }),
    );

    const filingStatusData = [
        {
            name: 'Filed',
            value: stats.filed_forms,
            color: '#2563eb',
        },
        {
            name: 'In Progress',
            value: stats.forms_in_progress,
            color: '#111827',
        },
        {
            name: 'In Cart',
            value: stats.forms_in_cart,
            color: '#94a3b8',
        },
    ].filter((item) => item.value > 0);

    return (
        <>
            <Header>
                <div className="ms-auto flex items-center space-x-4">
                    <Search />
                    <ThemeSwitch />
                    <ConfigDrawer />
                    <ProfileDropdown />
                </div>
            </Header>

            <Main>
                <div className="space-y-6">
                    {/* =================================================
                        PAGE HEADER
                    ================================================= */}

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Welcome back
                            </p>

                            <h1 className="text-3xl font-bold tracking-tight">
                                Dashboard
                            </h1>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Manage your forms, filings and
                                tax information from one place.
                            </p>
                        </div>

                        <Button
                            type="button"
                            onClick={() =>
                                setCreateFormOpen(true)
                            }
                        >
                            <FileText className="mr-2 size-4" />
                            Create a Form
                        </Button>
                    </div>

                    {/* =================================================
                        SUMMARY
                    ================================================= */}

                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                        <StatCard
                            title="Forms in Progress"
                            value={
                                stats.forms_in_progress
                            }
                            description="Currently being prepared"
                            icon={Clock3}
                        />

                        <StatCard
                            title="Forms in Cart"
                            value={
                                stats.forms_in_cart
                            }
                            description="Ready for filing"
                            icon={ShoppingCart}
                        />

                        <StatCard
                            title="Filed Forms"
                            value={
                                stats.filed_forms
                            }
                            description="Successfully filed"
                            icon={FileCheck2}
                        />

                        <StatCard
                            title="Form Credits"
                            value={
                                stats.form_credits
                            }
                            description="Available credits"
                            icon={FileText}
                        />

                        <StatCard
                            title="TIN Credits"
                            value={
                                stats.tin_credits
                            }
                            description="Available credits"
                            icon={UserPlus}
                        />
                    </div>

                    {/* =================================================
                        QUICK ACTIONS
                    ================================================= */}

                    <section className="space-y-3">
                        <div>
                            <h2 className="text-lg font-semibold">
                                Ready to file a new form?
                            </h2>

                            <p className="text-sm text-muted-foreground">
                                Choose an option below to get started.
                            </p>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                            {quickActions.map(
                                (action) => {
                                    const Icon =
                                        action.icon;

                                    return (
                                        <Card
                                            key={
                                                action.title
                                            }
                                            className="group transition-shadow hover:shadow-md"
                                        >
                                            <CardContent className="flex min-h-48 flex-col items-center justify-between p-6 text-center">
                                                <div>
                                                    <div className="mx-auto mb-4 flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                                        <Icon className="size-5" />
                                                    </div>

                                                    <h3 className="font-semibold">
                                                        {
                                                            action.title
                                                        }
                                                    </h3>

                                                    <p className="mt-2 text-sm leading-5 text-muted-foreground">
                                                        {
                                                            action.description
                                                        }
                                                    </p>
                                                </div>

                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    className="mt-5 w-full"
                                                    onClick={() => {
                                                        if (
                                                            action.action ===
                                                            'Select Form'
                                                        ) {
                                                            setCreateFormOpen(
                                                                true,
                                                            );
                                                        }
                                                    }}
                                                >
                                                    {
                                                        action.action
                                                    }

                                                    <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    );
                                },
                            )}
                        </div>
                    </section>

                    {/* =================================================
                        COMPANIES + STATUS
                    ================================================= */}

                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
                        <Card className="lg:col-span-5">
                            <CardHeader>
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                    <div>
                                        <CardTitle>
                                            Companies
                                        </CardTitle>

                                        <CardDescription>
                                            Your companies and
                                            their recipients.
                                        </CardDescription>
                                    </div>

                                    <div className="flex items-center gap-1 rounded-lg border bg-muted/40 p-1">
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant={
                                                payerView ===
                                                'chart'
                                                    ? 'default'
                                                    : 'ghost'
                                            }
                                            onClick={() =>
                                                setPayerView(
                                                    'chart',
                                                )
                                            }
                                        >
                                            Chart View
                                        </Button>

                                        <Button
                                            type="button"
                                            size="sm"
                                            variant={
                                                payerView ===
                                                'table'
                                                    ? 'default'
                                                    : 'ghost'
                                            }
                                            onClick={() =>
                                                setPayerView(
                                                    'table',
                                                )
                                            }
                                        >
                                            Table View
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent>
                                {topPayers.length === 0 ? (
                                    <EmptyPayers />
                                ) : payerView ===
                                  'chart' ? (
                                    <PayerChart
                                        data={
                                            payerChartData
                                        }
                                    />
                                ) : (
                                    <PayerTable
                                        payers={
                                            topPayers
                                        }
                                    />
                                )}
                            </CardContent>
                        </Card>

                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>
                                            Form Status
                                        </CardTitle>

                                        <CardDescription>
                                            Current form status
                                        </CardDescription>
                                    </div>

                                    <FileCheck2 className="size-5 text-primary" />
                                </div>
                            </CardHeader>

                            <CardContent>
                                {filingStatusData.length ===
                                0 ? (
                                    <div className="flex h-[220px] items-center justify-center text-sm text-muted-foreground">
                                        No forms yet.
                                    </div>
                                ) : (
                                    <>
                                        <div className="h-[220px] w-full">
                                            <ResponsiveContainer
                                                width="100%"
                                                height="100%"
                                            >
                                                <PieChart>
                                                    <Pie
                                                        data={
                                                            filingStatusData
                                                        }
                                                        dataKey="value"
                                                        nameKey="name"
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={
                                                            55
                                                        }
                                                        outerRadius={
                                                            78
                                                        }
                                                        paddingAngle={
                                                            3
                                                        }
                                                        stroke="#ffffff"
                                                        strokeWidth={
                                                            2
                                                        }
                                                    >
                                                        {filingStatusData.map(
                                                            (
                                                                item,
                                                            ) => (
                                                                <Cell
                                                                    key={
                                                                        item.name
                                                                    }
                                                                    fill={
                                                                        item.color
                                                                    }
                                                                />
                                                            ),
                                                        )}
                                                    </Pie>

                                                    <Tooltip />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>

                                        <div className="space-y-3">
                                            {filingStatusData.map(
                                                (
                                                    item,
                                                ) => (
                                                    <div
                                                        key={
                                                            item.name
                                                        }
                                                        className="flex items-center justify-between"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <span
                                                                className="size-2.5 rounded-full"
                                                                style={{
                                                                    backgroundColor:
                                                                        item.color,
                                                                }}
                                                            />

                                                            <span className="text-sm">
                                                                {
                                                                    item.name
                                                                }
                                                            </span>
                                                        </div>

                                                        <span className="text-sm font-semibold">
                                                            {
                                                                item.value
                                                            }
                                                        </span>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* =================================================
                        FILING ACTIVITY
                    ================================================= */}

                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Filing Activity
                            </CardTitle>

                            <CardDescription>
                                Forms filed and currently in
                                progress during {new Date().getFullYear()}.
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <div className="h-[320px] w-full">
                                <ResponsiveContainer
                                    width="100%"
                                    height="100%"
                                >
                                    <AreaChart
                                        data={
                                            filingActivity
                                        }
                                        margin={{
                                            top: 10,
                                            right: 10,
                                            left: -10,
                                            bottom: 0,
                                        }}
                                    >
                                        <CartesianGrid
                                            stroke="#e5e7eb"
                                            strokeDasharray="3 3"
                                            vertical={false}
                                        />

                                        <XAxis
                                            dataKey="month"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{
                                                fill: '#64748b',
                                                fontSize: 12,
                                            }}
                                        />

                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            allowDecimals={false}
                                            tick={{
                                                fill: '#64748b',
                                                fontSize: 12,
                                            }}
                                        />

                                        <Tooltip
                                            cursor={false}
                                            contentStyle={{
                                                borderRadius: '8px',
                                                border: '1px solid #e5e7eb',
                                                background: '#ffffff',
                                            }}
                                        />

                                        <Area
                                            type="monotone"
                                            dataKey="filed"
                                            name="Filed"
                                            stroke="#2563eb"
                                            strokeWidth={
                                                2.5
                                            }
                                            fill="url(#filedGradient)"
                                        />

                                        <Area
                                            type="monotone"
                                            dataKey="inProgress"
                                            name="In Progress"
                                            stroke="#111827"
                                            strokeWidth={2}
                                            fill="url(#progressGradient)"
                                        />

                                        <defs>
                                            <linearGradient
                                                id="filedGradient"
                                                x1="0"
                                                y1="0"
                                                x2="0"
                                                y2="1"
                                            >
                                                <stop
                                                    offset="5%"
                                                    stopColor="#2563eb"
                                                    stopOpacity={
                                                        0.28
                                                    }
                                                />

                                                <stop
                                                    offset="95%"
                                                    stopColor="#2563eb"
                                                    stopOpacity={
                                                        0.02
                                                    }
                                                />
                                            </linearGradient>

                                            <linearGradient
                                                id="progressGradient"
                                                x1="0"
                                                y1="0"
                                                x2="0"
                                                y2="1"
                                            >
                                                <stop
                                                    offset="5%"
                                                    stopColor="#111827"
                                                    stopOpacity={
                                                        0.18
                                                    }
                                                />

                                                <stop
                                                    offset="95%"
                                                    stopColor="#111827"
                                                    stopOpacity={
                                                        0.01
                                                    }
                                                />
                                            </linearGradient>
                                        </defs>
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* =================================================
                        MONTHLY FILING VOLUME
                    ================================================= */}

                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Monthly Filing Volume
                            </CardTitle>

                            <CardDescription>
                                Number of forms filed each month.
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <div className="h-[280px] w-full">
                                <ResponsiveContainer
                                    width="100%"
                                    height="100%"
                                >
                                    <BarChart
                                        data={
                                            filingActivity
                                        }
                                        margin={{
                                            top: 10,
                                            right: 10,
                                            left: -10,
                                            bottom: 0,
                                        }}
                                    >
                                        <CartesianGrid
                                            stroke="#e5e7eb"
                                            strokeDasharray="3 3"
                                            vertical={false}
                                        />

                                        <XAxis
                                            dataKey="month"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{
                                                fill: '#64748b',
                                                fontSize: 12,
                                            }}
                                        />

                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            allowDecimals={false}
                                            tick={{
                                                fill: '#64748b',
                                                fontSize: 12,
                                            }}
                                        />

                                        <Tooltip
                                            cursor={false}
                                            contentStyle={{
                                                borderRadius: '8px',
                                                border: '1px solid #e5e7eb',
                                                background: '#ffffff',
                                            }}
                                        />

                                        <Bar
                                            dataKey="filed"
                                            name="Filed Forms"
                                            fill="#2563eb"
                                            radius={[
                                                5,
                                                5,
                                                0,
                                                0,
                                            ]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* =================================================
                        DEADLINES + RECENT FILINGS
                    ================================================= */}

                    <div className="grid gap-4 lg:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>
                                            Upcoming Deadlines
                                        </CardTitle>

                                        <CardDescription>
                                            Important filing dates
                                            coming up.
                                        </CardDescription>
                                    </div>

                                    <CalendarDays className="size-5 text-muted-foreground" />
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-3">
                                <Deadline
                                    date="October 31, 2026"
                                    title="Quarterly filing deadline"
                                    form="Form 941 - Q3"
                                />

                                <Deadline
                                    date="January 31, 2027"
                                    title="Annual filing deadline"
                                    form="Form 1099 - NEC"
                                />

                                <Deadline
                                    date="March 31, 2027"
                                    title="Annual information return"
                                    form="Form 1099 - MISC"
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>
                                            Recent Filings
                                        </CardTitle>

                                        <CardDescription>
                                            Your latest filed
                                            forms.
                                        </CardDescription>
                                    </div>

                                    <Activity className="size-5 text-muted-foreground" />
                                </div>
                            </CardHeader>

                            <CardContent>
                                {recentFilings.length ===
                                0 ? (
                                    <div className="flex min-h-[180px] items-center justify-center text-sm text-muted-foreground">
                                        No filed forms yet.
                                    </div>
                                ) : (
                                    <div className="space-y-1">
                                        {recentFilings.map(
                                            (filing) => (
                                                <Link
                                                    key={
                                                        filing.id
                                                    }
                                                    href={
                                                        `/tax-forms/${filing.id}/view`
                                                    }
                                                    className="flex items-center justify-between gap-4 rounded-lg p-3 transition-colors hover:bg-muted/50"
                                                >
                                                    <div className="flex min-w-0 items-center gap-3">
                                                        <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                                                            <FileCheck2 className="size-4" />
                                                        </div>

                                                        <div className="min-w-0">
                                                            <p className="truncate font-medium">
                                                                {
                                                                    filing.form
                                                                }
                                                            </p>

                                                            <p className="truncate text-sm text-muted-foreground">
                                                                {
                                                                    filing.recipient
                                                                }
                                                            </p>

                                                            <p className="mt-0.5 text-xs text-muted-foreground">
                                                                {
                                                                    filing.filedDate
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex shrink-0 items-center gap-1.5 text-sm font-medium text-primary">
                                                        <CheckCircle2 className="size-4" />

                                                        {
                                                            filing.status
                                                        }
                                                    </div>
                                                </Link>
                                            ),
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* =================================================
                        ACCOUNT OVERVIEW
                    ================================================= */}

                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Account Overview
                            </CardTitle>

                            <CardDescription>
                                A quick overview of your account.
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                <OverviewItem
                                    label="Companies"
                                    value={
                                        stats.total_companies
                                    }
                                />

                                <OverviewItem
                                    label="Contractors"
                                    value={
                                        stats.total_recipients
                                    }
                                />

                                <OverviewItem
                                    label="Forms Filed"
                                    value={
                                        stats.filed_forms
                                    }
                                />

                                <OverviewItem
                                    label="Forms In Progress"
                                    value={
                                        stats.forms_in_progress
                                    }
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </Main>

            <CreateFormSelector
                open={createFormOpen}
                onOpenChange={
                    setCreateFormOpen
                }
            />
        </>
    );
}

/*
|--------------------------------------------------------------------------
| Payer Chart
|--------------------------------------------------------------------------
*/

interface PayerChartProps {
    data: {
        name: string;
        recipients: number;
    }[];
}

function PayerChart({
    data,
}: PayerChartProps) {
    return (
        <div className="space-y-4">
            <div className="h-[320px] w-full">
                <ResponsiveContainer
                    width="100%"
                    height="100%"
                >
                    <BarChart
                        data={data}
                        margin={{
                            top: 10,
                            right: 10,
                            left: -10,
                            bottom: 35,
                        }}
                    >
                        <CartesianGrid
                            stroke="#e5e7eb"
                            strokeDasharray="3 3"
                            vertical={false}
                        />

                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            angle={-20}
                            textAnchor="end"
                            height={60}
                            tick={{
                                fill: '#64748b',
                                fontSize: 11,
                            }}
                        />

                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            allowDecimals={false}
                            tick={{
                                fill: '#64748b',
                                fontSize: 12,
                            }}
                        />

                       <Tooltip
                            cursor={false}
                            contentStyle={{
                                borderRadius: '8px',
                                border: '1px solid #e5e7eb',
                                background: '#ffffff',
                            }}
                        />

                        <Bar
                            dataKey="recipients"
                            name="Recipients"
                            fill="#2563eb"
                            radius={[
                                5,
                                5,
                                0,
                                0,
                            ]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <p className="text-center text-sm text-muted-foreground">
                Number of recipients / contractors
                associated with each company.
            </p>
        </div>
    );
}

/*
|--------------------------------------------------------------------------
| Payer Table
|--------------------------------------------------------------------------
*/

interface PayerTableProps {
    payers: DashboardPayer[];
}

function PayerTable({
    payers,
}: PayerTableProps) {
    return (
        <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
                <thead className="bg-muted/50">
                    <tr className="border-b">
                        <th className="px-5 py-3 text-left font-medium">
                            Name
                        </th>

                        <th className="px-5 py-3 text-left font-medium">
                            Recipients
                        </th>

                        <th className="px-5 py-3 text-left font-medium">
                            In Progress
                        </th>

                        <th className="px-5 py-3 text-left font-medium">
                            In Cart
                        </th>

                        <th className="px-5 py-3 text-left font-medium">
                            Filed
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {payers.map((payer) => (
                        <tr
                            key={payer.id}
                            className="border-b last:border-0 hover:bg-muted/40"
                        >
                            <td className="px-5 py-4">
                                <Link
                                    href={`/companies/${payer.id}`}
                                    className="font-medium text-primary underline-offset-4 hover:underline"
                                >
                                    {payer.name}
                                </Link>
                            </td>

                            <td className="px-5 py-4">
                                {payer.recipients}
                            </td>

                            <td className="px-5 py-4">
                                {payer.in_progress}
                            </td>

                            <td className="px-5 py-4">
                                {payer.in_cart}
                            </td>

                            <td className="px-5 py-4">
                                {payer.filed}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

/*
|--------------------------------------------------------------------------
| Empty Payers
|--------------------------------------------------------------------------
*/

function EmptyPayers() {
    return (
        <div className="flex min-h-[320px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Users className="size-6" />
            </div>

            <h3 className="font-semibold">
                No Companies yet
            </h3>

            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Create a company to start managing payers
                and recipients.
            </p>

            <Button className="mt-5">
                <Users className="mr-2 size-4" />
                Add Company
            </Button>
        </div>
    );
}

/*
|--------------------------------------------------------------------------
| Deadline
|--------------------------------------------------------------------------
*/

interface DeadlineProps {
    date: string;
    title: string;
    form: string;
}

function Deadline({
    date,
    title,
    form,
}: DeadlineProps) {
    return (
        <div className="rounded-lg border p-4 transition-colors hover:bg-muted/30">
            <div className="flex items-start justify-between gap-4">
                <div className="flex gap-3">
                    <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                        <CalendarDays className="size-4" />
                    </div>

                    <div>
                        <p className="font-medium">
                            {title}
                        </p>

                        <p className="mt-1 text-sm text-muted-foreground">
                            {form}
                        </p>

                        <p className="mt-2 text-sm font-medium">
                            {date}
                        </p>
                    </div>
                </div>

                <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                    Upcoming
                </span>
            </div>
        </div>
    );
}

/*
|--------------------------------------------------------------------------
| Stat Card
|--------------------------------------------------------------------------
*/

interface StatCardProps {
    title: string;
    value: number | string;
    description: string;
    icon: React.ComponentType<{
        className?: string;
    }>;
}

function StatCard({
    title,
    value,
    description,
    icon: Icon,
}: StatCardProps) {
    return (
        <Card className="transition-shadow hover:shadow-sm">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium">
                    {title}
                </CardTitle>

                <div className="flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Icon className="size-4" />
                </div>
            </CardHeader>

            <CardContent>
                <div className="text-2xl font-bold">
                    {value}
                </div>

                <p className="mt-1 text-xs text-muted-foreground">
                    {description}
                </p>
            </CardContent>
        </Card>
    );
}

/*
|--------------------------------------------------------------------------
| Overview Item
|--------------------------------------------------------------------------
*/

interface OverviewItemProps {
    label: string;
    value: number | string;
}

function OverviewItem({
    label,
    value,
}: OverviewItemProps) {
    return (
        <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">
                {label}
            </p>

            <p className="mt-2 text-2xl font-bold">
                {value}
            </p>
        </div>
    );
}

export default Dashboard;