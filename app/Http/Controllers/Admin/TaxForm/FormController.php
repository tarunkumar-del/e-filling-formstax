<?php

namespace App\Http\Controllers\Admin\TaxForm;

use App\Application\TaxForm\Commands\DeleteForm\DeleteFormHandler;
use App\Application\TaxForm\Queries\GetFormsList\GetFormsListHandler;
use App\Domain\TaxForm\Repositories\FormRepositoryInterface;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class FormController
{
    public function __construct(
        private readonly FormRepositoryInterface $forms,
    ) {}

    public function index(
        Request $request,
        GetFormsListHandler $handler,
    ): Response {
        $user = $request->user();

        abort_unless(
            $user !== null,
            401
        );

        abort_unless(
            $user->hasRole('admin'),
            403
        );

        $forms = $handler->handle();

        return Inertia::render(
            'authenticated/admin/forms/index',
            [
                'forms' => $forms,
                'isAdmin' => true,
            ]
        );
    }

    public function destroy(
        Request $request,
        int $form,
        DeleteFormHandler $handler,
    ): RedirectResponse {
        $user = $request->user();

        abort_unless(
            $user !== null,
            401
        );

        abort_unless(
            $user->hasRole('admin'),
            403
        );

        $formModel = $this->forms->findById($form);

        abort_unless(
            $formModel !== null,
            404
        );

        $handler->handle($formModel);

        return back()->with(
            'success',
            'Tax form deleted successfully.'
        );
    }
}