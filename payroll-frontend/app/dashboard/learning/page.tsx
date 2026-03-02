'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen, Play, CheckCircle2, Clock, Award, Star, Trophy,
    Plus, Search, Filter, ChevronRight, BookMarked, Zap, Target,
    BarChart3, Users, TrendingUp, Lock, Video, FileText, HelpCircle,
    ClipboardList, X, ArrowRight, Flame, Medal
} from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';

// ---- Types ----
type CourseLevel = 'beginner' | 'intermediate' | 'advanced';
type LessonType = 'video' | 'article' | 'quiz' | 'assignment';
type EnrollmentStatus = 'enrolled' | 'in_progress' | 'completed' | 'dropped';

interface Course {
    id: number;
    title: string;
    description?: string;
    category?: string;
    tags?: string;
    level: CourseLevel;
    status: string;
    duration_minutes: number;
    is_mandatory: boolean;
    certificate_on_completion: boolean;
    lesson_count: number;
    enrolled_count: number;
    completion_rate: number;
    created_at: string;
}

interface Lesson {
    id: number;
    title: string;
    lesson_type: LessonType;
    order_index: number;
    duration_minutes: number;
    is_required: boolean;
    completed?: boolean;
}

interface Enrollment {
    id: number;
    course_id: number;
    status: EnrollmentStatus;
    progress_pct: number;
    score?: number;
    passed?: boolean;
    enrolled_at: string;
    completed_at?: string;
}

interface Certificate {
    id: number;
    course_id: number;
    certificate_number: string;
    score?: number;
    issued_at: string;
}

interface LMSStats {
    total_courses: number;
    total_enrollments: number;
    total_completions: number;
    certificates_issued: number;
    completion_rate: number;
}

// ---- Config ----
const LEVEL_CONFIG: Record<CourseLevel, { label: string; color: string }> = {
    beginner: { label: 'Beginner', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    intermediate: { label: 'Intermediate', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
    advanced: { label: 'Advanced', color: 'text-red-400 bg-red-500/10 border-red-500/20' },
};

const LESSON_ICONS: Record<LessonType, React.ReactNode> = {
    video: <Video size={14} />,
    article: <FileText size={14} />,
    quiz: <HelpCircle size={14} />,
    assignment: <ClipboardList size={14} />,
};

const CATEGORY_COLORS: Record<string, string> = {
    Leadership: 'from-violet-500/20 to-purple-900/20 border-violet-500/20',
    Compliance: 'from-amber-500/20 to-orange-900/20 border-amber-500/20',
    Technical: 'from-blue-500/20 to-indigo-900/20 border-blue-500/20',
    Onboarding: 'from-emerald-500/20 to-teal-900/20 border-emerald-500/20',
    'Soft Skills': 'from-pink-500/20 to-rose-900/20 border-pink-500/20',
    default: 'from-zinc-800/50 to-zinc-900/50 border-white/10',
};

const CATEGORIES = ['All', 'Leadership', 'Compliance', 'Technical', 'Onboarding', 'Soft Skills'];

function formatDuration(mins: number) {
    if (mins < 60) return `${mins}m`;
    return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

// ---- Sub-components ----

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) {
    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-white/[0.03] border border-white/10 p-5">
            <div className={`flex items-center gap-2 text-xs font-medium mb-2 ${color}`}>
                {icon} {label}
            </div>
            <p className="text-3xl font-black text-white">{value}</p>
        </motion.div>
    );
}

function CourseCard({
    course, enrollment, onEnroll, onOpen
}: {
    course: Course;
    enrollment?: Enrollment;
    onEnroll: (id: number) => void;
    onOpen: (course: Course) => void;
}) {
    const lvl = LEVEL_CONFIG[course.level];
    const catColor = CATEGORY_COLORS[course.category || ''] || CATEGORY_COLORS.default;
    const progress = enrollment?.progress_pct ?? 0;
    const isCompleted = enrollment?.status === 'completed';

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -2 }}
            className={`rounded-2xl bg-gradient-to-br border p-5 flex flex-col gap-4 cursor-pointer transition-all hover:shadow-xl hover:shadow-black/20 ${catColor}`}
            onClick={() => onOpen(course)}
        >
            {/* Top row */}
            <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap gap-2 mb-2">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${lvl.color}`}>{lvl.label}</span>
                        {course.category && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border border-white/10 text-white/40">{course.category}</span>
                        )}
                        {course.is_mandatory && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border border-red-500/30 text-red-400 bg-red-500/10">Required</span>
                        )}
                    </div>
                    <h3 className="text-sm font-bold text-white leading-snug">{course.title}</h3>
                    {course.description && <p className="text-xs text-white/40 mt-1 line-clamp-2">{course.description}</p>}
                </div>
                {isCompleted && (
                    <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                        <CheckCircle2 size={16} className="text-emerald-400" />
                    </div>
                )}
            </div>

            {/* Progress bar (if enrolled) */}
            {enrollment && !isCompleted && (
                <div>
                    <div className="flex justify-between text-[10px] text-white/40 mb-1">
                        <span>{progress}% complete</span>
                        <span>{enrollment.status.replace('_', ' ')}</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }} animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                        />
                    </div>
                </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-white/40">
                    <span className="flex items-center gap-1"><Clock size={11} /> {formatDuration(course.duration_minutes)}</span>
                    <span className="flex items-center gap-1"><BookOpen size={11} /> {course.lesson_count} lessons</span>
                    <span className="flex items-center gap-1"><Users size={11} /> {course.enrolled_count}</span>
                </div>
                {!enrollment ? (
                    <button
                        onClick={e => { e.stopPropagation(); onEnroll(course.id); }}
                        className="flex items-center gap-1 text-xs px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all"
                    >
                        <Plus size={12} /> Enroll
                    </button>
                ) : isCompleted ? (
                    <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                        <Award size={14} /> Completed
                    </span>
                ) : (
                    <button
                        onClick={e => { e.stopPropagation(); onOpen(course); }}
                        className="flex items-center gap-1 text-xs px-3 py-1.5 bg-white/10 hover:bg-white/15 text-white rounded-lg transition-all"
                    >
                        <Play size={12} /> Continue
                    </button>
                )}
            </div>
        </motion.div>
    );
}

