<?php

namespace App\Enums;

enum QuestionType: string
{
    case MultipleChoice = 'multiple_choice';
    case Identification = 'identification';
    case TrueFalse = 'true_false';
    case Essay = 'essay';
}
