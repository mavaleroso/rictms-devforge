<?php

namespace App\Enums;

enum CapstoneProjectStatus: string
{
    case Draft = 'draft';
    case Active = 'active';
    case Completed = 'completed';
    case Archived = 'archived';
}
