<?php

namespace App\Console\Commands;

use App\Library\CodingChallenge\ChallengeTemplateRepository;
use Illuminate\Console\Command;
use Symfony\Component\Process\Process;

class ServeChallengeTemplateCommand extends Command
{
    protected $signature = 'challenge:serve-template
                            {template=laravel-inertia-react-template : Template key}
                            {--port=8001 : HTTP port}
                            {--host=127.0.0.1 : Bind host}';

    protected $description = 'Serve the installed challenge project template for Simple Browser preview';

    public function handle(ChallengeTemplateRepository $templates): int
    {
        $key = (string) $this->argument('template');
        $port = (int) $this->option('port');
        $host = (string) $this->option('host');

        try {
            $templates->manifest($key);
        } catch (\Throwable $e) {
            $this->error($e->getMessage());

            return self::FAILURE;
        }

        if (! $templates->isProjectLayout($key)) {
            $this->error('Only project-layout templates can be served.');

            return self::FAILURE;
        }

        $root = resource_path('challenge-templates'.DIRECTORY_SEPARATOR.str_replace('/', DIRECTORY_SEPARATOR, $key));
        $artisan = $root.DIRECTORY_SEPARATOR.'artisan';

        if (! is_file($artisan)) {
            $this->error("No artisan binary found in {$root}");

            return self::FAILURE;
        }

        $this->info("Serving {$key} at http://{$host}:{$port}");
        $this->comment('Keep this running while using Simple Browser in project challenges.');
        $this->comment('For live React edits, also run `npm run dev` inside the template directory.');

        $process = new Process(
            [PHP_BINARY, 'artisan', 'serve', "--host={$host}", "--port={$port}"],
            $root,
            timeout: null,
        );
        $process->setTty(Process::isTtySupported());

        $process->run(function (string $type, string $buffer): void {
            $this->output->write($buffer);
        });

        return $process->isSuccessful() ? self::SUCCESS : self::FAILURE;
    }
}
