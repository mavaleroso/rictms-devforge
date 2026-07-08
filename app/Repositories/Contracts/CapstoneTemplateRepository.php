<?php

namespace App\Repositories\Contracts;

use App\Models\CapstoneTemplate;
use Illuminate\Support\Collection;

interface CapstoneTemplateRepository
{
    /** @return Collection<int, CapstoneTemplate> */
    public function activeWithRelations(): Collection;

    /** @return Collection<int, CapstoneTemplate> */
    public function allWithRelations(): Collection;

    public function findWithRelations(int $id): ?CapstoneTemplate;

    public function create(array $attributes): CapstoneTemplate;

    public function update(CapstoneTemplate $template, array $attributes): CapstoneTemplate;
}
