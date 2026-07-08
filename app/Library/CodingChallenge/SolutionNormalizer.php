<?php

namespace App\Library\CodingChallenge;

use App\Enums\ChallengeLanguage;

final class SolutionNormalizer
{
    public static function normalize(ChallengeLanguage $language, string $code): string
    {
        $code = str_replace("\r\n", "\n", $code);
        $code = trim($code);

        if ($language === ChallengeLanguage::Php && ! preg_match('/^\s*<\?php\b/', $code)) {
            return "<?php\n\n".$code;
        }

        return $code;
    }
}
