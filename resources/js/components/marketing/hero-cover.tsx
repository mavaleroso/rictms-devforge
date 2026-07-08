import { accent } from '@/lib/theme';
import clsx from 'clsx';
import { motion } from 'motion/react';

const floatingBadges = [
    { label: 'Networking · Level 4', position: 'top-6 left-4 sm:left-6', delay: 0 },
    { label: 'Challenge passed', position: 'top-1/3 right-4 sm:right-6', delay: 0.4 },
    { label: 'DevOps pipeline lab', position: 'bottom-16 left-6 sm:left-10', delay: 0.8 },
    { label: 'Security review queued', position: 'bottom-6 right-6 sm:right-10', delay: 1.2 },
] as const;

export function HeroCover() {
    return (
        <div className="relative">
            <div className="overflow-hidden rounded-2xl border border-slate-200/80 shadow-lg ring-1 ring-slate-900/5 dark:border-slate-800 dark:ring-white/10">
                <div className="relative aspect-[4/3] sm:aspect-[16/11]">
                    <img
                        src="/images/marketing/hero-cover.jpg"
                        alt="Team collaborating on technology training and hands-on labs"
                        className="size-full object-cover"
                        loading="eager"
                        fetchPriority="high"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-950/80 via-brand-900/25 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-accent-900/20" />

                    <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="rounded-xl border border-white/15 bg-white/10 p-3 backdrop-blur-md sm:p-4"
                        >
                            <div className="flex items-center justify-between gap-3 text-white">
                                <div>
                                    <p className="text-[10px] font-medium tracking-wide text-brand-100/90 uppercase">
                                        Active path
                                    </p>
                                    <p className="mt-0.5 text-sm font-semibold">Cybersecurity fundamentals</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-brand-100/80">Progress</p>
                                    <p className="text-sm font-semibold">68%</p>
                                </div>
                            </div>
                            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/15">
                                <motion.div
                                    className={clsx('h-full rounded-full', accent.progress)}
                                    initial={{ width: '0%' }}
                                    animate={{ width: '68%' }}
                                    transition={{ duration: 1.2, delay: 0.6, ease: 'easeOut' }}
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {floatingBadges.map((badge) => (
                <motion.div
                    key={badge.label}
                    className={clsx(
                        'absolute hidden rounded-lg border border-white/20 bg-white/90 px-2.5 py-1.5 text-[11px] font-medium text-slate-800 shadow-md backdrop-blur-sm sm:block',
                        badge.position,
                    )}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: [0, -4, 0] }}
                    transition={{
                        opacity: { duration: 0.4, delay: badge.delay },
                        y: { duration: 4, repeat: Infinity, ease: 'easeInOut', delay: badge.delay },
                    }}
                >
                    {badge.label}
                </motion.div>
            ))}
        </div>
    );
}
