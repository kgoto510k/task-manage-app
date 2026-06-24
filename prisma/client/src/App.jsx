import React, { useState, useEffect } from 'react';
import PomodoroTimer from './components/PomodoroTimer';
import MeetingMinutes from './components/MeetingMinutes';
import TaskBoard from './components/TaskBoard';
function App() {
 const [tasks, setTasks] = useState([]);
 const [refreshTrigger, setRefreshTrigger] = useState(0);
 const fetchTasks = async () => {
 try {
 const res = await fetch('/api/tasks');
 const data = await res.json();
 setTasks(data);
 } catch (err) {
 console.error("タスクの取得に失敗:", err);
 }
 };
 useEffect(() => {
 fetchTasks();
 }, [refreshTrigger]);
 const triggerRefresh = () => setRefreshTrigger(prev => prev + 1);
 return (
 <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
 <header style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '16px', marginBottom:
'24px' }}>
 <h1 style={{ margin: 0, color: '#0f172a', fontSize: '28px' }}>Team Task Management
Hub</h1>
 <p style={{ margin: '4px 0 0 0', color: '#64748b' }}>議事録抽出・共有タスク管理・ポモドーロタ
イマー</p>
 </header>
 {/* 上部: タイマーと議事録（左右に配置） */}
 <div style={{ display: 'block', marginBottom: '24px' }}>
 <div style={{ float: 'left', width: '35%', marginRight: '3%' }}>
 <PomodoroTimer />
 </div>
 <div style={{ float: 'left', width: '62%' }}>
 <MeetingMinutes onTaskExtracted={triggerRefresh} />
 </div>
 <div style={{ clear: 'both' }}></div>
 </div>
 {/* 下部: メインタスクボード */}
 <div style={{ marginTop: '24px' }}>
 <TaskBoard tasks={tasks} onTaskUpdate={triggerRefresh} />
 </div>
 </div>
 );
}
export default App;