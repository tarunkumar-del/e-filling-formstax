<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Auth path defined
use App\Http\Controllers\Auth\{
    AccountSetupController,
    SetPasswordController,
    ForgotPasswordController,
    ResetPasswordController,
    SignInController
};

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use App\Http\Controllers\CompanyController;
use App\Http\Controllers\ContractorController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UserController;

use App\Http\Controllers\Admin\TaxForm\FormConfigurationController;
use App\Http\Controllers\Admin\TaxForm\FormDefinitionController;
use App\Http\Controllers\Admin\TaxForm\CreateFormOptionsController;
use App\Http\Controllers\Admin\TaxForm\GetSimpleUsersController;
use App\Http\Controllers\Admin\TaxForm\CreateFormController;
use App\Http\Controllers\Admin\TaxForm\FormController as AdminFormController;

use App\Http\Controllers\TaxForm\GetFormCompaniesController;
use App\Http\Controllers\TaxForm\GetFormContractorsController;
use App\Http\Controllers\TaxForm\FormController as UserFormController;


/*
|--------------------------------------------------------------------------
| Tax Form Create Support Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth')
    ->group(function () {
        Route::get(
            '/tax-forms/create/companies',
            GetFormCompaniesController::class
        )->name('tax-forms.create.companies');

        Route::get(
            '/tax-forms/create/contractors',
            GetFormContractorsController::class
        )->name('tax-forms.create.contractors');
    });


/*
|--------------------------------------------------------------------------
| Admin Tax Form Create Support Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'role:admin'])
    ->prefix('admin/tax-forms')
    ->name('admin.tax-forms.')
    ->group(function () {
        Route::get(
            '/create/users',
            GetSimpleUsersController::class
        )->name('create.users');
    });


/*
|--------------------------------------------------------------------------
| Location Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth'])
    ->prefix('locations')
    ->name('locations.')
    ->group(function () {
        Route::get('/countries', [
            LocationController::class,
            'countries',
        ])->name('countries');

        Route::get('/countries/{country}/regions', [
            LocationController::class,
            'regions',
        ])->name('regions');

        Route::get('/regions/{region}/cities', [
            LocationController::class,
            'cities',
        ])->name('cities');
    });


/*
|--------------------------------------------------------------------------
| Auth Routes
|--------------------------------------------------------------------------
*/

Route::middleware('guest')->group(function () {

    /*
    |--------------------------------------------------------------------------
    | Sign In
    |--------------------------------------------------------------------------
    */

    Route::get('/sign-in', function () {
        return Inertia::render('auth/sign-in');
    })->name('login');

    Route::post('/sign-in', [
        SignInController::class,
        'store',
    ])->name('auth.sign-in.submit');


    /*
    |--------------------------------------------------------------------------
    | Sign Up
    |--------------------------------------------------------------------------
    */

    Route::get('/sign-up', function () {
        return Inertia::render('auth/sign-up');
    })->name('auth.sign-up');

    Route::post('/register', [
        AccountSetupController::class,
        'register',
    ])->name('register');


    /*
    |--------------------------------------------------------------------------
    | Set Password
    |--------------------------------------------------------------------------
    */

    Route::get('/set-password/{token}', [
        SetPasswordController::class,
        'create',
    ])->name('auth.set-password');

    Route::post('/set-password/{token}', [
        SetPasswordController::class,
        'store',
    ])->name('auth.set-password.submit');


    /*
    |--------------------------------------------------------------------------
    | Forgot Password
    |--------------------------------------------------------------------------
    */

    Route::get('/forgot-password', function () {
        return Inertia::render('auth/forgot-password');
    })->name('auth.forgot-password');

    Route::post('/forgot-password', [
        ForgotPasswordController::class,
        'store',
    ])->name('auth.forgot-password.submit');


    /*
    |--------------------------------------------------------------------------
    | Reset Password
    |--------------------------------------------------------------------------
    */

    Route::get('/reset-password/{token}', [
        ResetPasswordController::class,
        'create',
    ])->name('auth.reset-password');

    Route::post('/reset-password/{token}', [
        ResetPasswordController::class,
        'store',
    ])->name('auth.reset-password.submit');
});