function CourseLearnerPanel({
    course, enrollment, token, onBack, onRefresh
}: {
    course: Course;
    enrollment?: Enrollment;
    token: string;
    onBack: () => void;
    onRefresh: () => void;
}) {
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [activeLesson, setActiveLesson] = useState<any>(null);
    const [marking, setMarking] = useState<number | null>(null);

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/learning/courses/${course.id}/lessons`, {
            headers: { Authorization: `Bearer ${token}` }
        }).then(r => r.json()).then(setLessons).catch(() => { });
    }, [course.id, token]);

    const openLesson = async (lesson: Lesson) => {
        if (!enrollment) return;
        const res = await fetch(`${API_BASE_URL}/api/learning/courses/${course.id}/lessons/${lesson.id}/content`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) setActiveLesson(await res.json());
    };

    const completeLesson = async (lessonId: number) => {
        setMarking(lessonId);
        await fetch(`${API_BASE_URL}/api/learning/courses/${course.id}/lessons/${lessonId}/complete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ completed: true, time_spent_minutes: activeLesson?.duration_minutes || 5 })
        });
        setMarking(null);
        setActiveLesson(null);
        onRefresh();
        // Refresh lessons
        const r = await fetch(`${API_BASE_URL}/api/learning/courses/${course.id}/lessons`, { headers: { Authorization: `Bearer ${token}` } });
        if (r.ok) setLessons(await r.json());
    };

    const completedCount = lessons.filter(l => l.completed).length;
    const progress = lessons.length ? Math.round((completedCount / lessons.length) * 100) : 0;

    return (
        <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
                <button onClick={onBack} className="text-white/40 hover:text-white transition-colors">
                    <X size={20} />
                </button>
                <div>
                    <h2 className="text-lg font-bold text-white">{course.title}</h2>
                    <p className="text-xs text-white/40">{completedCount}/{lessons.length} lessons · {progress}% complete</p>
                </div>
            </div>

            {/* Progress */}
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }}
                    className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full" />
            </div>

            {/* Active lesson viewer */}
            <AnimatePresence>
                {activeLesson && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                        className="rounded-2xl bg-indigo-900/20 border border-indigo-500/20 p-5">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-white">{activeLesson.title}</h3>
                            <button onClick={() => setActiveLesson(null)} className="text-white/40 hover:text-white"><X size={16} /></button>
                        </div>
                        {activeLesson.lesson_type === 'video' && activeLesson.content && (
                            <div className="aspect-video rounded-xl overflow-hidden bg-black mb-4">
                                <iframe src={activeLesson.content} className="w-full h-full" allow="autoplay" />
                            </div>
                        )}
                        {activeLesson.lesson_type === 'article' && (
                            <div className="prose prose-invert prose-sm max-w-none mb-4 text-white/70 leading-relaxed" dangerouslySetInnerHTML={{ __html: activeLesson.content || '<p>Content coming soon.</p>' }} />
                        )}
                        {activeLesson.lesson_type === 'quiz' && activeLesson.quiz_questions && (
                            <div className="space-y-3 mb-4">
                                {activeLesson.quiz_questions.map((q: any, i: number) => (
                                    <div key={i} className="rounded-xl bg-white/5 border border-white/10 p-4">
                                        <p className="text-sm font-medium text-white mb-2">{i + 1}. {q.question}</p>
                                        <div className="grid grid-cols-2 gap-2">
                                            {q.options?.map((opt: string, j: number) => (
                                                <button key={j} className="text-xs text-left px-3 py-2 rounded-lg border border-white/10 text-white/60 hover:border-indigo-500/50 hover:text-white transition-all">
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {!activeLesson.completed && (
                            <button onClick={() => completeLesson(activeLesson.id)} disabled={marking === activeLesson.id}
                                className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-xl text-sm transition-all disabled:opacity-50">
                                {marking === activeLesson.id ? 'Marking...' : '✅ Mark as Complete'}
                            </button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Lesson list */}
            <div className="flex flex-col gap-2">
                {lessons.map((lesson, idx) => (
                    <button key={lesson.id} onClick={() => openLesson(lesson)} disabled={!enrollment}
                        className={`flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${lesson.completed
                                ? 'bg-emerald-500/5 border-emerald-500/20'
                                : activeLesson?.id === lesson.id
                                    ? 'bg-indigo-500/10 border-indigo-500/30'
                                    : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
                            } ${!enrollment ? 'opacity-40 cursor-not-allowed' : ''}`}>
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${lesson.completed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-white/30'
                            }`}>
                            {lesson.completed ? <CheckCircle2 size={14} /> : idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{lesson.title}</p>
                            <div className="flex items-center gap-2 text-xs text-white/30 mt-0.5">
                                <span className="flex items-center gap-1">{LESSON_ICONS[lesson.lesson_type]} {lesson.lesson_type}</span>
                                <span>·</span>
                                <span>{lesson.duration_minutes}m</span>
                                {lesson.is_required && <span className="text-amber-400/60">Required</span>}
                            </div>
                        </div>
                        {!enrollment && <Lock size={14} className="text-white/20 shrink-0" />}
                        {enrollment && !lesson.completed && <ChevronRight size={14} className="text-white/20 shrink-0" />}
                    </button>
                ))}
            </div>
        </div>
    );
}

// ---- Main Page ----

export default function LearningPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [stats, setStats] = useState<LMSStats | null>(null);
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'library' | 'my-learning' | 'certificates' | 'leaderboard'>('library');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [leaderboard, setLeaderboard] = useState<any[]>([]);

    useEffect(() => {
        const t = localStorage.getItem('token') || '';
        setToken(t);
        fetchAll(t);
    }, []);

    const fetchAll = async (t: string) => {
        setLoading(true);
        try {
            const [courseRes, enrollRes, certRes, statsRes, lbRes] = await Promise.all([
                fetch(`${API_BASE_URL}/api/learning/courses`, { headers: { Authorization: `Bearer ${t}` } }),
                fetch(`${API_BASE_URL}/api/learning/my-courses`, { headers: { Authorization: `Bearer ${t}` } }),
                fetch(`${API_BASE_URL}/api/learning/certificates/mine`, { headers: { Authorization: `Bearer ${t}` } }),
                fetch(`${API_BASE_URL}/api/learning/stats`, { headers: { Authorization: `Bearer ${t}` } }),
                fetch(`${API_BASE_URL}/api/learning/leaderboard`, { headers: { Authorization: `Bearer ${t}` } }),
            ]);
            if (courseRes.ok) setCourses(await courseRes.json());
            if (enrollRes.ok) setEnrollments(await enrollRes.json());
            if (certRes.ok) setCertificates(await certRes.json());
            if (statsRes.ok) setStats(await statsRes.json());
            if (lbRes.ok) setLeaderboard(await lbRes.json());
        } catch { }
        setLoading(false);
    };

    const handleEnroll = async (courseId: number) => {
        const res = await fetch(`${API_BASE_URL}/api/learning/courses/${courseId}/enroll`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
            fetchAll(token);
            setActiveTab('my-learning');
        }
    };

    const getEnrollment = (courseId: number) => enrollments.find(e => e.course_id === courseId);

    const filteredCourses = courses
        .filter(c => selectedCategory === 'All' || c.category === selectedCategory)
        .filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase()));

    const inProgressCourses = enrollments.filter(e => e.status === 'in_progress' || e.status === 'enrolled');
    const completedCourses = enrollments.filter(e => e.status === 'completed');

    const MEDAL_COLORS = ['text-amber-400', 'text-zinc-300', 'text-amber-600'];

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-[#080818] to-zinc-950 p-6">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                            <BookOpen size={20} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Learning & Development</h1>
                            <p className="text-white/40 text-sm">Grow skills, earn certificates, climb the leaderboard</p>
                        </div>
                    </div>

                    {/* Stats */}
                    {stats && (
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                            <StatCard icon={<BookOpen size={14} />} label="Courses" value={stats.total_courses} color="text-indigo-400" />
                            <StatCard icon={<Users size={14} />} label="Enrollments" value={stats.total_enrollments} color="text-blue-400" />
                            <StatCard icon={<CheckCircle2 size={14} />} label="Completions" value={stats.total_completions} color="text-emerald-400" />
                            <StatCard icon={<Award size={14} />} label="Certificates" value={stats.certificates_issued} color="text-amber-400" />
                            <StatCard icon={<TrendingUp size={14} />} label="Completion Rate" value={`${stats.completion_rate}%`} color="text-violet-400" />
                        </div>
                    )}

                    {/* Tabs */}
                    <div className="flex gap-1 bg-white/[0.03] p-1 rounded-xl border border-white/10 w-fit">
                        {([
                            { key: 'library', label: '📚 Library' },
                            { key: 'my-learning', label: '🎯 My Learning' },
                            { key: 'certificates', label: '🏆 Certificates' },
                            { key: 'leaderboard', label: '🔥 Leaderboard' },
                        ] as const).map(tab => (
                            <button key={tab.key} onClick={() => { setActiveTab(tab.key); setSelectedCourse(null); }}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.key ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-white/50 hover:text-white'}`}>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Course Detail / Learner Panel */}
                <AnimatePresence mode="wait">
                    {selectedCourse && (
                        <motion.div key="course-detail" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <CourseLearnerPanel
                                course={selectedCourse}
                                enrollment={getEnrollment(selectedCourse.id)}
                                token={token}
                                onBack={() => setSelectedCourse(null)}
                                onRefresh={() => fetchAll(token)}
                            />
                        </motion.div>
                    )}

                    {/* Library Tab */}
                    {!selectedCourse && activeTab === 'library' && (
                        <motion.div key="library" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            {/* Search + Filters */}
                            <div className="flex gap-3 mb-5 flex-wrap">
                                <div className="relative flex-1 min-w-48">
                                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                                    <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                                        placeholder="Search courses..." className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50" />
                                </div>
                                <div className="flex gap-1.5 flex-wrap">
                                    {CATEGORIES.map(cat => (
                                        <button key={cat} onClick={() => setSelectedCategory(cat)}
                                            className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all ${selectedCategory === cat ? 'bg-indigo-600/20 border-indigo-500/30 text-indigo-400' : 'border-white/10 text-white/40 hover:text-white hover:border-white/20'}`}>
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {filteredCourses.length === 0 ? (
                                <div className="text-center py-20 text-white/20">
                                    <BookOpen size={40} className="mx-auto mb-3 opacity-30" />
                                    <p className="text-sm">No courses available yet.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                    {filteredCourses.map(course => (
                                        <CourseCard key={course.id} course={course}
                                            enrollment={getEnrollment(course.id)}
                                            onEnroll={handleEnroll}
                                            onOpen={setSelectedCourse}
                                        />
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* My Learning Tab */}
                    {!selectedCourse && activeTab === 'my-learning' && (
                        <motion.div key="my-learning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
                            {inProgressCourses.length > 0 && (
                                <div>
                                    <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">In Progress</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {inProgressCourses.map(e => {
                                            const course = courses.find(c => c.id === e.course_id);
                                            return course ? (
                                                <CourseCard key={e.id} course={course} enrollment={e} onEnroll={handleEnroll} onOpen={setSelectedCourse} />
                                            ) : null;
                                        })}
                                    </div>
                                </div>
                            )}
                            {completedCourses.length > 0 && (
                                <div>
                                    <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">Completed ✅</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {completedCourses.map(e => {
                                            const course = courses.find(c => c.id === e.course_id);
                                            return course ? (
                                                <CourseCard key={e.id} course={course} enrollment={e} onEnroll={handleEnroll} onOpen={setSelectedCourse} />
                                            ) : null;
                                        })}
                                    </div>
                                </div>
                            )}
                            {enrollments.length === 0 && (
                                <div className="text-center py-20 text-white/20">
                                    <Target size={40} className="mx-auto mb-3 opacity-30" />
                                    <p className="text-sm">You haven't enrolled in any courses yet.</p>
                                    <button onClick={() => setActiveTab('library')} className="mt-3 text-indigo-400 text-sm hover:text-indigo-300 transition-colors">Browse the library →</button>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Certificates Tab */}
                    {!selectedCourse && activeTab === 'certificates' && (
                        <motion.div key="certs" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            {certificates.length === 0 ? (
                                <div className="text-center py-20 text-white/20">
                                    <Award size={40} className="mx-auto mb-3 opacity-30" />
                                    <p className="text-sm">No certificates yet. Complete a course to earn one!</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {certificates.map(cert => {
                                        const course = courses.find(c => c.id === cert.course_id);
                                        return (
                                            <motion.div key={cert.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                                className="rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-900/10 border border-amber-500/20 p-6">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                                                        <Trophy size={22} className="text-amber-400" />
                                                    </div>
                                                    <span className="text-[10px] font-mono text-amber-400/60 bg-amber-500/10 px-2 py-1 rounded">{cert.certificate_number}</span>
                                                </div>
                                                <h3 className="text-base font-bold text-white mb-1">{course?.title || 'Course Completed'}</h3>
                                                <p className="text-xs text-white/40">Issued {new Date(cert.issued_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                                {cert.score && <p className="text-xs text-amber-400 mt-1">Score: {cert.score}%</p>}
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Leaderboard Tab */}
                    {!selectedCourse && activeTab === 'leaderboard' && (
                        <motion.div key="leaderboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div className="rounded-2xl bg-white/[0.03] border border-white/10 overflow-hidden">
                                <div className="p-5 border-b border-white/10">
                                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                                        <Flame size={18} className="text-amber-400" /> Top Learners
                                    </h2>
                                    <p className="text-xs text-white/40 mt-0.5">Ranked by completed courses</p>
                                </div>
                                {leaderboard.length === 0 ? (
                                    <div className="py-16 text-center text-white/20">
                                        <Trophy size={32} className="mx-auto mb-3 opacity-30" />
                                        <p className="text-sm">No completions yet. Be the first!</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-white/5">
                                        {leaderboard.map((entry, idx) => (
                                            <motion.div key={entry.employee_id}
                                                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}
                                                className="flex items-center gap-4 p-5 hover:bg-white/[0.02] transition-colors">
                                                <div className={`text-2xl font-black w-8 text-center ${MEDAL_COLORS[idx] || 'text-white/30'}`}>
                                                    {idx < 3 ? <Medal size={22} /> : `#${entry.rank}`}
                                                </div>
                                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-sm font-bold text-white">
                                                    {entry.employee_id}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-semibold text-white">Employee #{entry.employee_id}</p>
                                                    <p className="text-xs text-white/40">{entry.completed_courses} courses completed</p>
                                                </div>
                                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                                                    <Star size={12} className="text-indigo-400" />
                                                    <span className="text-xs font-bold text-indigo-400">{entry.completed_courses}</span>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
