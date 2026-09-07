<?php

namespace App\Http\Controllers;

use App\Application\Contractor\Commands\CreateContractorHandler;
use App\Application\Contractor\Commands\DeleteContractorHandler;
use App\Application\Contractor\Commands\UpdateContractorHandler;
use App\Application\Contractor\DTOs\ContractorData;
use App\Domain\Contractor\Repositories\ContractorRepositoryInterface;
use App\Http\Requests\Contractor\StoreContractorRequest;
use App\Http\Requests\Contractor\UpdateContractorRequest;
use App\Models\Company;
use App\Models\Contractor;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Domain\Location\Services\LocationValidator;

class ContractorController extends Controller
{
    public function __construct(
        private readonly ContractorRepositoryInterface $contractorRepository,
        private readonly CreateContractorHandler $createContractorHandler,
        private readonly UpdateContractorHandler $updateContractorHandler,
        private readonly DeleteContractorHandler $deleteContractorHandler,
        private readonly LocationValidator $locationValidator,
    ) {
    }

    /**
     * Display contractors for a company.
     */
    public function index(
        Request $request,
        Company $company
    ): Response {
        $this->authorizeCompanyAccess(
            $request,
            $company
        );

        $contractors = $this->contractorRepository
            ->getByCompany($company->id);

        return Inertia::render(
            'authenticated/contractors',
            [
                'company' => $company,
                'contractors' => $contractors,
            ]
        );
    }

    /**
     * Store a contractor.
     */
    public function store(
        StoreContractorRequest $request,
        Company $company
    ): RedirectResponse {
        $this->authorizeCompanyAccess(
            $request,
            $company
        );

        $data = $request->validated();

        $this->locationValidator->validate(
            countryId: (int) $data['country_id'],
            regionId: isset($data['region_id'])
            ? (int) $data['region_id']
            : null,
            cityId: isset($data['city_id'])
            ? (int) $data['city_id']
            : null,
        );

        $contractorData = $this->makeContractorData(
            $data,
            $company->id
        );

        $this->createContractorHandler->handle(
            $contractorData
        );

        return back()->with(
            'success',
            'Contractor created successfully.'
        );
    }

    /**
     * Show contractor.
     */
    public function show(
        Request $request,
        Company $company,
        Contractor $contractor
    ): JsonResponse {
        $this->authorizeCompanyAccess(
            $request,
            $company
        );

        $this->ensureContractorBelongsToCompany(
            $company,
            $contractor
        );

        return response()->json(
            $contractor->load([
                'country',
                'region',
                'city',
            ])
        );
    }

    /**
     * Update contractor.
     */
    public function update(
        UpdateContractorRequest $request,
        Company $company,
        Contractor $contractor
    ): RedirectResponse {
        $this->authorizeCompanyAccess(
            $request,
            $company
        );

        $this->ensureContractorBelongsToCompany(
            $company,
            $contractor
        );

        $data = $request->validated();
        $this->locationValidator->validate(
            countryId: (int) $data['country_id'],
            regionId: isset($data['region_id'])
            ? (int) $data['region_id']
            : null,
            cityId: isset($data['city_id'])
            ? (int) $data['city_id']
            : null,
        );
        $contractorData = $this->makeContractorData(
            $data,
            $company->id
        );

        $this->updateContractorHandler->handle(
            $contractor,
            $contractorData
        );

        return back()->with(
            'success',
            'Contractor updated successfully.'
        );
    }

    /**
     * Delete contractor.
     */
    public function destroy(
        Request $request,
        Company $company,
        Contractor $contractor
    ): RedirectResponse {
        $this->authorizeCompanyAccess(
            $request,
            $company
        );

        $this->ensureContractorBelongsToCompany(
            $company,
            $contractor
        );

        /*
         * Only admins can delete contractors.
         */
        abort_unless(
            $request->user()->hasRole('admin'),
            403
        );

        $this->deleteContractorHandler->handle(
            $contractor
        );

        return back()->with(
            'success',
            'Contractor deleted successfully.'
        );
    }

    /**
     * Build ContractorData DTO.
     */
    private function makeContractorData(
        array $data,
        int $companyId
    ): ContractorData {
        return new ContractorData(
            companyId: $companyId,
            taxIdType: $data['tax_id_type'],
            taxId: $data['tax_id'] ?? null,
            firstName: $data['first_name'] ?? null,
            middleInitial: $data['middle_initial'] ?? null,
            lastName: $data['last_name'] ?? null,
            suffix: $data['suffix'] ?? null,
            businessEntityName: $data['business_entity_name'] ?? null,
            address1: $data['address_1'],
            address2: $data['address_2'] ?? null,
            countryId: (int) $data['country_id'],
            regionId: isset($data['region_id'])
            ? (int) $data['region_id']
            : null,
            cityId: isset($data['city_id'])
            ? (int) $data['city_id']
            : null,
            postal: $data['postal'] ?? null,
            phone: $data['phone'] ?? null,
            email: $data['email'] ?? null,
        );
    }

    /**
     * Ensure the current user can access the company.
     */
    private function authorizeCompanyAccess(
        Request $request,
        Company $company
    ): void {
        $user = $request->user();

        if ($user->hasRole('admin')) {
            return;
        }

        abort_unless(
            $company->user_id === $user->id,
            403
        );
    }

    /**
     * Ensure contractor belongs to company.
     */
    private function ensureContractorBelongsToCompany(
        Company $company,
        Contractor $contractor
    ): void {
        abort_unless(
            $contractor->company_id === $company->id,
            404
        );
    }
}