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
import { CreateFormSelector } from './components/create-form-selector';
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

interface DashboardData {
    stats: DashboardStats;
    payers: DashboardPayer[];
}

interface DashboardPageProps {
    dashboard: DashboardData;
}

/*
|--------------------------------------------------------------------------
| Demo Data
|--------------------------------------------------------------------------
|
| These are temporary until the filing module is connected.
|
|--------------------------------------------------------------------------
*/

const filingActivityData = [
    {
        month: 'Jan',
        filed: 8,
        inProgress: 4,
    },
    {
        month: 'Feb',
        filed: 12,
        inProgress: 6,
    },
    {
        month: 'Mar',
        filed: 10,
        inProgress: 8,
    },
    {
        month: 'Apr',
        filed: 16,
        inProgress: 5,
    },
    {
        month: 'May',
        filed: 14,
        inProgress: 7,
    },
    {
        month: 'Jun',
        filed: 20,
        inProgress: 9,
    },
    {
        month: 'Jul',
        filed: 18,
        inProgress: 6,
    },
    {
        month: 'Aug',
        filed: 24,
        inProgress: 8,
    },
    {
        month: 'Sep',
        filed: 21,
        inProgress: 5,
    },
];

const filingStatusData = [
    {
        name: 'Filed',
        value: 42,
        color: '#2563eb',
    },
    {
        name: 'In Progress',
        value: 12,
        color: '#111827',
    },
    {
        name: 'In Cart',
        value: 7,
        color: '#94a3b8',
    },
];

const upcomingDeadlines = [
    {
        id: 1,
        date: 'October 31, 2026',
        title: 'Quarterly filing deadline',
        form: 'Form 941 - Q3',
        status: 'Upcoming',
    },
    {
        id: 2,
        date: 'January 31, 2027',
        title: 'Annual filing deadline',
        form: 'Form 1099 - NEC',
        status: 'Upcoming',
    },
    {
        id: 3,
        date: 'March 31, 2027',
        title: 'Annual information return',
        form: 'Form 1099 - MISC',
        status: 'Upcoming',
    },
];

