<?php

namespace App\Enums;

enum CapstoneTaskStatus: string
{
    case Backlog = 'backlog';
    case Todo = 'todo';
    case InProgress = 'in_progress';
    case InReview = 'in_review';
    case Done = 'done';

    /** @return list<self> */
    public static function boardOrder(): array
    {
        return [
            self::Backlog,
            self::Todo,
            self::InProgress,
            self::InReview,
            self::Done,
        ];
    }
}
