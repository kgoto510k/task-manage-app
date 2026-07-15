import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

function TaskBoard({ tasks, users, onTaskUpdate, activeTaskName, setActiveTaskName }) {
  const { colors, isDarkMode } = useTheme();
  const [filterUserId, setFilterUserId] = useState("ALL");
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [commentInput, setCommentInput] = useState("");
  const [commentUserId, setCommentUserId] = useState("");

  const handleSelectTask = (taskTitle) => {
    setActiveTaskName(taskTitle);
    toast.success(`「${taskTitle}」をタイマーにセットしました！`, { icon: '🎯' });
  };

  const handleStatusChange = async (taskId, newStatus, taskTitle) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        onTaskUpdate();
        if (newStatus === 'COMPLETED') {
          toast.success(`「${taskTitle}」完了お疲れ様です！🎉`);
          if (activeTaskName === taskTitle) setActiveTaskName(null);
        }
      }
    } catch (err) {
      toast.error("更新に失敗しました");
    }
  };

  const handleAddComment = async (taskId) => {
    if (!commentInput.trim()) return;
    const userId = commentUserId || (users.length > 0 ? users[0].id : null);
    if (!userId) {
      toast.error("投稿者を選択するか、ユーザーを登録してください");
      return;
    }
    
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, userId, content: commentInput })
      });
      if (res.ok) {
        setCommentInput("");
        onTaskUpdate();
        toast.success("コメントを投稿しました");
      }
    } catch (err) {
      toast.error("エラーが発生しました");
    }
  };

  const toggleComments = (taskId) => {
    if (expandedTaskId === taskId) {
      setExpandedTaskId(null);
    } else {
      setExpandedTaskId(taskId);
      setCommentInput("");
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filterUserId === "ALL") return true;
    if (filterUserId === "UNASSIGNED") return task.assignments.length === 0;
    const isAssignedToUser = task.assignments.some(a => a.userId.toString() === filterUserId);
    const isUnassigned = task.assignments.length === 0;
    return isAssignedToUser || isUnassigned;
  });

  return (
    <div style={{ background: colors.cardBg, color: colors.text, padding: '24px', borderRadius: '8px', border: `1px solid ${colors.border}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <h3 style={{ margin: 0 }}>共有タスクボード</h3>
        
        <select 
          value={filterUserId} 
          onChange={(e) => setFilterUserId(e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: `1px solid ${colors.border}`, background: 'transparent', color: colors.text }}
        >
          <option value="ALL">すべてのタスク</option>
          <option value="UNASSIGNED">担当者なし (全員共通)</option>
          {users.map(u => <option key={u.id} value={u.id}>{u.name} さんのタスク</option>)}
        </select>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: `2px solid ${colors.border}`, opacity: 0.8 }}>
              <th style={{ padding: '12px' }}>ステータス</th>
              <th style={{ padding: '12px' }}>タスク内容</th>
              <th style={{ padding: '12px' }}>担当者</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>アクション</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map(task => {
              const isCurrentActive = activeTaskName === task.title;
              const commentCount = task.comments ? task.comments.length : 0;
              const isExpanded = expandedTaskId === task.id;

              return (
                <React.Fragment key={task.id}>
                  <tr style={{ 
                    borderBottom: isExpanded ? 'none' : `1px solid ${colors.border}`,
                    background: isCurrentActive ? (isDarkMode ? 'rgba(59,130,246,0.15)' : 'rgba(59,130,246,0.05)') : 'transparent',
                    fontWeight: isCurrentActive ? 'bold' : 'normal'
                  }}>
                    <td style={{ padding: '12px' }}>
                      <select 
                        value={task.status} 
                        onChange={(e) => handleStatusChange(task.id, e.target.value, task.title)}
                        style={{ padding: '4px 8px', borderRadius: '4px', border: 'none', background: task.status === 'COMPLETED' ? '#10b981' : (task.status === 'IN_PROGRESS' ? '#3b82f6' : '#f59e0b'), color: '#fff', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                      >
                        <option value="TODO">未着手</option>
                        <option value="IN_PROGRESS">進行中</option>
                        <option value="COMPLETED">完了</option>
                      </select>
                    </td>
                    <td style={{ padding: '12px' }}>
                      {task.title}
                      {isCurrentActive && <span style={{ marginLeft: '8px', color: '#3b82f6', fontSize: '12px' }}>● 集中中</span>}
                    </td>
                    <td style={{ padding: '12px' }}>
                      {task.assignments.length > 0 
                        ? task.assignments.map(a => <span key={a.userId} style={{ background: isDarkMode ? '#374151' : '#e2e8f0', padding: '2px 6px', borderRadius: '4px', fontSize: '12px', marginRight: '4px' }}>@{a.user.name}</span>) 
                        : <span style={{ opacity: 0.5, fontSize: '12px' }}>全員共通</span>}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <button 
                        onClick={() => toggleComments(task.id)}
                        style={{ padding: '6px 10px', marginRight: '8px', background: 'transparent', border: `1px solid ${colors.border}`, borderRadius: '4px', color: colors.text, cursor: 'pointer', fontSize: '12px' }}
                      >
                        💬 {commentCount}
                      </button>
                      
                      {task.status !== 'COMPLETED' && (
                        <button 
                          onClick={() => handleSelectTask(task.title)}
                          disabled={isCurrentActive}
                          style={{ padding: '6px 12px', background: isCurrentActive ? '#64748b' : '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: isCurrentActive ? 'not-allowed' : 'pointer', fontSize: '13px' }}
                        >
                          🍅 {isCurrentActive ? '集中中' : '集中する'}
                        </button>
                      )}
                    </td>
                  </tr>

                  {isExpanded && (
                    <tr style={{ borderBottom: `1px solid ${colors.border}`, background: isDarkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }}>
                      <td colSpan="4" style={{ padding: '16px 24px' }}>
                        <div style={{ marginBottom: '16px' }}>
                          {task.comments && task.comments.length > 0 ? (
                            task.comments.map(c => (
                              <div key={c.id} style={{ marginBottom: '8px', fontSize: '13px' }}>
                                <strong style={{ color: '#3b82f6' }}>{c.user.name}:</strong> 
                                <span style={{ marginLeft: '8px' }}>{c.content}</span>
                                <span style={{ marginLeft: '8px', opacity: 0.5, fontSize: '11px' }}>
                                  ({new Date(c.createdAt).toLocaleString('ja-JP', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })})
                                </span>
                              </div>
                            ))
                          ) : (
                            <div style={{ opacity: 0.5, fontSize: '13px' }}>まだコメントはありません。</div>
                          )}
                        </div>
                        
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <select 
                            value={commentUserId} 
                            onChange={(e) => setCommentUserId(e.target.value)}
                            style={{ padding: '8px', borderRadius: '4px', border: `1px solid ${colors.border}`, background: 'transparent', color: colors.text }}
                          >
                            <option value="">投稿者を選択</option>
                            {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                          </select>
                          <input 
                            type="text" 
                            placeholder="コメントを入力..." 
                            value={commentInput} 
                            onChange={(e) => setCommentInput(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleAddComment(task.id) }}
                            style={{ flex: 1, padding: '8px', borderRadius: '4px', border: `1px solid ${colors.border}`, background: 'transparent', color: colors.text }}
                          />
                          <button 
                            onClick={() => handleAddComment(task.id)}
                            style={{ padding: '8px 16px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                          >
                            送信
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
        {filteredTasks.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 0', opacity: 0.5 }}>表示するタスクがありません。</div>
        )}
      </div>
    </div>
  );
}
export default TaskBoard;
