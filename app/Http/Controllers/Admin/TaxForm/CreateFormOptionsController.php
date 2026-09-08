<?php

namespace App\Http\Controllers\Admin\TaxForm;

use App\Application\TaxForm\Queries\GetCreateFormOptions\GetCreateFormOptionsHandler;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\TaxForm\GetCreateFormOptionsRequest;
use Illuminate\Http\JsonResponse;

class CreateFormOptionsController extends Controller
{
    public function __invoke(
        GetCreateFormOptionsRequest $request,
        GetCreateFormOptionsHandler $handler
    ): JsonResponse {
        $result = $handler->handle(
            year: $request->integer('year') ?: null,
            search: $request->input('search')
        );

        return response()->json($result);
    }
}