import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

function MeetingMinutes({ onTaskExtracted }) {
    const { colors } = useTheme();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !content) return;
        setLoading(true);

        const loadingToast = toast.loading('議事録を解析してタスクを抽出中...');

        try {
            const res = await fetch('/api/meetings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content })
            });
            if (res.ok) {
                setContent('');
                toast.success('タスクの自動抽出が完了しました！', { id: loadingToast });
                onTaskExtracted();
            }
        } catch (err) {
            console.error(err);
            toast.error('エラーが発生しました', { id: loadingToast });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ background: colors.cardBg, color: colors.text, padding: '24px', borderRadius: '8px', border: `1px solid ${colors.border}` }}>
            <h3 style={{ margin: '0 0 15px 0' }}>📝 議事録の入力（タスク自動抽出）</h3>
            <form onSubmit={handleSubmit}>
                <input
                    type="text" placeholder="会議タイトル (例: 第3回定例ミーティング)" value={title} onChange={(e) => setTitle(e.target.value)}
                    style={{ width: '100%', padding: '12px', marginBottom: '15px', boxSizing: 'border-box', border: `1px solid ${colors.border}`, borderRadius: '6px', background: 'transparent', color: colors.text }}
                />
                <textarea
                    placeholder="【入力ルール】「・」または「-」で行を開始し、後ろに「@名前」をつけると自動アサインされます。"
                    value={content} onChange={(e) => setContent(e.target.value)} rows={5}
                    style={{ width: '100%', padding: '12px', marginBottom: '15px', boxSizing: 'border-box', border: `1px solid ${colors.border}`, borderRadius: '6px', fontFamily: 'inherit', background: 'transparent', color: colors.text, lineHeight: '1.5' }}
                />
                <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold' }}>
                    {loading ? '解析中...' : '議事録を提出してタスク化'}
                </button>
            </form>
        </div>
    );
}
export default MeetingMinutes;