import React, { useState, useEffect } from 'react';
import PomodoroTimer from './components/PomodoroTimer';
import MeetingMinutes from './components/MeetingMinutes';
import TaskBoard from './components/TaskBoard';
import AdminPanel from './components/AdminPanel';

function App() {
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [isAdminMode, setIsAdminMode] = useState(false);

    const fetchData = async () => {
        try {
            const taskRes = await fetch('/api/tasks');
            const taskData = await taskRes.json();
            setTasks(taskData);

            const userRes = await fetch('/api/users');
            const userData = await userRes.json();
            setUsers(userData);
        } catch (err) {
            console.error("データの取得に失敗:", err);
        }
    };

    useEffect(() => {
        fetchData();
    }, [refreshTrigger]);

    const triggerRefresh = () => setRefreshTrigger(prev => prev + 1);

    return (
        <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
            <header style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '16px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ margin: 0, color: '#0f172a', fontSize: '28px' }}>Team Task Management Hub</h1>
                    <p style={{ margin: '4px 0 0 0', color: '#64748b' }}>議事録抽出・共有タスク管理・ポモドーロタイマー</p>
                </div>
                <button
                    onClick={() => setIsAdminMode(!isAdminMode)}
                    style={{ padding: '8px 16px', backgroundColor: isAdminMode ? '#475569' : '#0f172a', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    {isAdminMode ? "🏠 通常画面に戻る" : "⚙️ 管理者画面"}
                </button>
            </header>

            {isAdminMode ? (
                <AdminPanel users={users} onUpdate={triggerRefresh} />
            ) : (
                <>
                    <div style={{ display: 'block', marginBottom: '24px' }}>
                        <div style={{ float: 'left', width: '35%', marginRight: '3%' }}>
                            <PomodoroTimer />
                        </div>
                        <div style={{ float: 'left', width: '62%' }}>
                            <MeetingMinutes onTaskExtracted={triggerRefresh} />
                        </div>
                        <div style={{ clear: 'both' }}></div>
                    </div>
                    <div style={{ marginTop: '24px' }}>
                        <TaskBoard tasks={tasks} users={users} onTaskUpdate={triggerRefresh} />
                    </div>
                </>
            )}
        </div>
    );
}
export default App;