const recentFilings = [
    {
        id: 1,
        form: 'Form 1099-NEC',
        recipient: 'John Smith',
        filedDate: 'August 28, 2026',
        status: 'Filed',
    },
    {
        id: 2,
        form: 'Form 1099-MISC',
        recipient: 'ABC Services LLC',
        filedDate: 'August 21, 2026',
        status: 'Filed',
    },
    {
        id: 3,
        form: 'Form 941',
        recipient: 'Autolantis Inc.',
        filedDate: 'August 14, 2026',
        status: 'Filed',
    },
];

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
    /*
    |--------------------------------------------------------------------------
    | Payers
    |--------------------------------------------------------------------------
    */

    const payers = dashboard?.payers ?? [];

    /*
    |--------------------------------------------------------------------------
    | Top Payers
    |--------------------------------------------------------------------------
    |
    | Companies with the highest number of contractors/recipients.
    |
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
    |--------------------------------------------------------------------------
    | Payer Chart Data
    |--------------------------------------------------------------------------
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

    return (
        <>
            {/* =========================================================
                HEADER
            ========================================================= */}

            <Header>
                <div className="ms-auto flex items-center space-x-4">
                    <Search />
                    <ThemeSwitch />
                    <ConfigDrawer />
                    <ProfileDropdown />
                </div>
            </Header>

            {/* =========================================================
                MAIN
            ========================================================= */}

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

                        <Button type="button" onClick={() => setCreateFormOpen(true)}>
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
                                dashboard.stats
                                    .forms_in_progress
                            }
                            description="Currently being prepared"
                            icon={Clock3}
                        />

                        <StatCard
                            title="Forms in Cart"
                            value={
                                dashboard.stats.forms_in_cart
                            }
                            description="Ready for filing"
                            icon={ShoppingCart}
                        />

                        <StatCard
                            title="Filed Forms"
                            value={
                                dashboard.stats.filed_forms
                            }
                            description="Successfully filed"
                            icon={FileCheck2}
                        />

                        <StatCard
                            title="Form Credits"
                            value={
                                dashboard.stats.form_credits
                            }
                            description="Available credits"
                            icon={FileText}
                        />

                        <StatCard
                            title="TIN Credits"
                            value={
                                dashboard.stats.tin_credits
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
                            {quickActions.map((action) => {
                                const Icon = action.icon;

                                return (
                                    <Card
                                        key={action.title}
                                        className="group transition-shadow hover:shadow-md"
                                    >
                                        <CardContent className="flex min-h-48 flex-col items-center justify-between p-6 text-center">
                                            <div>
                                                <div className="mx-auto mb-4 flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                                    <Icon className="size-5" />
                                                </div>

                                                <h3 className="font-semibold">
                                                    {action.title}
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
                                                    if (action.action === 'Select Form') {
                                                        setCreateFormOpen(true);
                                                    }
                                                }}
                                            >
                                                {action.action}

                                                <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                                            </Button>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </section>

                    {/* =================================================
                        TOP Companies
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
                                        payers={topPayers}
                                    />
                                )}
                            </CardContent>
                        </Card>

                        {/* =============================================
                            FILED FORMS
                        ============================================= */}

                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>
                                            Filed Forms 2026
                                        </CardTitle>

                                        <CardDescription>
                                            Federal Status
                                        </CardDescription>
                                    </div>

                                    <FileCheck2 className="size-5 text-primary" />
                                </div>
                            </CardHeader>

                            <CardContent>
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
                                                innerRadius={55}
                                                outerRadius={78}
                                                paddingAngle={3}
                                                stroke="#ffffff"
                                                strokeWidth={2}
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
                                        (item) => (
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
                                progress.
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
                                            filingActivityData
                                        }
                                        margin={{
                                            top: 10,
                                            right: 10,
                                            left: -10,
                                            bottom: 0,
                                        }}
                                    >
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
                                            contentStyle={{
                                                borderRadius:
                                                    '8px',
                                                border:
                                                    '1px solid #e5e7eb',
                                                background:
                                                    '#ffffff',
                                            }}
                                        />

                                        <Area
                                            type="monotone"
                                            dataKey="filed"
                                            name="Filed"
                                            stroke="#2563eb"
                                            strokeWidth={2.5}
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
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="mt-4 flex justify-center gap-6">
                                <ChartLegend
                                    color="#2563eb"
                                    label="Filed"
                                />

                                <ChartLegend
                                    color="#111827"
                                    label="In Progress"
                                />
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
                                            filingActivityData
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
                                            contentStyle={{
                                                borderRadius:
                                                    '8px',
                                                border:
                                                    '1px solid #e5e7eb',
                                                background:
                                                    '#ffffff',
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
                                {upcomingDeadlines.map(
                                    (deadline) => (
                                        <div
                                            key={
                                                deadline.id
                                            }
                                            className="rounded-lg border p-4 transition-colors hover:bg-muted/30"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex gap-3">
                                                    <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                                                        <CalendarDays className="size-4" />
                                                    </div>

                                                    <div>
                                                        <p className="font-medium">
                                                            {
                                                                deadline.title
                                                            }
                                                        </p>

                                                        <p className="mt-1 text-sm text-muted-foreground">
                                                            {
                                                                deadline.form
                                                            }
                                                        </p>

                                                        <p className="mt-2 text-sm font-medium">
                                                            {
                                                                deadline.date
                                                            }
                                                        </p>
                                                    </div>
                                                </div>

                                                <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                                                    {
                                                        deadline.status
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                    ),
                                )}
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
                                <div className="space-y-1">
                                    {recentFilings.map(
                                        (filing) => (
                                            <div
                                                key={
                                                    filing.id
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
                                            </div>
                                        ),
                                    )}
                                </div>
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
                                        dashboard.stats
                                            .total_companies
                                    }
                                />

                                <OverviewItem
                                    label="Recipients"
                                    value={
                                        dashboard.stats
                                            .total_recipients
                                    }
                                />

                                <OverviewItem
                                    label="Forms Filed"
                                    value={
                                        dashboard.stats
                                            .filed_forms
                                    }
                                />

                                <OverviewItem
                                    label="Forms In Progress"
                                    value={
                                        dashboard.stats
                                            .forms_in_progress
                                    }
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </Main>
            <CreateFormSelector
                open={createFormOpen}
                onOpenChange={setCreateFormOpen}
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
            {data.length === 0 ? (
                <EmptyPayers />
            ) : (
                <>
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
                                    contentStyle={{
                                        borderRadius:
                                            '8px',
                                        border:
                                            '1px solid #e5e7eb',
                                        background:
                                            '#ffffff',
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
                        associated with each payer.
                    </p>
                </>
            )}
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
                            {/* =====================================
                                COMPANY / PAYER
                            ===================================== */}

                            <td className="px-5 py-4">
                                <Link
                                    href={`/companies/${payer.id}`}
                                    className="font-medium text-primary underline-offset-4 hover:underline"
                                >
                                    {payer.name}
                                </Link>
                            </td>

                            {/* =====================================
                                RECIPIENTS
                            ===================================== */}

                            <td className="px-5 py-4">
                                <Link
                                    href={`/companies/${payer.id}`}
                                    className="font-medium text-primary underline-offset-4 hover:underline"
                                >
                                    {payer.recipients}
                                </Link>
                            </td>

                            {/* =====================================
                                IN PROGRESS
                            ===================================== */}

                            <td className="px-5 py-4">
                                {payer.in_progress}
                            </td>

                            {/* =====================================
                                IN CART
                            ===================================== */}

                            <td className="px-5 py-4">
                                {payer.in_cart}
                            </td>

                            {/* =====================================
                                FILED
                            ===================================== */}

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
| Chart Legend
|--------------------------------------------------------------------------
*/

interface ChartLegendProps {
    color: string;
    label: string;
}

function ChartLegend({
    color,
    label,
}: ChartLegendProps) {
    return (
        <div className="flex items-center gap-2">
            <span
                className="size-2.5 rounded-full"
                style={{
                    backgroundColor: color,
                }}
            />

            <span className="text-xs text-muted-foreground">
                {label}
            </span>
        </div>
    );
}

/*
|--------------------------------------------------------------------------
| Account Overview
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