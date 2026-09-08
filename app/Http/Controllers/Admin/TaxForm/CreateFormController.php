<?php

namespace App\Http\Controllers\TaxForm;

use App\Application\TaxForm\Queries\GetCreateFormPage\GetCreateFormPageHandler;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CreateFormController extends Controller
{
    public function __invoke(
        Request $request,
        int $formDefinitionId,
        GetCreateFormPageHandler $handler,
    ): Response {
        $authUser = $request->user();

        /*
         * Simple user:
         * The logged-in user is always the owner.
         */
        if (!$authUser->hasRole('admin')) {
            $ownerUserId = (int) $authUser->id;
        } else {
            /*
             * Admin:
             * The selected simple user's ID comes
             * from the User Selection popup.
             */
            $ownerUserId = (int) $request->input('user_id');

            if ($ownerUserId <= 0) {
                abort(
                    422,
                    'User selection is required.'
                );
            }

            /*
             * Admin may only work on simple users.
             */
            $selectedUser = \App\Models\User::query()
                ->whereKey($ownerUserId)
                ->whereDoesntHave(
                    'roles',
                    function ($query) {
                        $query->where(
                            'name',
                            'admin'
                        );
                    }
                )
                ->first();

            if ($selectedUser === null) {
                abort(
                    403,
                    'Invalid user selection.'
                );
            }
        }

        $data = $handler->handle(
            $formDefinitionId,
            $ownerUserId,
        );

        return Inertia::render(
            'authenticated/admin/tax-forms/create',
            [
                ...$data,

                'owner_user_id' =>
                    $ownerUserId,

                'is_admin' =>
                    $authUser->hasRole('admin'),
            ],
        );
    }
}