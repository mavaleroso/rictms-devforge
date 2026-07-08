<?php

use App\Enums\ChallengeLanguage;
use App\Library\CodingChallenge\SolutionNormalizer;

test('php solutions without opening tag get one prepended', function () {
    $normalized = SolutionNormalizer::normalize(
        ChallengeLanguage::Php,
        "function normalizeKeyFragment(\$fragment) {\n    return strtoupper(trim(\$fragment));\n}",
    );

    expect($normalized)->toStartWith('<?php');
});

test('php solutions that already have a tag are left intact', function () {
    $code = "<?php\n\nfunction foo() { return 1; }";

    expect(SolutionNormalizer::normalize(ChallengeLanguage::Php, $code))->toBe($code);
});
