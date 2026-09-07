<?php

namespace App\Http\Controllers\Admin\TaxForm;

use App\Application\TaxForm\Queries\GetFormDefinitions\GetFormDefinitionsHandler;
use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class FormDefinitionController extends Controller
{
    public function __construct(
        private readonly GetFormDefinitionsHandler $getHandler
    ) {}

    public function index(): Response
    {
        $definitions = $this->getHandler->handle();

        return Inertia::render(
            'authenticated/admin/tax-forms/index',
            [
                'definitions' => $definitions,
            ]
        );
    }
}