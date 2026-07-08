export interface GamificationTier {
    slug: string;
    label: string;
    color: string;
}

export interface GamificationBadge {
    slug: string;
    name: string;
    description: string;
    icon: string;
    category: string;
    xp_bonus: number;
    earned: boolean;
    earned_at?: string;
}

export interface GamificationSummary {
    total_xp: number;
    current_streak: number;
    longest_streak: number;
    tier: GamificationTier;
    next_tier: { slug: string; label: string; min_xp: number } | null;
    tier_progress: number;
    xp_to_next_tier: number;
    badges_earned: number;
    badges_total: number;
    recent_badges: Pick<GamificationBadge, 'slug' | 'name' | 'icon' | 'earned_at'>[];
}

export interface GamificationProfile extends GamificationSummary {
    badges: GamificationBadge[];
}

export interface GamificationAwardFlash {
    xp: number;
    reason: string;
    badges: { slug: string; name: string; icon: string; xp_bonus: number }[];
    streak: number | null;
}

export interface LeaderboardEntry {
    rank: number;
    user_id: number;
    name: string;
    avatar_url?: string | null;
    xp: number;
    total_xp: number;
    current_streak: number;
}

export interface LeaderboardData {
    scope: 'global' | 'path';
    path_id: number | null;
    all_time: LeaderboardEntry[];
    weekly: LeaderboardEntry[];
    viewer: {
        all_time_rank: number | null;
        weekly_rank: number | null;
        total_xp: number;
        weekly_xp: number;
    };
}
