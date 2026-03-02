'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Heart, MessageCircle, Users, Award, Megaphone, Star, Zap,
    Send, ThumbsUp, Smile, TrendingUp, Plus, ChevronRight, Gift,
    Globe, Coffee, Lightbulb, Target, PartyPopper
} from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://payroll-api-production-f97d.up.railway.app';

// --- Types ---
type PostType = 'announcement' | 'shoutout' | 'update' | 'celebration' | 'general';

interface Post {
    id: number;
    post_type: PostType;
    title?: string;
    content: string;
    author_id: number;
    recipient_name?: string;
    kudos_badge?: string;
    is_pinned: boolean;
    reaction_count: number;
    comment_count: number;
    created_at: string;
}

// --- Config ---
const POST_TYPE_CONFIG: Record<PostType, { label: string; icon: React.ReactNode; color: string; bg: string }> = {
    announcement: { label: 'Announcement', icon: <Megaphone size={16} />, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
    shoutout: { label: 'Shoutout', icon: <Star size={16} />, color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20' },
    update: { label: 'Update', icon: <TrendingUp size={16} />, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    celebration: { label: 'Celebration', icon: <PartyPopper size={16} />, color: 'text-pink-400', bg: 'bg-pink-500/10 border-pink-500/20' },
    general: { label: 'Post', icon: <Globe size={16} />, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
};

const KUDOS_BADGES = ['Team Player 🤝', 'Innovator 💡', 'Above & Beyond ⭐', 'Culture Champion 🏆', 'Problem Solver 🔧', 'Mentor 🌟'];

const REACTION_EMOJIS = [
    { type: 'like', emoji: '👍', label: 'Like' },
    { type: 'love', emoji: '❤️', label: 'Love' },
    { type: 'celebrate', emoji: '🎉', label: 'Celebrate' },
    { type: 'support', emoji: '🤝', label: 'Support' },
    { type: 'insightful', emoji: '💡', label: 'Insightful' },
];

function getRelativeTime(dateStr: string) {
    const date = new Date(dateStr);
    const diff = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
}

// --- Sub-components ---

function PostCard({ post, token }: { post: Post; token: string }) {
    const cfg = POST_TYPE_CONFIG[post.post_type];
    const [showReactions, setShowReactions] = useState(false);
    const [localReactions, setLocalReactions] = useState(post.reaction_count);
    const [reacted, setReacted] = useState(false);

    const handleReact = async (type: string) => {
        try {
            const res = await fetch(`${API_BASE}/api/engagement/posts/${post.id}/react`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ reaction_type: type }),
            });
            const data = await res.json();
            setLocalReactions(prev => data.action === 'added' ? prev + 1 : Math.max(0, prev - 1));
            setReacted(data.action === 'added');
        } catch { }
        setShowReactions(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl border p-5 backdrop-blur-sm transition-all hover:shadow-lg hover:shadow-black/20 ${post.is_pinned
                    ? 'bg-gradient-to-br from-violet-500/10 to-purple-900/20 border-violet-500/30'
                    : 'bg-white/[0.03] border-white/10'
                }`}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm bg-gradient-to-br from-violet-500 to-indigo-600`}>
                        U
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-white">Team Member</p>
                        <p className="text-xs text-white/40">{getRelativeTime(post.created_at)}</p>
                    </div>
                </div>
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${cfg.bg} ${cfg.color}`}>
                    {cfg.icon}
                    {cfg.label}
                </div>
            </div>

            {/* Content */}
            {post.post_type === 'shoutout' && post.recipient_name && (
                <div className="mb-3 p-3 rounded-xl bg-violet-500/10 border border-violet-500/20">
                    <p className="text-xs text-violet-400 font-medium mb-1">🌟 Shoutout to</p>
                    <p className="text-white font-bold text-lg">{post.recipient_name}</p>
                    {post.kudos_badge && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 mt-1 inline-block">
                            {post.kudos_badge}
                        </span>
                    )}
                </div>
            )}
            {post.title && <h3 className="font-semibold text-white text-base mb-1">{post.title}</h3>}
            <p className="text-white/70 text-sm leading-relaxed">{post.content}</p>

            {/* Actions */}
            <div className="flex items-center gap-4 mt-4 pt-3 border-t border-white/5 relative">
                <div className="relative">
                    <button
                        onMouseEnter={() => setShowReactions(true)}
                        onMouseLeave={() => setShowReactions(false)}
                        onClick={() => handleReact('like')}
                        className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg transition-all ${reacted ? 'text-violet-400 bg-violet-500/10' : 'text-white/50 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <ThumbsUp size={14} />
                        {localReactions > 0 ? localReactions : ''} React
                    </button>
                    <AnimatePresence>
                        {showReactions && (
                            <motion.div
                                initial={{ opacity: 0, y: 8, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 8, scale: 0.9 }}
                                className="absolute bottom-full mb-2 left-0 flex gap-1.5 bg-zinc-900 border border-white/10 rounded-2xl p-2 shadow-xl z-10"
                                onMouseEnter={() => setShowReactions(true)}
                                onMouseLeave={() => setShowReactions(false)}
                            >
                                {REACTION_EMOJIS.map(r => (
                                    <button
                                        key={r.type}
                                        onClick={() => handleReact(r.type)}
                                        title={r.label}
                                        className="text-xl hover:scale-125 transition-transform"
                                    >
                                        {r.emoji}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                <button className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-all">
                    <MessageCircle size={14} />
                    {post.comment_count > 0 ? post.comment_count : ''} Comment
                </button>
            </div>
        </motion.div>
    );
}

function ComposePost({ token, onPosted }: { token: string; onPosted: () => void }) {
    const [open, setOpen] = useState(false);
    const [type, setType] = useState<PostType>('general');
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [recipientName, setRecipientName] = useState('');
    const [kudosBadge, setKudosBadge] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!content.trim()) return;
        setSubmitting(true);
        try {
            await fetch(`${API_BASE}/api/engagement/posts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    post_type: type,
                    title: title || undefined,
                    content,
                    recipient_name: type === 'shoutout' ? recipientName : undefined,
                    kudos_badge: type === 'shoutout' ? kudosBadge : undefined,
                }),
            });
            setContent(''); setTitle(''); setRecipientName(''); setKudosBadge(''); setType('general');
            setOpen(false);
            onPosted();
        } catch { }
        setSubmitting(false);
    };

    return (
        <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-5 mb-6">
            <button
                onClick={() => setOpen(true)}
                className="w-full flex items-center gap-3 text-white/40 hover:text-white/70 transition-colors text-sm"
            >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white">U</div>
                <span className="flex-1 text-left bg-white/[0.04] rounded-xl px-4 py-2.5 border border-white/10 hover:border-violet-500/30 transition-colors cursor-pointer">
                    Share an update, shoutout, or announcement...
                </span>
                <Plus size={18} />
            </button>

            {/* Quick type buttons */}
            {!open && (
                <div className="flex gap-2 mt-3 flex-wrap">
                    {(['shoutout', 'announcement', 'celebration'] as PostType[]).map(t => {
                        const cfg = POST_TYPE_CONFIG[t];
                        return (
                            <button key={t} onClick={() => { setType(t); setOpen(true); }}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border transition-all ${cfg.bg} ${cfg.color}`}>
                                {cfg.icon} {cfg.label}
                            </button>
                        );
                    })}
                </div>
            )}

            <AnimatePresence>
                {open && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-4 overflow-hidden">
                        {/* Type selector */}
                        <div className="flex gap-2 flex-wrap mb-4">
                            {(Object.keys(POST_TYPE_CONFIG) as PostType[]).map(t => {
                                const cfg = POST_TYPE_CONFIG[t];
                                return (
                                    <button key={t} onClick={() => setType(t)}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border transition-all ${type === t ? `${cfg.bg} ${cfg.color} border-current` : 'border-white/10 text-white/40 hover:border-white/20'}`}>
                                        {cfg.icon} {cfg.label}
                                    </button>
                                );
                            })}
                        </div>

                        {type === 'shoutout' && (
                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <input value={recipientName} onChange={e => setRecipientName(e.target.value)}
                                    placeholder="Who are you recognizing? 🌟" className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50" />
                                <select value={kudosBadge} onChange={e => setKudosBadge(e.target.value)}
                                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500/50">
                                    <option value="">Select a badge...</option>
                                    {KUDOS_BADGES.map(b => <option key={b} value={b}>{b}</option>)}
                                </select>
                            </div>
                        )}

                        {(type === 'announcement' || type === 'update') && (
                            <input value={title} onChange={e => setTitle(e.target.value)}
                                placeholder="Title (optional)" className="mb-3 w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50" />
                        )}

                        <textarea value={content} onChange={e => setContent(e.target.value)}
                            rows={3} placeholder={
                                type === 'shoutout' ? 'Tell everyone why they deserve this recognition...' :
                                    type === 'announcement' ? 'Share important news with your team...' :
                                        type === 'celebration' ? "What are we celebrating? 🎉" :
                                            'What\'s on your mind?'
                            }
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 resize-none mb-3" />

                        <div className="flex justify-end gap-3">
                            <button onClick={() => setOpen(false)} className="px-4 py-2 text-sm text-white/50 hover:text-white transition-colors">Cancel</button>
                            <button onClick={handleSubmit} disabled={submitting || !content.trim()}
                                className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-medium rounded-xl transition-all disabled:opacity-50">
                                <Send size={14} />
                                {submitting ? 'Posting...' : 'Post'}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// --- Main Page ---

export default function PeopleHubPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<PostType | 'all'>('all');
    const [token, setToken] = useState('');
    const [activeTab, setActiveTab] = useState<'feed' | 'pulse'>('feed');

    // Pulse state
    const [pulseData, setPulseData] = useState<any>(null);
    const [activeSurvey, setActiveSurvey] = useState<any>(null);
    const [mood, setMood] = useState<number | null>(null);
    const [enps, setEnps] = useState<number | null>(null);
    const [feedback, setFeedback] = useState('');
    const [pulseSent, setPulseSent] = useState(false);

    useEffect(() => {
        const t = localStorage.getItem('token') || '';
        setToken(t);
        fetchFeed(t);
        fetchPulse(t);
    }, []);

    const fetchFeed = async (t: string) => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/api/engagement/feed?limit=30`, { headers: { Authorization: `Bearer ${t}` } });
            if (res.ok) setPosts(await res.json());
        } catch { }
        setLoading(false);
    };

    const fetchPulse = async (t: string) => {
        try {
            const [dashRes, activeRes] = await Promise.all([
                fetch(`${API_BASE}/api/pulse/dashboard`, { headers: { Authorization: `Bearer ${t}` } }),
                fetch(`${API_BASE}/api/pulse/surveys/active`, { headers: { Authorization: `Bearer ${t}` } }),
            ]);
            if (dashRes.ok) setPulseData(await dashRes.json());
            if (activeRes.ok) {
                const data = await activeRes.json();
                setActiveSurvey(data);
                if (data.already_responded) setPulseSent(true);
            }
        } catch { }
    };

    const submitPulse = async () => {
        if (!mood || !activeSurvey?.survey) return;
        try {
            await fetch(`${API_BASE}/api/pulse/surveys/${activeSurvey.survey.id}/respond`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ mood_score: mood, enps_score: enps, open_feedback: feedback }),
            });
            setPulseSent(true);
            fetchPulse(token);
        } catch { }
    };

    const filteredPosts = filter === 'all' ? posts : posts.filter(p => p.post_type === filter);

    const MOOD_EMOJIS = [
        { score: 1, emoji: '😢', label: 'Bad' },
        { score: 2, emoji: '😕', label: 'Meh' },
        { score: 3, emoji: '😐', label: 'OK' },
        { score: 4, emoji: '😊', label: 'Good' },
        { score: 5, emoji: '🤩', label: 'Great' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-[#0d0d1a] to-zinc-950 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                            <Users size={20} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">People Hub</h1>
                            <p className="text-white/40 text-sm">Stay connected with your team</p>
                        </div>
                    </div>

                    {/* Stats row */}
                    <div className="grid grid-cols-3 gap-4 mt-5">
                        {[
                            { label: 'Team Posts', value: posts.length.toString(), icon: <Globe size={16} />, color: 'text-emerald-400' },
                            { label: 'Shoutouts', value: posts.filter(p => p.post_type === 'shoutout').length.toString(), icon: <Star size={16} />, color: 'text-violet-400' },
                            { label: 'Team Mood', value: pulseData ? `${(pulseData.avg_mood * 20).toFixed(0)}%` : '—', icon: <Smile size={16} />, color: 'text-pink-400' },
                        ].map(stat => (
                            <div key={stat.label} className="rounded-xl bg-white/[0.03] border border-white/10 p-4">
                                <div className={`flex items-center gap-1.5 text-xs font-medium mb-1 ${stat.color}`}>
                                    {stat.icon} {stat.label}
                                </div>
                                <p className="text-2xl font-bold text-white">{stat.value}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 mb-6 bg-white/[0.03] p-1 rounded-xl border border-white/10 w-fit">
                    {(['feed', 'pulse'] as const).map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)}
                            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all capitalize ${activeTab === tab ? 'bg-violet-600 text-white' : 'text-white/50 hover:text-white'}`}>
                            {tab === 'feed' ? '📣 Feed' : '📊 Pulse Survey'}
                        </button>
                    ))}
                </div>

                {/* Feed Tab */}
                {activeTab === 'feed' && (
                    <div>
                        <ComposePost token={token} onPosted={() => fetchFeed(token)} />

                        {/* Filter bar */}
                        <div className="flex gap-2 mb-4 flex-wrap">
                            <button onClick={() => setFilter('all')}
                                className={`px-3 py-1.5 rounded-full text-xs border transition-all ${filter === 'all' ? 'bg-white/10 border-white/20 text-white' : 'border-white/10 text-white/40 hover:text-white/70'}`}>
                                All Posts
                            </button>
                            {(Object.keys(POST_TYPE_CONFIG) as PostType[]).map(t => {
                                const cfg = POST_TYPE_CONFIG[t];
                                return (
                                    <button key={t} onClick={() => setFilter(t)}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border transition-all ${filter === t ? `${cfg.bg} ${cfg.color}` : 'border-white/10 text-white/40 hover:text-white/70'}`}>
                                        {cfg.icon} {cfg.label}
                                    </button>
                                );
                            })}
                        </div>

                        {loading ? (
                            <div className="text-center py-20 text-white/30 text-sm">Loading feed...</div>
                        ) : filteredPosts.length === 0 ? (
                            <div className="text-center py-20">
                                <p className="text-white/20 text-4xl mb-3">👋</p>
                                <p className="text-white/40 text-sm">No posts yet. Be the first to share something!</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {filteredPosts.map(post => (
                                    <PostCard key={post.id} post={post} token={token} />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Pulse Tab */}
                {activeTab === 'pulse' && (
                    <div className="flex flex-col gap-6">
                        {/* eNPS & Mood Dashboard */}
                        {pulseData && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="rounded-2xl bg-gradient-to-br from-violet-500/10 to-indigo-900/10 border border-violet-500/20 p-6">
                                    <p className="text-xs text-violet-400 font-medium mb-1">Company eNPS Score</p>
                                    <p className={`text-5xl font-black ${pulseData.enps_score >= 30 ? 'text-emerald-400' : pulseData.enps_score >= 0 ? 'text-amber-400' : 'text-red-400'}`}>
                                        {pulseData.enps_score > 0 ? '+' : ''}{pulseData.enps_score}
                                    </p>
                                    <p className="text-xs text-white/40 mt-2">
                                        {pulseData.promoters} Promoters · {pulseData.passives} Passive · {pulseData.detractors} Detractors
                                    </p>
                                </div>
                                <div className="rounded-2xl bg-gradient-to-br from-pink-500/10 to-rose-900/10 border border-pink-500/20 p-6">
                                    <p className="text-xs text-pink-400 font-medium mb-1">Average Mood</p>
                                    <p className="text-5xl font-black text-white">{pulseData.avg_mood}/5</p>
                                    <p className="text-xs text-white/40 mt-2">{pulseData.total_responses} total responses</p>
                                </div>
                            </div>
                        )}

                        {/* Weekly Survey */}
                        {activeSurvey?.survey && !pulseSent && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                className="rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-900/10 border border-emerald-500/20 p-6">
                                <div className="flex items-center gap-2 mb-1">
                                    <Zap size={16} className="text-emerald-400" />
                                    <p className="text-emerald-400 text-sm font-semibold">{activeSurvey.survey.title}</p>
                                </div>
                                <p className="text-white/50 text-xs mb-5">{activeSurvey.survey.description || 'Share how you\'re feeling this week — it\'s anonymous!'}</p>

                                <p className="text-white/70 text-sm font-medium mb-3">How are you feeling today?</p>
                                <div className="flex gap-3 mb-5">
                                    {MOOD_EMOJIS.map(m => (
                                        <button key={m.score} onClick={() => setMood(m.score)}
                                            className={`flex flex-col items-center gap-1 flex-1 py-3 rounded-xl border transition-all ${mood === m.score ? 'bg-emerald-500/20 border-emerald-500/40' : 'border-white/10 hover:border-white/20 bg-white/[0.02]'}`}>
                                            <span className="text-2xl">{m.emoji}</span>
                                            <span className="text-xs text-white/50">{m.label}</span>
                                        </button>
                                    ))}
                                </div>

                                {activeSurvey.survey.include_enps && (
                                    <div className="mb-5">
                                        <p className="text-white/70 text-sm mb-2">How likely are you to recommend us as a workplace? (0-10)</p>
                                        <div className="flex gap-1">
                                            {Array.from({ length: 11 }, (_, i) => (
                                                <button key={i} onClick={() => setEnps(i)}
                                                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${enps === i
                                                        ? i >= 9 ? 'bg-emerald-500 text-white' : i >= 7 ? 'bg-amber-500 text-white' : 'bg-red-500 text-white'
                                                        : 'bg-white/5 text-white/40 hover:bg-white/10'}`}>
                                                    {i}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="flex justify-between text-xs text-white/30 mt-1">
                                            <span>Not likely</span><span>Very likely</span>
                                        </div>
                                    </div>
                                )}

                                {activeSurvey.survey.open_question && (
                                    <div className="mb-5">
                                        <p className="text-white/70 text-sm mb-2">{activeSurvey.survey.open_question}</p>
                                        <textarea value={feedback} onChange={e => setFeedback(e.target.value)} rows={3} placeholder="Your anonymous feedback..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-emerald-500/50 resize-none" />
                                    </div>
                                )}

                                <button onClick={submitPulse} disabled={!mood}
                                    className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-xl transition-all disabled:opacity-40">
                                    Submit (Anonymous) 🔒
                                </button>
                            </motion.div>
                        )}

                        {pulseSent && (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                                <p className="text-4xl mb-3">🎉</p>
                                <p className="text-emerald-400 font-semibold">Thank you for your response!</p>
                                <p className="text-white/40 text-sm mt-1">Your anonymous feedback helps make the workplace better.</p>
                            </motion.div>
                        )}

                        {!activeSurvey?.survey && !pulseSent && (
                            <div className="text-center py-10 rounded-2xl bg-white/[0.02] border border-white/10">
                                <p className="text-4xl mb-3">📋</p>
                                <p className="text-white/40 text-sm">No active pulse survey right now.</p>
                                <p className="text-white/20 text-xs mt-1">HR will send the next one soon!</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
