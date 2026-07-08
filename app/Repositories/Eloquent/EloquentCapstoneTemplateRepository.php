<?php

namespace App\Repositories\Eloquent;

use App\Models\CapstoneTemplate;
use App\Repositories\Contracts\CapstoneTemplateRepository;
use Illuminate\Support\Collection;

final class EloquentCapstoneTemplateRepository implements CapstoneTemplateRepository
{
    public function activeWithRelations(): Collection
    {
        return CapstoneTemplate::query()
            ->where('is_active', true)
            ->with(['milestones', 'tasks'])
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();
    }

    public function allWithRelations(): Collection
    {
        return CapstoneTemplate::query()
            ->withCount(['milestones', 'tasks'])
            ->with(['milestones', 'tasks'])
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();
    }

    public function findWithRelations(int $id): ?CapstoneTemplate
    {
        return CapstoneTemplate::query()
            ->with(['milestones', 'tasks'])
            ->find($id);
    }

    public function create(array $attributes): CapstoneTemplate
    {
        return CapstoneTemplate::create($attributes);
    }

    public function update(CapstoneTemplate $template, array $attributes): CapstoneTemplate
    {
        $template->update($attributes);

        return $template->fresh(['milestones', 'tasks']);
    }
}