/*
|--------------------------------------------------------------------------
| Authenticated User Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'role:user'])->group(function () {

    /*
    |--------------------------------------------------------------------------
    | Tax Forms - User Created Forms
    |--------------------------------------------------------------------------
    */

    Route::prefix('tax-forms')
        ->name('tax-forms.')
        ->group(function () {

            Route::get(
                '/',
                [UserFormController::class, 'index']
            )->name('index');

            Route::delete(
                '/{form}',
                [UserFormController::class, 'destroy']
            )->whereNumber('form')
                ->name('destroy');
        });


    /*
    |--------------------------------------------------------------------------
    | Dashboard
    |--------------------------------------------------------------------------
    */

    Route::get(
        '/dashboard',
        [DashboardController::class, 'index']
    )->name('dashboard');


    /*
    |--------------------------------------------------------------------------
    | User Companies
    |--------------------------------------------------------------------------
    */

    Route::prefix('companies')
        ->name('companies.')
        ->middleware('permission:manage companies')
        ->group(function () {

            Route::get('/', [
                CompanyController::class,
                'index',
            ])->name('index');

            Route::get('/{company}', [
                CompanyController::class,
                'show',
            ])->name('show');

            Route::post('/', [
                CompanyController::class,
                'store',
            ])->name('store');

            Route::put('/{company}', [
                CompanyController::class,
                'update',
            ])->name('update');
        });


    /*
    |--------------------------------------------------------------------------
    | Users
    |--------------------------------------------------------------------------
    */

    Route::get('/users', function () {
        return Inertia::render('authenticated/users');
    })->name('users.index');


    /*
    |--------------------------------------------------------------------------
    | Tasks
    |--------------------------------------------------------------------------
    */

    Route::get('/tasks', function () {
        return Inertia::render('authenticated/tasks');
    })->name('tasks.index');


    /*
    |--------------------------------------------------------------------------
    | Apps
    |--------------------------------------------------------------------------
    */

    Route::get('/apps', function () {
        return Inertia::render('authenticated/apps');
    })->name('apps.index');


    /*
    |--------------------------------------------------------------------------
    | Chats
    |--------------------------------------------------------------------------
    */

    Route::get('/chats', function () {
        return Inertia::render('authenticated/chats');
    })->name('chats.index');


    /*
    |--------------------------------------------------------------------------
    | Help Center
    |--------------------------------------------------------------------------
    */

    Route::get('/help-center', function () {
        return Inertia::render('authenticated/help-center');
    })->name('help-center');


    /*
    |--------------------------------------------------------------------------
    | Settings
    |--------------------------------------------------------------------------
    */

    Route::prefix('settings')
        ->name('settings.')
        ->group(function () {

            Route::get('/', function () {
                return Inertia::render('authenticated/settings');
            })->name('index');

            Route::get('/profile', function () {
                return Inertia::render('authenticated/settings/profile');
            })->name('profile');

            Route::get('/account', function () {
                return Inertia::render('authenticated/settings/account');
            })->name('account');

            Route::get('/appearance', function () {
                return Inertia::render('authenticated/settings/appearance');
            })->name('appearance');

            Route::get('/notifications', function () {
                return Inertia::render('authenticated/settings/notifications');
            })->name('notifications');

            Route::get('/display', function () {
                return Inertia::render('authenticated/settings/display');
            })->name('display');

            Route::get('/help-center', function () {
                return Inertia::render('authenticated/settings/display');
            })->name('display');
        });


    /*
    |--------------------------------------------------------------------------
    | Error Pages
    |--------------------------------------------------------------------------
    */

    Route::prefix('errors')
        ->name('error.')
        ->group(function () {

            Route::get('forbidden', function () {
                return Inertia::render('errors/forbidden');
            })->name('forbidden');

            Route::get('unauthorized', function () {
                return Inertia::render('errors/unauthorized');
            })->name('unauthorized');

            Route::get('maintenance-error', function () {
                return Inertia::render('errors/maintenance');
            })->name('maintenance');

            Route::fallback(function () {
                return Inertia::render('not-found');
            });
        });
});


/*
|--------------------------------------------------------------------------
| Logout
|--------------------------------------------------------------------------
*/

Route::post('/logout', function (Request $request) {
    Auth::logout();

    $request->session()->invalidate();
    $request->session()->regenerateToken();

    return redirect()->route('login');
})->middleware('auth')->name('logout');


