<?php

namespace App\Http\Controllers\TaxForm;

use App\Application\Company\Queries\GetCompaniesForUser\GetCompaniesForUserHandler;
use App\Http\Controllers\Controller;
use App\Http\Requests\TaxForm\GetFormCompaniesRequest;
use Illuminate\Http\JsonResponse;

class GetFormCompaniesController extends Controller
{
    public function __invoke(
        GetFormCompaniesRequest $request,
        GetCompaniesForUserHandler $handler,
    ): JsonResponse {
        $authUser = $request->user();

        /*
         * Admin:
         * Use the selected simple user's ID.
         *
         * Simple user:
         * Always use the currently logged-in user's ID.
         */
        if ($authUser->hasRole('admin')) {
            $userId = (int) $request->input('user_id');

            if ($userId <= 0) {
                return response()->json([
                    'message' => 'User selection is required.',
                ], 422);
            }

            /*
             * Admin can only select a simple user.
             */
            $selectedUser = \App\Models\User::query()
                ->whereKey($userId)
                ->whereDoesntHave('roles', function ($query) {
                    $query->where('name', 'admin');
                })
                ->first();

            if ($selectedUser === null) {
                return response()->json([
                    'message' => 'Invalid user selection.',
                ], 403);
            }
        } else {
            /*
             * Simple user can NEVER choose another user.
             */
            $userId = (int) $authUser->id;
        }

        return response()->json([
            'companies' => $handler->handle($userId),
        ]);
    }
}