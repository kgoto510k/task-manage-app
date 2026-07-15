import React, { useState } from 'react';

function AdminPanel({ users, tasks, onUpdate }) {
    const [newUserName, setNewUserName] = useState('');
    const [newUserEmail, setNewUserEmail] = useState('');
    const [expandedTaskId, setExpandedTaskId] = useState(null);
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editingTaskTitle, setEditingTaskTitle] = useState('');
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingCommentContent, setEditingCommentContent] = useState('');

    const handleAddUser = async (e) => {
        e.preventDefault();
        if (!newUserName || !newUserEmail) return;

        try {
            const res = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newUserName, email: newUserEmail, role: "MEMBER" })
            });
            if (res.ok) {
                setNewUserName('');
                setNewUserEmail('');
                onUpdate();
                alert("メンバーを追加しました！");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteUser = async (id, name) => {
        if (!window.confirm(`${name}さんを削除してもよろしいですか？紐づくタスクの担当からも外れます。`)) return;
        try {
            await fetch(`/api/users/${id}`, { method: 'DELETE' });
            onUpdate();
        } catch (err) {
            console.error(err);
        }
    };

    const startEditTask = (task) => {
        setEditingTaskId(task.id);
        setEditingTaskTitle(task.title);
    };

    const cancelEditTask = () => {
        setEditingTaskId(null);
        setEditingTaskTitle('');
    };

    const handleSaveTask = async (id) => {
        if (!editingTaskTitle.trim()) return;
        try {
            await fetch(`/api/tasks/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: editingTaskTitle })
            });
            cancelEditTask();
            onUpdate();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteTask = async (id, title) => {
        if (!window.confirm(`タスク「${title}」を削除してもよろしいですか？関連するコメントも削除されます。`)) return;
        try {
            await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
            onUpdate();
        } catch (err) {
            console.error(err);
        }
    };

    const toggleTaskComments = (taskId) => {
        setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
        setEditingCommentId(null);
    };

    const startEditComment = (comment) => {
        setEditingCommentId(comment.id);
        setEditingCommentContent(comment.content);
    };

    const cancelEditComment = () => {
        setEditingCommentId(null);
        setEditingCommentContent('');
    };

    const handleSaveComment = async (id) => {
        if (!editingCommentContent.trim()) return;
        try {
            await fetch(`/api/comments/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: editingCommentContent })
            });
            cancelEditComment();
            onUpdate();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteComment = async (id) => {
        if (!window.confirm('このコメントを削除してもよろしいですか？')) return;
        try {
            await fetch(`/api/comments/${id}`, { method: 'DELETE' });
            onUpdate();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ margin: '0 0 20px 0', color: '#1e3a8a', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>⚙️ 管理者専用パネル</h2>

            <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ flex: '1', padding: '16px', background: '#f8fafc', borderRadius: '8px' }}>
                    <h3 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>➕ 新規メンバーの追加</h3>
                    <form onSubmit={handleAddUser}>
                        <div style={{ marginBottom: '10px' }}>
                            <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>名前（タスクの@指定に使います）</label>
                            <input
                                type="text" value={newUserName} onChange={(e) => setNewUserName(e.target.value)} required
                                style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                                placeholder="例: 高橋"
                            />
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>メールアドレス</label>
                            <input
                                type="email" value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} required
                                style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                                placeholder="takahashi@example.com"
                            />
                        </div>
                        <button type="submit" style={{ width: '100%', padding: '10px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                            メンバーを追加
                        </button>
                    </form>
                </div>

                <div style={{ flex: '1', padding: '16px', background: '#f8fafc', borderRadius: '8px' }}>
                    <h3 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>👥 登録済みメンバー一覧</h3>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {users && users.map(u => (
                            <li key={u.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #e2e8f0' }}>
                                <div>
                                    <span style={{ fontWeight: 'bold', marginRight: '8px' }}>{u.name}</span>
                                    <span style={{ fontSize: '12px', color: '#64748b' }}>{u.email}</span>
                                    {u.role === "ADMIN" && <span style={{ marginLeft: '8px', fontSize: '10px', background: '#fef08a', color: '#854d0e', padding: '2px 4px', borderRadius: '4px' }}>管理者</span>}
                                </div>
                                {u.role !== "ADMIN" && (
                                    <button onClick={() => handleDeleteUser(u.id, u.name)} style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>削除</button>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div style={{ marginTop: '24px', padding: '16px', background: '#f8fafc', borderRadius: '8px' }}>
                <h3 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>📋 タスク・コメント管理</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {tasks && tasks.map(task => {
                        const isExpanded = expandedTaskId === task.id;
                        const isEditingTitle = editingTaskId === task.id;
                        const comments = task.comments || [];
                        return (
                            <li key={task.id} style={{ padding: '10px 0', borderBottom: '1px solid #e2e8f0' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                                    {isEditingTitle ? (
                                        <>
                                            <input
                                                type="text" value={editingTaskTitle}
                                                onChange={(e) => setEditingTaskTitle(e.target.value)}
                                                style={{ flex: 1, padding: '6px 8px', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                                            />
                                            <button onClick={() => handleSaveTask(task.id)} style={{ background: '#dbeafe', color: '#1e40af', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>保存</button>
                                            <button onClick={cancelEditTask} style={{ background: '#f1f5f9', color: '#475569', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>キャンセル</button>
                                        </>
                                    ) : (
                                        <>
                                            <span style={{ flex: 1 }}>{task.title}</span>
                                            <button onClick={() => toggleTaskComments(task.id)} style={{ background: 'transparent', border: '1px solid #cbd5e1', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                                                💬 {comments.length}
                                            </button>
                                            <button onClick={() => startEditTask(task)} style={{ background: '#dbeafe', color: '#1e40af', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>編集</button>
                                            <button onClick={() => handleDeleteTask(task.id, task.title)} style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>削除</button>
                                        </>
                                    )}
                                </div>

                                {isExpanded && (
                                    <div style={{ marginTop: '10px', marginLeft: '16px', paddingLeft: '12px', borderLeft: '2px solid #e2e8f0' }}>
                                        {comments.length === 0 && (
                                            <div style={{ fontSize: '12px', color: '#94a3b8' }}>コメントはありません。</div>
                                        )}
                                        {comments.map(c => (
                                            <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0', fontSize: '13px' }}>
                                                {editingCommentId === c.id ? (
                                                    <>
                                                        <input
                                                            type="text" value={editingCommentContent}
                                                            onChange={(e) => setEditingCommentContent(e.target.value)}
                                                            style={{ flex: 1, padding: '4px 6px', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                                                        />
                                                        <button onClick={() => handleSaveComment(c.id)} style={{ background: '#dbeafe', color: '#1e40af', border: 'none', padding: '3px 6px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>保存</button>
                                                        <button onClick={cancelEditComment} style={{ background: '#f1f5f9', color: '#475569', border: 'none', padding: '3px 6px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>キャンセル</button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span style={{ flex: 1 }}>
                                                            <strong style={{ color: '#3b82f6' }}>{c.user.name}:</strong> {c.content}
                                                        </span>
                                                        <button onClick={() => startEditComment(c)} style={{ background: '#dbeafe', color: '#1e40af', border: 'none', padding: '3px 6px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>編集</button>
                                                        <button onClick={() => handleDeleteComment(c.id)} style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '3px 6px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>削除</button>
                                                    </>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </li>
                        );
                    })}
                    {(!tasks || tasks.length === 0) && (
                        <li style={{ fontSize: '13px', color: '#94a3b8', padding: '8px 0' }}>タスクがありません。</li>
                    )}
                </ul>
            </div>
        </div>
    );
}
export default AdminPanel;
