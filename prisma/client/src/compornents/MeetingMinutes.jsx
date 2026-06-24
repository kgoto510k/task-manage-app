import React, { useState } from 'react';
function MeetingMinutes({ onTaskExtracted }) {
 const [title, setTitle] = useState('');
 const [content, setContent] = useState('');
 const [loading, setLoading] = useState(false);
 const handleSubmit = async (e) => {
 e.preventDefault();
 if (!title || !content) return;
 setLoading(true);
 try {
 const res = await fetch('/api/meetings', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ title, content })
 });
 if (res.ok) {
 setContent('');
 alert('議事録を保存し、タスクを抽出しました！');
 onTaskExtracted();
 }
 } catch (err) {
 console.error(err);
 } finally {
 setLoading(false);
 }
 };
 return (
 <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
 <h3 style={{ margin: '0 0 10px 0', color: '#1e293b' }}> 議事録の入力（ここからタスクを自動抽
出）</h3>
 <form onSubmit={handleSubmit}>
 <input
 type="text"
 placeholder="会議タイトル (例: 第3回定例ミーティング)"
 value={title}
 onChange={(e) => setTitle(e.target.value)}
 style={{ width: '100%', padding: '8px', marginBottom: '10px', boxSizing: 'borderbox', border: '1px solid #cbd5e1', borderRadius: '4px' }}
 />
 <textarea
 placeholder="【タスクの入力ルール】
「・」または「-」で行を開始し、後ろに「@名前」をつけると複数人でも自動で共有・アサインされます。
例：
・LPのワイヤーフレーム作成 @田中 @佐藤
・バックエンドのAPI設計 @鈴木"
 value={content}
 onChange={(e) => setContent(e.target.value)}
 rows={5}
 style={{ width: '100%', padding: '8px', marginBottom: '10px', boxSizing: 'borderbox', border: '1px solid #cbd5e1', borderRadius: '4px', fontFamily: 'sans-serif' }}
 />
 <button
 type="submit"
 disabled={loading}
 style={{ width: '100%', padding: '10px', background: '#0f172a', color: '#fff',
border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
 >
 {loading ? '解析中...' : '議事録を提出してタスク化'}
 </button>
 </form>
 </div>
 );
}
export default MeetingMinutes;
