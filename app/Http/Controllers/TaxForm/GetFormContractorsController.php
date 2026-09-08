<?php

namespace App\Http\Controllers\TaxForm;

use App\Application\Contractor\Queries\GetContractorsForCompany\GetContractorsForCompanyHandler;
use App\Http\Controllers\Controller;
use App\Http\Requests\TaxForm\GetFormContractorsRequest;
use App\Models\Company;
use Illuminate\Http\JsonResponse;

class GetFormContractorsController extends Controller
{
    public function __invoke(
        GetFormContractorsRequest $request,
        GetContractorsForCompanyHandler $handler,
    ): JsonResponse {
        $authUser = $request->user();

        $companyId = (int) $request->input('company_id');

        /*
         * Determine the owner user.
         *
         * Admin:
         * selected user_id is used.
         *
         * Simple user:
         * logged-in user is always used.
         */
        if ($authUser->hasRole('admin')) {
            $userId = (int) $request->input('user_id');

            if ($userId <= 0) {
                return response()->json([
                    'message' => 'User selection is required.',
                ], 422);
            }

            $selectedUser = \App\Models\User::query()
                ->whereKey($userId)
                ->whereDoesntHave(
                    'roles',
                    function ($query) {
                        $query->where('name', 'admin');
                    }
                )
                ->first();

            if ($selectedUser === null) {
                return response()->json([
                    'message' => 'Invalid user selection.',
                ], 403);
            }
        } else {
            $userId = (int) $authUser->id;
        }

        /*
         * Verify that the selected company belongs
         * to the selected/authorized user.
         */
        $company = Company::query()
            ->whereKey($companyId)
            ->where('user_id', $userId)
            ->first();

        if ($company === null) {
            return response()->json([
                'message' => 'You are not authorized to access this company.',
            ], 403);
        }

        return response()->json([
            'contractors' => $handler->handle($companyId),
        ]);
    }
}