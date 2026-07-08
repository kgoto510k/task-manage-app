import React from 'react';
import { useTheme } from '../context/ThemeContext';

function ActivityFeed({ activities }) {
  const { colors } = useTheme();

  return (
    <div style={{ background: colors.cardBg, color: colors.text, padding: '20px', borderRadius: '8px', border: `1px solid ${colors.border}`, height: '100%', maxHeight: '600px', overflowY: 'auto' }}>
      <h3 style={{ margin: '0 0 15px 0', borderBottom: `1px solid ${colors.border}`, paddingBottom: '10px' }}>
        チームタイムライン
      </h3>
      {activities.length === 0 ? (
        <p style={{ opacity: 0.6, fontSize: '14px' }}>まだアクティビティがありません。</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {activities.map(act => (
            <li key={act.id} style={{ marginBottom: '16px', fontSize: '13px', lineHeight: '1.5' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '16px', marginTop: '2px' }}>
                  {act.action === 'TASK_UPDATED' ? '✅' : act.action === 'COMMENT_ADDED' ? '💬' : act.action === 'MEETING_ADDED' ? '📝' : '✨'}
                </span>
                <div>
                  <span style={{ color: colors.text }}>{act.details}</span>
                  <div style={{ fontSize: '11px', opacity: 0.5, marginTop: '2px' }}>
                    {new Date(act.createdAt).toLocaleString('ja-JP', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
export default ActivityFeed;