export interface Certificate {
    id: number;
    certificate_number: string;
    verification_code: string;
    issued_at: string;
    metadata?: {
        intern_name?: string;
        path_name?: string;
        mentor_name?: string | null;
        days_to_complete?: number | null;
    };
    user?: {
        id: number;
        name: string;
        email: string;
        avatar_url?: string | null;
    };
    learning_path?: {
        id: number;
        name: string;
        slug: string;
    };
    enrollment?: {
        id: number;
        mentor?: { id: number; name: string } | null;
    };
    verify_url: string;
    download_url: string;
}

export interface CertificateIssuedFlash {
    id: number;
    certificate_number: string;
    path_name?: string;
}

export interface AnalyticsSummary {
    active_enrollments: number;
    completed_enrollments: number;
    certificates_issued: number;
    certificates_this_month: number;
    avg_days_to_complete: number | null;
    completion_rate: number;
}

export interface AnalyticsTrendPoint {
    month: string;
    label: string;
    completions: number;
    certificates: number;
}

export interface AnalyticsPathBreakdown {
    path: string;
    completed: number;
    active: number;
}
