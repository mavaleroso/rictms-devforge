<?php

namespace App\Http\Controllers\Learn;

use App\Actions\Quiz\GradeQuizAttempt;
use App\Http\Controllers\Controller;
use App\Http\Requests\Learn\SubmitQuizRequest;
use App\Http\Resources\QuizResource;
use App\Models\Quiz;
use App\Services\Learning\LearnPresentationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class QuizController extends Controller
{
    public function __construct(
        private readonly LearnPresentationService $presentation,
    ) {}

    public function show(Request $request, Quiz $quiz): Response
    {
        abort_unless($request->user()->isIntern(), 403);

        $quiz = $this->presentation->quizForPlayer($quiz, $request->user());
        $this->authorize('view', $quiz->level);

        return Inertia::render('learn/quizzes/show', [
            'path' => $quiz->level->learningPath->only(['id', 'name', 'slug']),
            'level' => $quiz->level->only(['id', 'number', 'title']),
            'quiz' => new QuizResource($quiz),
        ]);
    }

    public function submit(SubmitQuizRequest $request, Quiz $quiz, GradeQuizAttempt $gradeQuizAttempt): RedirectResponse
    {
        $this->authorize('view', $quiz->level);

        $attempt = $gradeQuizAttempt->execute(
            $request->user(),
            $quiz,
            $request->validated('answers'),
        );

        return redirect()
            ->route('learn.levels.show', [$quiz->level->learningPath, $quiz->level])
            ->with('quiz_result', [
                'score' => $attempt->score,
                'passed' => $attempt->passed,
            ]);
    }
}
