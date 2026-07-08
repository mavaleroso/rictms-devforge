<?php

namespace App\Library\CodingChallenge;

final class OutputComparator
{
    public static function equals(string $expected, string $actual): bool
    {
        $expected = trim($expected);
        $actual = trim($actual);

        if ($expected === $actual) {
            return true;
        }

        $expectedJson = self::tryDecode($expected);
        $actualJson = self::tryDecode($actual);

        if ($expectedJson !== null && $actualJson !== null) {
            return $expectedJson === $actualJson;
        }

        return strcasecmp($expected, $actual) === 0;
    }

    /** @return mixed */
    private static function tryDecode(string $value): mixed
    {
        try {
            return json_decode($value, true, 512, JSON_THROW_ON_ERROR);
        } catch (\JsonException) {
            return null;
        }
    }
}
