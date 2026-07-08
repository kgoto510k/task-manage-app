import React from 'react';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';
function TaskBoard({ tasks, users, onTaskUpdate, activeTaskName, setActiveTaskName }) {
  const { colors, isDarkMode } = useTheme();

  const handleSelectTask = (taskTitle) => {
    setActiveTaskName(taskTitle);
    toast.success(`「${taskTitle}」をタイマーにセットしました！`, { icon: '🎯' });
  };

  return (
    <div style={{ background: colors.cardBg, color: colors.text, padding: '24px', borderRadius: '8px', border: `1px solid ${colors.border}` }}>
      <h3 style={{ margin: '0 0 20px 0' }}>📋 共有タスクボード</h3>
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
            {tasks.map(task => {
              const isCurrentActive = activeTaskName === task.title;
              return (
                <tr 
                  key={task.id} 
                  style={{ 
                    borderBottom: `1px solid ${colors.border}`,
                    background: isCurrentActive ? (isDarkMode ? 'rgba(59,130,246,0.15)' : 'rgba(59,130,246,0.05)') : 'transparent',
                    fontWeight: isCurrentActive ? 'bold' : 'normal'
                  }}
                >
                  <td style={{ padding: '12px' }}>
                    <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', background: task.status === 'COMPLETED' ? '#10b981' : '#f59e0b', color: '#fff' }}>
                      {task.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    {task.title}
                    {isCurrentActive && <span style={{ marginLeft: '8px', color: '#3b82f6', fontSize: '12px' }}>● 集中中</span>}
                  </td>
                  <td style={{ padding: '12px' }}>{task.user?.name || '未割り当て'}</td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    {task.status !== 'COMPLETED' && (
                      <button 
                        onClick={() => handleSelectTask(task.title)}
                        disabled={isCurrentActive}
                        style={{ 
                          padding: '6px 12px', 
                          marginRight: '8px',
                          background: isCurrentActive ? '#64748b' : '#ef4444', 
                          color: '#fff', 
                          border: 'none', 
                          borderRadius: '4px', 
                          cursor: isCurrentActive ? 'not-allowed' : 'pointer',
                          fontSize: '13px'
                        }}
                      >
                        🍅 {isCurrentActive ? '集中中' : '集中する'}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default TaskBoard;