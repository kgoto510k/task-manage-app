import React, { useState } from 'react';

function TaskBoard({ tasks, users, onTaskUpdate }) {
    const [filterUserId, setFilterUserId] = useState("ALL");

    const handleStatusChange = async (taskId, currentStatus) => {
        let nextStatus = "TODO";
        if (currentStatus === "TODO") nextStatus = "IN_PROGRESS";
        else if (currentStatus === "IN_PROGRESS") nextStatus = "DONE";

        try {
            await fetch(`/api/tasks/${taskId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: nextStatus })
            });
            onTaskUpdate();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeadlineChange = async (taskId, deadline) => {
        try {
            await fetch(`/api/tasks/${taskId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ deadline })
            });
            onTaskUpdate();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (taskId) => {
        if (!window.confirm("このタスクを削除しますか？")) return;
        try {
            await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
            onTaskUpdate();
        } catch (err) {
            console.error(err);
        }
    };

    const getStatusLabel = (status) => {
        if (status === "TODO") return "未着手";
        if (status === "IN_PROGRESS") return "着手中";
        return "完了";
    };

    // フィルタリングロジック
    const filteredTasks = tasks.filter(task => {
        // 1. 「すべてのタスク」の時は全部表示
        if (filterUserId === "ALL") return true;
        // 2. 「担当者なし (全員共通)」のみを表示したい場合
        if (filterUserId === "UNASSIGNED") return task.assignments.length === 0;
        // 3. 特定のユーザーを選択時：
        // 「そのユーザーのタスク」 OR 「担当者なし(全員共通)のタスク」を表示
        const isAssignedToUser = task.assignments.some(a => a.userId.toString() === filterUserId);
        const isUnassigned = task.assignments.length === 0;
        return isAssignedToUser || isUnassigned;
    });

    return (
        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ margin: 0, color: '#1e293b' }}>📋 共有タスクボード</h3>
                <select
                    value={filterUserId}
                    onChange={(e) => setFilterUserId(e.target.value)}
                    style={{ padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                >
                    <option value="ALL">すべてのタスク</option>
                    <option value="UNASSIGNED">担当者なし (全員共通)</option>
                    {users && users.map(u => (
                        <option key={u.id} value={u.id}>{u.name} のタスク</option>
                    ))}
                </select>
            </div>

            {filteredTasks.length === 0 ? (
                <p style={{ color: '#64748b', textAlign: 'center', padding: '20px' }}>表示するタスクがありません。</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                            <th style={{ padding: '8px', width: '30%' }}>タスク内容</th>
                            <th style={{ padding: '8px', width: '25%' }}>担当者</th>
                            <th style={{ padding: '8px', width: '15%' }}>期限</th>
                            <th style={{ padding: '8px', width: '20%' }}>進捗</th>
                            <th style={{ padding: '8px', width: '10%' }}>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTasks.map(task => (
                            <tr key={task.id} style={{ borderBottom: '1px solid #e2e8f0', background: task.status === "DONE" ? "#f8fafc" : "#fff" }}>
                                <td style={{ padding: '8px' }}>
                                    <div style={{ fontWeight: 'bold', textDecoration: task.status === "DONE" ? 'line-through' : 'none' }}>{task.title}</div>
                                    {task.meeting && <small style={{ color: '#94a3b8' }}>元: {task.meeting.title}</small>}
                                </td>
                                <td style={{ padding: '8px' }}>
                                    {task.assignments.length === 0 ? (
                                        <span style={{ color: '#94a3b8', fontSize: '12px' }}>全員共通</span>
                                    ) : (
                                        task.assignments.map(a => (
                                            <span key={a.userId} style={{ background: '#e0f2fe', color: '#0369a1', padding: '2px 6px', borderRadius: '4px', marginRight: '4px', fontSize: '12px', display: 'inline-block', marginBottom: '2px' }}>
                                                {a.user.name}
                                            </span>
                                        ))
                                    )}
                                </td>
                                <td style={{ padding: '8px' }}>
                                    <input
                                        type="date"
                                        value={task.deadline || ''}
                                        onChange={(e) => handleDeadlineChange(task.id, e.target.value)}
                                        style={{ border: '1px solid #cbd5e1', borderRadius: '4px', padding: '2px 4px', width: '90%' }}
                                    />
                                </td>
                                <td style={{ padding: '8px' }}>
                                    <button
                                        onClick={() => handleStatusChange(task.id, task.status)}
                                        style={{
                                            width: '100%', padding: '6px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold',
                                            background: task.status === "TODO" ? "#fee2e2" : task.status === "IN_PROGRESS" ? "#fef3c7" : "#dcfce7",
                                            color: task.status === "TODO" ? "#991b1b" : task.status === "IN_PROGRESS" ? "#92400e" : "#166534"
                                        }}
                                    >
                                        {getStatusLabel(task.status)}
                                    </button>
                                </td>
                                <td style={{ padding: '8px', textAlign: 'center' }}>
                                    <button onClick={() => handleDelete(task.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '16px' }} title="タスクを削除">
                                        🗑️
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
export default TaskBoard;
