<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Normal user dashboard.
     */
    public function index(Request $request): Response
    {
        return $this->renderDashboard(
            $request,
            false
        );
    }

    /**
     * Admin dashboard.
     */
    public function admin(Request $request): Response
    {
        return $this->renderDashboard(
            $request,
            true
        );
    }

    /**
     * Build dashboard data.
     */
    private function renderDashboard(
        Request $request,
        bool $isAdmin
    ): Response {
        /*
        |--------------------------------------------------------------------------
        | Companies / Payers
        |--------------------------------------------------------------------------
        |
        | Normal user:
        |   Only companies owned by logged-in user.
        |
        | Admin:
        |   ALL companies in the system.
        |
        */

        $companiesQuery = Company::query()
            ->withCount('contractors')
            ->orderBy('business_entity_name');

        if (! $isAdmin) {
            $companiesQuery->where(
                'user_id',
                $request->user()->id
            );
        }

        $companies = $companiesQuery
            ->get()
            ->map(function (Company $company) {
                return [
                    'id' => $company->id,

                    /*
                    |--------------------------------------------------------------------------
                    | Payer = Company
                    |--------------------------------------------------------------------------
                    */

                    'name' => $company->business_entity_name,

                    /*
                    |--------------------------------------------------------------------------
                    | Recipients = Contractors
                    |--------------------------------------------------------------------------
                    */

                    'recipients' => $company->contractors_count,

                    /*
                    |--------------------------------------------------------------------------
                    | Filing counts
                    |--------------------------------------------------------------------------
                    |
                    | These will be connected to the actual filing
                    | module later.
                    |
                    */

                    'in_progress' => 0,
                    'in_cart' => 0,
                    'filed' => 0,
                ];
            })
            ->values();

        /*
        |--------------------------------------------------------------------------
        | Dashboard totals
        |--------------------------------------------------------------------------
        */

        $totalRecipients = $companies->sum(
            'recipients'
        );

        return Inertia::render(
            'authenticated/dashboard',
            [
                'dashboard' => [
                    'stats' => [
                        'forms_in_progress' => 0,
                        'forms_in_cart' => 0,
                        'filed_forms' => 0,
                        'form_credits' => 0,
                        'tin_credits' => 0,

                        /*
                        |--------------------------------------------------------------------------
                        | Company / Recipient totals
                        |--------------------------------------------------------------------------
                        */

                        'total_companies' => $companies->count(),
                        'total_recipients' => $totalRecipients,
                    ],

                    /*
                    |--------------------------------------------------------------------------
                    | Payers
                    |--------------------------------------------------------------------------
                    */

                    'payers' => $companies,

                    /*
                    |--------------------------------------------------------------------------
                    | Dashboard mode
                    |--------------------------------------------------------------------------
                    */

                    'is_admin' => $isAdmin,
                ],
            ]
        );
    }
}