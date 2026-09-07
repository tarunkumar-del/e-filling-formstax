<?php

namespace App\Http\Controllers\Auth;

use App\Application\Identity\Commands\ForgotPassword\ForgotPasswordHandler;
use App\Application\Identity\DTOs\ForgotPasswordData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ForgotPasswordRequest;
use Illuminate\Http\RedirectResponse;

final class ForgotPasswordController extends Controller
{
    public function __construct(
        private ForgotPasswordHandler $handler,
    ) {}

    public function store(
        ForgotPasswordRequest $request
    ): RedirectResponse {
        $this->handler->handle(
            new ForgotPasswordData(
                email: $request->validated('email'),
            )
        );

        return back()->with(
            'success',
            'If an account exists with this email, we have sent a password reset link.'
        );
    }
}