/*
|--------------------------------------------------------------------------
| User Contractor Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'role:user'])
    ->prefix('companies/{company}/contractors')
    ->name('companies.contractors.')
    ->group(function () {

        Route::get('/', [
            ContractorController::class,
            'index',
        ])->name('index');

        Route::post('/', [
            ContractorController::class,
            'store',
        ])->name('store');

        Route::get('/{contractor}', [
            ContractorController::class,
            'show',
        ])->name('show');

        Route::put('/{contractor}', [
            ContractorController::class,
            'update',
        ])->name('update');

        Route::delete('/{contractor}', [
            ContractorController::class,
            'destroy',
        ])->name('destroy');
    });


/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'role:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {

        /*
        |--------------------------------------------------------------------------
        | Admin Dashboard
        |--------------------------------------------------------------------------
        */

        Route::get(
            '/dashboard',
            [DashboardController::class, 'admin']
        )->name('dashboard');


        /*
        |--------------------------------------------------------------------------
        | Admin Users
        |--------------------------------------------------------------------------
        */

        Route::get(
            '/users',
            [UserController::class, 'index']
        )->name('users.index');

        Route::post(
            '/users',
            [UserController::class, 'store']
        )->name('users.store');

        Route::put(
            '/users/{user}',
            [UserController::class, 'update']
        )->name('users.update');

        Route::delete(
            '/users/{user}',
            [UserController::class, 'destroy']
        )->name('users.destroy');


        /*
        |--------------------------------------------------------------------------
        | Admin Created Tax Forms
        |--------------------------------------------------------------------------
        |
        | These are the forms actually created by users/admins.
        | This is intentionally separate from /admin/tax-forms.
        |
        */

        Route::prefix('forms')
            ->name('forms.')
            ->group(function () {

                Route::get(
                    '/',
                    [AdminFormController::class, 'index']
                )->name('index');

                Route::delete(
                    '/{form}',
                    [AdminFormController::class, 'destroy']
                )->whereNumber('form')
                    ->name('destroy');
            });


        /*
        |--------------------------------------------------------------------------
        | Admin Tax Form Definitions
        |--------------------------------------------------------------------------
        |
        | IMPORTANT:
        | /admin/tax-forms is the existing definition/configuration area.
        | Do not mix created-form routes into this group.
        |
        */

        Route::prefix('tax-forms')
            ->name('tax-forms.')
            ->group(function () {

                /*
                |--------------------------------------------------------------------------
                | Form Definitions List
                |--------------------------------------------------------------------------
                */

                Route::get(
                    '/',
                    [FormDefinitionController::class, 'index']
                )->name('index');


                /*
                |--------------------------------------------------------------------------
                | Create Form Options
                |--------------------------------------------------------------------------
                |
                | Static routes must come before dynamic routes.
                |
                */

                Route::get(
                    '/create/options',
                    CreateFormOptionsController::class
                )->name('create.options');


                /*
                |--------------------------------------------------------------------------
                | Create Form
                |--------------------------------------------------------------------------
                */

                Route::get(
                    '/create/{formDefinitionId}',
                    CreateFormController::class
                )->name('create');


                /*
                |--------------------------------------------------------------------------
                | Store Form
                |--------------------------------------------------------------------------
                */

                Route::post(
                    '/create/{formDefinitionId}',
                    [CreateFormController::class, 'store']
                )->name('create.store');


                /*
                |--------------------------------------------------------------------------
                | Form Configuration
                |--------------------------------------------------------------------------
                */

                Route::get(
                    '/{formDefinitionId}/configuration',
                    [FormConfigurationController::class, 'index']
                )->name('configuration.index');

                Route::put(
                    '/{formDefinitionId}/configuration/{formDefinitionFieldId}',
                    [FormConfigurationController::class, 'update']
                )->name('configuration.update');
            });
    });


/*
|--------------------------------------------------------------------------
| Admin Contractor Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'role:admin'])
    ->prefix('admin/companies/{company}/contractors')
    ->name('admin.companies.contractors.')
    ->group(function () {

        Route::get('/', [
            ContractorController::class,
            'index',
        ])->name('index');

        Route::post('/', [
            ContractorController::class,
            'store',
        ])->name('store');

        Route::get('/{contractor}', [
            ContractorController::class,
            'show',
        ])->name('show');

        Route::put('/{contractor}', [
            ContractorController::class,
            'update',
        ])->name('update');

        Route::delete('/{contractor}', [
            ContractorController::class,
            'destroy',
        ])->name('destroy');
    });


/*
|--------------------------------------------------------------------------
| Admin Company Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'role:admin'])
    ->prefix('admin/companies')
    ->name('admin.companies.')
    ->group(function () {

        Route::get('/', [
            CompanyController::class,
            'index',
        ])->name('index');

        Route::get('/{company}', [
            CompanyController::class,
            'show',
        ])->name('show');

        Route::post('/', [
            CompanyController::class,
            'store',
        ])->name('store');

        Route::put('/{company}', [
            CompanyController::class,
            'update',
        ])->name('update');
    });