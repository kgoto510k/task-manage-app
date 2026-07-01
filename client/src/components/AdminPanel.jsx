import React, { useState } from 'react';

function AdminPanel({ users, onUpdate }) {
    const [newUserName, setNewUserName] = useState('');
    const [newUserEmail, setNewUserEmail] = useState('');

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
        </div>
    );
}
export default AdminPanel;