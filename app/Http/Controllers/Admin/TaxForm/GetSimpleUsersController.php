<?php

namespace App\Http\Controllers\Admin\TaxForm;

use App\Application\Identity\Queries\GetSimpleUsers\GetSimpleUsersHandler;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class GetSimpleUsersController extends Controller
{
    public function __invoke(
        GetSimpleUsersHandler $handler
    ): JsonResponse {
        return response()->json([
            'users' => $handler->handle(),
        ]);
    }
}