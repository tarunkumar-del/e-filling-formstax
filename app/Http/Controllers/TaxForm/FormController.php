<?php

namespace App\Http\Controllers\TaxForm;

use App\Application\TaxForm\Commands\DeleteForm\DeleteFormHandler;
use App\Application\TaxForm\Queries\GetFormsList\GetFormsListHandler;
use App\Domain\TaxForm\Repositories\FormRepositoryInterface;
use App\Models\Form;
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

        $forms = $handler->handle(
            $user->id
        );

        return Inertia::render(
            'authenticated/tax-forms/index',
            [
                'forms' => $forms,
                'isAdmin' => false,
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

        $formModel = $this->forms->findById($form);

        abort_unless(
            $formModel !== null,
            404
        );

        abort_unless(
            $formModel->user_id === $user->id,
            403
        );

        $handler->handle($formModel);

        return back()->with(
            'success',
            'Tax form deleted successfully.'
        );
    }
}