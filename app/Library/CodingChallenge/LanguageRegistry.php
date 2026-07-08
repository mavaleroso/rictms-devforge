<?php

namespace App\Library\CodingChallenge;

use App\Enums\ChallengeLanguage;

final class LanguageRegistry
{
    /** @var array<string, LanguageDefinition> */
    private static array $definitions = [];

    public static function get(ChallengeLanguage|string $language): LanguageDefinition
    {
        $id = $language instanceof ChallengeLanguage ? $language->value : $language;

        if (! isset(self::$definitions[$id])) {
            self::$definitions = self::buildDefinitions();
        }

        return self::$definitions[$id] ?? throw new \InvalidArgumentException("Unsupported language: {$id}");
    }

    /** @return list<LanguageDefinition> */
    public static function all(): array
    {
        if (self::$definitions === []) {
            self::$definitions = self::buildDefinitions();
        }

        return array_values(self::$definitions);
    }

    /** @return array<string, LanguageDefinition> */
    private static function buildDefinitions(): array
    {
        return [
            ChallengeLanguage::Php->value => new LanguageDefinition(
                id: ChallengeLanguage::Php->value,
                label: 'PHP',
                monacoId: 'php',
                binary: RuntimeBinaryResolver::resolvePhp(),
                fileExtension: 'php',
                starterTemplate: <<<'PHP'
<?php

function solution(/* args */) {
    // Write your solution here
}
PHP,
            ),
            ChallengeLanguage::Javascript->value => new LanguageDefinition(
                id: ChallengeLanguage::Javascript->value,
                label: 'JavaScript',
                monacoId: 'javascript',
                binary: RuntimeBinaryResolver::resolve(ChallengeLanguage::Javascript),
                fileExtension: 'js',
                starterTemplate: <<<'JS'
/**
 * @param {...any} args
 * @returns {any}
 */
function solution(/* args */) {
    // Write your solution here
}

module.exports = { solution };
JS,
            ),
            ChallengeLanguage::Python->value => new LanguageDefinition(
                id: ChallengeLanguage::Python->value,
                label: 'Python',
                monacoId: 'python',
                binary: RuntimeBinaryResolver::resolve(ChallengeLanguage::Python),
                fileExtension: 'py',
                starterTemplate: <<<'PY'
def solution(*args):
    # Write your solution here
    pass
PY,
            ),
        ];
    }

    public static function defaultStarter(ChallengeLanguage $language, string $entryPoint): string
    {
        $template = self::get($language)->starterTemplate;

        return str_replace('solution', $entryPoint, $template);
    }
}
