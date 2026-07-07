<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Admin\ManageLevelContent;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreLearningMaterialRequest;
use App\Http\Requests\Admin\StoreQuizQuestionRequest;
use App\Http\Requests\Admin\StoreVideoRequest;
use App\Http\Requests\Admin\UpdateLearningMaterialRequest;
use App\Http\Requests\Admin\UpdateQuizQuestionRequest;
use App\Http\Requests\Admin\UpdateQuizRequest;
use App\Http\Requests\Admin\UpdateVideoRequest;
use App\Models\LearningMaterial;
use App\Models\LearningPath;
use App\Models\Level;
use App\Models\Quiz;
use App\Models\QuizQuestion;
use App\Models\Video;
use Illuminate\Http\RedirectResponse;

class LevelContentController extends Controller
{
    public function storeMaterial(
        StoreLearningMaterialRequest $request,
        LearningPath $path,
        Level $level,
        ManageLevelContent $manageLevelContent,
    ): RedirectResponse {
        abort_unless($level->learning_path_id === $path->id, 404);

        $manageLevelContent->storeMaterial($level, $request->validated());

        return back();
    }

    public function updateMaterial(
        UpdateLearningMaterialRequest $request,
        LearningMaterial $material,
        ManageLevelContent $manageLevelContent,
    ): RedirectResponse {
        $manageLevelContent->updateMaterial($material, $request->validated());

        return back();
    }

    public function destroyMaterial(LearningMaterial $material, ManageLevelContent $manageLevelContent): RedirectResponse
    {
        abort_unless(request()->user()?->isAdmin(), 403);

        $manageLevelContent->deleteMaterial($material);

        return back();
    }

    public function storeVideo(
        StoreVideoRequest $request,
        LearningPath $path,
        Level $level,
        ManageLevelContent $manageLevelContent,
    ): RedirectResponse {
        abort_unless($level->learning_path_id === $path->id, 404);

        $manageLevelContent->storeVideo($level, $request->validated());

        return back();
    }

    public function updateVideo(
        UpdateVideoRequest $request,
        Video $video,
        ManageLevelContent $manageLevelContent,
    ): RedirectResponse {
        $manageLevelContent->updateVideo($video, $request->validated());

        return back();
    }

    public function destroyVideo(Video $video, ManageLevelContent $manageLevelContent): RedirectResponse
    {
        abort_unless(request()->user()?->isAdmin(), 403);

        $manageLevelContent->deleteVideo($video);

        return back();
    }

    public function updateQuiz(
        UpdateQuizRequest $request,
        LearningPath $path,
        Level $level,
        ManageLevelContent $manageLevelContent,
    ): RedirectResponse {
        abort_unless($level->learning_path_id === $path->id, 404);

        $manageLevelContent->updateQuiz($level, $request->validated());

        return back();
    }

    public function storeQuestion(
        StoreQuizQuestionRequest $request,
        Quiz $quiz,
        ManageLevelContent $manageLevelContent,
    ): RedirectResponse {
        $data = $request->validated();
        $options = $data['options'] ?? [];
        unset($data['options']);

        $manageLevelContent->storeQuestion($quiz, $data, $options);

        return back();
    }

    public function updateQuestion(
        UpdateQuizQuestionRequest $request,
        QuizQuestion $question,
        ManageLevelContent $manageLevelContent,
    ): RedirectResponse {
        $data = $request->validated();
        $options = $data['options'] ?? null;
        unset($data['options']);

        $manageLevelContent->updateQuestion($question, $data, $options);

        return back();
    }

    public function destroyQuestion(QuizQuestion $question, ManageLevelContent $manageLevelContent): RedirectResponse
    {
        abort_unless(request()->user()?->isAdmin(), 403);

        $manageLevelContent->deleteQuestion($question);

        return back();
    }
}
