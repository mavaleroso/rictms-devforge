<?php

namespace App\Enums;

enum XpSourceType: string
{
    case MaterialComplete = 'material_complete';
    case VideoComplete = 'video_complete';
    case QuizPass = 'quiz_pass';
    case ChallengePass = 'challenge_pass';
    case ChallengeApproved = 'challenge_approved';
    case LevelComplete = 'level_complete';
    case PathComplete = 'path_complete';
    case DailyStreak = 'daily_streak';
    case BadgeBonus = 'badge_bonus';
    case CapstoneMilestone = 'capstone_milestone';
    case CapstoneComplete = 'capstone_complete';
}
