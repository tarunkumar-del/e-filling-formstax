<?php

namespace App\Http\Controllers\Auth;

use App\Application\Identity\Commands\ResetPassword\ResetPasswordHandler;
use App\Application\Identity\DTOs\ResetPasswordData;
use App\Domain\Identity\Exceptions\InvalidPasswordResetTokenException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ResetPasswordRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

final class ResetPasswordController extends Controller
{
    public function __construct(
        private ResetPasswordHandler $handler,
    ) {}

    public function create(string $token): Response
    {
        return Inertia::render('auth/reset-password', [
            'token' => $token,
        ]);
    }

    public function store(
        ResetPasswordRequest $request,
        string $token
    ): RedirectResponse {
        try {
            $this->handler->handle(
                new ResetPasswordData(
                    token: $token,
                    password: $request->validated('password'),
                )
            );

            return redirect()
                ->route('login')
                ->with(
                    'success',
                    'Your password has been reset successfully. You can now sign in.'
                );

        } catch (InvalidPasswordResetTokenException $exception) {

            return back()->withErrors([
                'password' => 'This password reset link is invalid or has expired.',
            ]);

        } catch (Throwable $exception) {

            if (config('app.debug')) {
                Log::error('Password reset failed.', [
                    'exception' => $exception,
                ]);
            }

            return back()->withErrors([
                'password' => 'Unable to reset your password right now.',
            ]);
        }
    }
}