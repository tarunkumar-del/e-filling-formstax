<?php

namespace App\Http\Controllers\Auth;

use App\Application\Identity\Commands\SetPassword\SetPasswordHandler;
use App\Application\Identity\DTOs\SetPasswordData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\SetPasswordRequest;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;
use Illuminate\Http\RedirectResponse;

final class SetPasswordController extends Controller
{

    public function __construct(
        private SetPasswordHandler $handler,
    ) {}

    /**
     * Show the Set Password page.
     */
    public function create(string $token): Response
    {
        return Inertia::render('auth/set-password', [
            'token' => $token,
        ]);
    }

    /**
     * Store the user's new password.
     */
    public function store(
        SetPasswordRequest $request,
        string $token
    ): RedirectResponse {
        try {
            $this->handler->handle(
                new SetPasswordData(
                    token: $token,
                    password: $request->validated('password'),
                )
            );

            return redirect()
                ->route('login')
                ->with(
                    'success',
                    'Password created successfully. You can now sign in.'
                );

        } catch (Throwable $exception) {

            if (config('app.debug')) {
                Log::error('Password setup failed.', [
                    'exception' => $exception,
                ]);
            }

            return back()->withErrors([
                'password' => 'This password setup link is invalid or has expired.',
            ]);
        }
    }
}