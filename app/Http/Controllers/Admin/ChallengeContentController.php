<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Admin\ManageChallengeContent;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreChallengeTestCaseRequest;
use App\Http\Requests\Admin\UpdateChallengeTestCaseRequest;
use App\Http\Requests\Admin\UpdateCodingChallengeRequest;
use App\Models\ChallengeTestCase;
use App\Models\CodingChallenge;
use App\Models\LearningPath;
use App\Models\Level;
use Illuminate\Http\RedirectResponse;

class ChallengeContentController extends Controller
{
    public function updateChallenge(
        UpdateCodingChallengeRequest $request,
        LearningPath $path,
        Level $level,
        ManageChallengeContent $manageChallengeContent,
    ): RedirectResponse {
        abort_unless($level->learning_path_id === $path->id, 404);

        $manageChallengeContent->updateChallenge($level, $request->validated());

        return back();
    }

    public function storeTestCase(
        StoreChallengeTestCaseRequest $request,
        CodingChallenge $challenge,
        ManageChallengeContent $manageChallengeContent,
    ): RedirectResponse {
        $manageChallengeContent->storeTestCase($challenge, $request->validated());

        return back();
    }

    public function updateTestCase(
        UpdateChallengeTestCaseRequest $request,
        ChallengeTestCase $testCase,
        ManageChallengeContent $manageChallengeContent,
    ): RedirectResponse {
        $manageChallengeContent->updateTestCase($testCase, $request->validated());

        return back();
    }

    public function destroyTestCase(ChallengeTestCase $testCase, ManageChallengeContent $manageChallengeContent): RedirectResponse
    {
        abort_unless(request()->user()?->isAdmin(), 403);

        $manageChallengeContent->deleteTestCase($testCase);

        return back();
    }
}
