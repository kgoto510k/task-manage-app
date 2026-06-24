import React from 'react';
function TaskBoard({ tasks, onTaskUpdate }) {
 const handleStatusChange = async (taskId, currentStatus) => {
 let nextStatus = "TODO";
 if (currentStatus === "TODO") nextStatus = "IN_PROGRESS";
 else if (currentStatus === "IN_PROGRESS") nextStatus = "DONE";
 else nextStatus = "TODO";
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
 const getStatusLabel = (status) => {
 if (status === "TODO") return "未着手 ";
 if (status === "IN_PROGRESS") return "着手中 ";
 return "完了 ";
 };
 return (
 <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
 <h3 style={{ margin: '0 0 15px 0', color: '#1e293b' }}> 共有タスクボード（チーム全体に即時同
期）</h3>
 {tasks.length === 0 ? (
 <p style={{ color: '#64748b', textAlign: 'center', padding: '20px' }}>現在タスクはありませ
ん。上のフォームから議事録を入力してください。</p>
 ) : (
 <table>
 <thead>
 <tr>
 <th style={{ width: '35%' }}>タスク内容</th>
 <th style={{ width: '25%' }}>共同担当者</th>
 <th style={{ width: '20%' }}>期限</th>
 <th style={{ width: '20%' }}>進捗（クリックで変更）</th>
 </tr>
 </thead>
 <tbody>
 {tasks.map(task => (
 <tr key={task.id} style={{ background: task.status === "DONE" ? "#f8fafc" :
"#fff" }}>
 <td>
 <div style={{ fontWeight: 'bold', decoration: task.status === "DONE" ? 'linethrough' : 'none' }}>{task.title}</div>
 {task.meeting && <small style={{ color: '#94a3b8' }}>元議事録:
{task.meeting.title}</small>}
 </td>
 <td>
 {task.assignments.length === 0 ? (
 <span style={{ color: '#94a3b8', fontSize: '12px' }}>全員共通</span>
 ) : (
 task.assignments.map(a => (
 <span key={a.userId} style={{ background: '#e0f2fe', color: '#0369a1',
padding: '2px 6px', borderRadius: '4px', marginRight: '4px', fontSize: '12px' }}>
 {a.user.name}
 </span>
 ))
 )}
 </td>
 <td>
 <input
 type="date"
 value={task.deadline || ''}
 onChange={(e) => handleDeadlineChange(task.id, e.target.value)}
 style={{ border: '1px solid #cbd5e1', borderRadius: '4px', padding: '2px 4px' }}
 />
 </td>
 <td>
 <button
 onClick={() => handleStatusChange(task.id, task.status)}
 style={{
 width: '100%', padding: '6px', border: 'none', borderRadius: '4px',
cursor: 'pointer', fontWeight: 'bold',
 background: task.status === "TODO" ? "#fee2e2" : task.status ===
"IN_PROGRESS" ? "#fef3c7" : "#dcfce7",
 color: task.status === "TODO" ? "#991b1b" : task.status ===
"IN_PROGRESS" ? "#92400e" : "#166534"
 }}
 >
 {getStatusLabel(task.status)}
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
