<?php

namespace App\Providers;
use Illuminate\Support\ServiceProvider;

use App\Domain\Identity\Repositories\AccountSetupTokenRepositoryInterface;
use App\Infrastructure\Persistence\Repositories\Identity\EloquentAccountSetupTokenRepository;

use App\Domain\Identity\Repositories\UserRepositoryInterface;
use App\Infrastructure\Persistence\Repositories\Identity\EloquentUserRepository;

use App\Domain\Identity\Repositories\PasswordResetTokenRepositoryInterface;
use App\Infrastructure\Persistence\Repositories\Identity\EloquentPasswordResetTokenRepository;

use App\Domain\Company\Repositories\CompanyRepositoryInterface;
use App\Infrastructure\Persistence\Repositories\Company\EloquentCompanyRepository;

use App\Domain\Contractor\Repositories\ContractorRepositoryInterface;
use App\Infrastructure\Persistence\Repositories\Contractor\EloquentContractorRepository;

use App\Domain\TaxForm\Repositories\FormDefinitionFieldRepositoryInterface;
use App\Infrastructure\Persistence\Repositories\TaxForm\EloquentFormDefinitionFieldRepository;

use App\Domain\TaxForm\Repositories\FormDefinitionRepositoryInterface;
use App\Infrastructure\Persistence\Repositories\TaxForm\EloquentFormDefinitionRepository;

use App\Domain\TaxForm\Repositories\FormRepositoryInterface;
use App\Infrastructure\Persistence\Repositories\TaxForm\EloquentFormRepository;
class RepositoryServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(
            AccountSetupTokenRepositoryInterface::class,
            EloquentAccountSetupTokenRepository::class,
        );

        $this->app->bind(
            UserRepositoryInterface::class,
            EloquentUserRepository::class,
        );

        $this->app->bind(
            PasswordResetTokenRepositoryInterface::class,
            EloquentPasswordResetTokenRepository::class,
        );

        $this->app->bind(
            CompanyRepositoryInterface::class,
            EloquentCompanyRepository::class,
        );
        $this->app->bind(
            ContractorRepositoryInterface::class,
            EloquentContractorRepository::class
        );
        $this->app->bind(
            FormDefinitionFieldRepositoryInterface::class,
            EloquentFormDefinitionFieldRepository::class
        );
        $this->app->bind(
            FormDefinitionRepositoryInterface::class,
            EloquentFormDefinitionRepository::class
        );
        $this->app->bind(
            FormRepositoryInterface::class,
            EloquentFormRepository::class
        );
    }

    public function boot(): void
    {
        //
    }
}