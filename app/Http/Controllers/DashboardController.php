<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Contractor;
use App\Models\Form;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
final class DashboardController
{
    public function index(Request $request): Response|RedirectResponse
    {
        $user = $request->user();

        abort_unless($user !== null, 401);

        if ($user->hasRole('admin')) {
            return redirect()->route('admin.dashboard');
        }

        if ($user->hasRole('user')) {
            return $this->renderDashboard(
                userId: (int) $user->id,
                isAdmin: false,
            );
        }

        abort(403);
    }

    public function admin(Request $request): Response
    {
        $user = $request->user();

        abort_unless($user !== null, 401);
        abort_unless($user->hasRole('admin'), 403);

        return $this->renderDashboard(
            userId: null,
            isAdmin: true,
        );
    }

    private function renderDashboard(
        ?int $userId,
        bool $isAdmin,
    ): Response {
        $formsQuery = Form::query();

        if ($userId !== null) {
            $formsQuery->where('forms.user_id', $userId);
        }

        $formsInProgress = (clone $formsQuery)
            ->where('status', 'draft')
            ->count();

        $filedForms = (clone $formsQuery)
            ->where('status', 'completed')
            ->count();

        $formsInCart = (clone $formsQuery)
            ->where('status', 'cart')
            ->count();

        $companiesQuery = Company::query();

        if ($userId !== null) {
            $companiesQuery->where('user_id', $userId);
        }

        $totalCompanies = (clone $companiesQuery)->count();

        $contractorsQuery = Contractor::query();

        if ($userId !== null) {
            $contractorsQuery->whereHas(
                'company',
                function ($query) use ($userId): void {
                    $query->where('user_id', $userId);
                }
            );
        }

        $totalRecipients = (clone $contractorsQuery)->count();

        $payers = (clone $companiesQuery)
            ->withCount([
                'contractors as recipients',
            ])
            ->get([
                'id',
                'business_entity_name',
            ])
            ->map(
                function (Company $company) use ($formsQuery): array {
                    $companyForms = (clone $formsQuery)
                        ->where(
                            'forms.company_id',
                            $company->id
                        );

                    return [
                        'id' => (int) $company->id,
                        'name' => (string) (
                            $company->business_entity_name
                            ?: 'Unnamed Company'
                        ),
                        'recipients' => (int) (
                            $company->recipients ?? 0
                        ),
                        'in_progress' => (clone $companyForms)
                            ->where('status', 'draft')
                            ->count(),
                        'in_cart' => (clone $companyForms)
                            ->where('status', 'cart')
                            ->count(),
                        'filed' => (clone $companyForms)
                            ->where('status', 'completed')
                            ->count(),
                    ];
                }
            )
            ->values();

        /*
         * PostgreSQL does not support MySQL's MONTH() function.
         * Use EXTRACT(MONTH FROM created_at) instead.
         */
        $monthlyRows = (clone $formsQuery)
            ->whereYear('created_at', now()->year)
            ->select([
                DB::raw(
                    'EXTRACT(MONTH FROM created_at) as month_number'
                ),
                DB::raw(
                    "SUM(
                        CASE
                            WHEN status = 'completed' THEN 1
                            ELSE 0
                        END
                    ) as filed"
                ),
                DB::raw(
                    "SUM(
                        CASE
                            WHEN status = 'draft' THEN 1
                            ELSE 0
                        END
                    ) as in_progress"
                ),
            ])
            ->groupBy(
                DB::raw('EXTRACT(MONTH FROM created_at)')
            )
            ->orderBy(
                DB::raw('EXTRACT(MONTH FROM created_at)')
            )
            ->get()
            ->keyBy(
                fn($row) => (int) $row->month_number
            );

        $monthlyFilingActivity = collect(range(1, 12))
            ->map(
                function (int $month) use ($monthlyRows): array {
                    $row = $monthlyRows->get($month);

                    return [
                        'month' => now()
                            ->setMonth($month)
                            ->format('M'),
                        'filed' => (int) (
                            $row?->filed ?? 0
                        ),
                        'inProgress' => (int) (
                            $row?->in_progress ?? 0
                        ),
                    ];
                }
            )
            ->values();

        $recentFilings = (clone $formsQuery)
            ->where('status', 'completed')
            ->with([
                'company:id,business_entity_name',
                'contractor:id,company_id,business_entity_name',
            ])
            ->latest('created_at')
            ->limit(5)
            ->get([
                'id',
                'company_id',
                'contractor_id',
                'form_definition_id',
                'status',
                'created_at',
            ])
            ->map(
                function (Form $form): array {
                    $recipient = '—';

                    if (
                        $form->relationLoaded('contractor') &&
                        $form->contractor
                    ) {
                        $recipient =
                            $form->contractor
                                ->business_entity_name
                            ?: 'Contractor';
                    }

                    return [
                        'id' => (int) $form->id,
                        'form' => 'Tax Form',
                        'recipient' => $recipient,
                        'filedDate' => $form->created_at
                            ? $form->created_at->format('F j, Y')
                            : '—',
                        'status' => 'Filed',
                    ];
                }
            )
            ->values();

        /*
         * Credits are currently not connected to a credits table/source.
         * Keep them at zero until the actual credit storage is available.
         */
        $formCredits = 0;
        $tinCredits = 0;

        return Inertia::render(
            'authenticated/dashboard',
            [
                'dashboard' => [
                    'stats' => [
                        'forms_in_progress' => $formsInProgress,
                        'forms_in_cart' => $formsInCart,
                        'filed_forms' => $filedForms,
                        'form_credits' => $formCredits,
                        'tin_credits' => $tinCredits,
                        'total_companies' => $totalCompanies,
                        'total_recipients' => $totalRecipients,
                    ],
                    'payers' => $payers,
                    'filing_activity' => $monthlyFilingActivity,
                    'recent_filings' => $recentFilings,
                ],
                'isAdmin' => $isAdmin,
            ]
        );
    }
}