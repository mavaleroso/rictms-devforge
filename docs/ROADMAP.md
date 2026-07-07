# DevForge Roadmap

DevForge Phase 1 delivers the **Core LMS**: RBAC, learning paths, levels, lessons, quizzes, progress tracking, and role-specific dashboards.

## Phase 1 — Core LMS (current)

- Session auth with Spatie RBAC (`admin`, `mentor`, `intern`)
- Learning paths with 20 sequential levels
- Materials, videos, and quizzes per level
- Progress engine with lock/unlock chain
- Admin content management
- Intern learning flow with auto-graded quizzes
- Mentor intern progress views
- Role-aware dashboards

## Phase 2 — Coding Challenges

- Coding challenge assignments per level
- Test case runner and automated checks
- Mentor review and feedback workflow
- Submission history and resubmission rules

## Phase 3 — Gamification

- XP points for completions
- Badges and achievements
- Leaderboards
- Learning streaks

## Phase 4 — Capstone & PM Tools

- Capstone project templates
- Jira-like task board for intern projects
- Daily journal entries
- Mentor sign-off on milestones

## Phase 5 — Certificates & Analytics

- PDF certificates with QR verification
- Completion analytics and export
- Email/in-app notifications
- Admin reporting dashboards

## Phase 6 — Integrations & AI

- GitHub integration for code submissions
- CI/Docker auto-evaluation
- AI tutor for guided learning
- Smart recommendations based on progress

## Demo credentials

After running `php artisan migrate:fresh --seed`:

| Role   | Email               | Password |
| ------ | ------------------- | -------- |
| Admin  | admin@devforge.test | password |
| Mentor | mentor1@devforge.test | password |
| Intern | intern1@devforge.test | password |
