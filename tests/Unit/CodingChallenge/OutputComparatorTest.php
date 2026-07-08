<?php

use App\Library\CodingChallenge\OutputComparator;

test('json string expected outputs compare equal after encode', function () {
    expect(OutputComparator::equals('"AB12"', '"AB12"'))->toBeTrue()
        ->and(OutputComparator::equals('""', '""'))->toBeTrue()
        ->and(OutputComparator::equals('""', '"\\t"'))->toBeFalse();
});
