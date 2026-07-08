<?php

namespace App\Enums;

enum EvaluationDriver: string
{
    case Local = 'local';
    case Docker = 'docker';
}
