import React, { useState, useEffect } from 'react';
import { useTheme } from './context/ThemeContext';
import PomodoroTimer from './components/PomodoroTimer';
import MeetingMinutes from './components/MeetingMinutes';
import TaskBoard from './components/TaskBoard';
import AdminPanel from './components/AdminPanel';
import { Toaster } from 'react-hot-toast';

function App() {
  const { colors, isDarkMode, toggleDarkMode } = useTheme();
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [activeTaskName, setActiveTaskName] = useState(null);

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

  useEffect(() => { fetchData(); }, [refreshTrigger]);
  const triggerRefresh = () => setRefreshTrigger(prev => prev + 1);

  return (
    <div style={{ background: colors.bg, color: colors.text, minHeight: '100vh', transition: 'all 0.3s ease' }}>
      <Toaster 
        position="bottom-right" 
        toastOptions={{
          style: { background: colors.cardBg, color: colors.text, border: `1px solid ${colors.border}`, padding: '16px' }
        }} 
      />
      
      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        <header style={{ borderBottom: `2px solid ${colors.border}`, paddingBottom: '16px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '28px' }}>Team Task Management Hub</h1>
            <p style={{ margin: '4px 0 0 0', opacity: 0.7 }}>議事録抽出・共有タスク管理・ポモドーロタイマー</p>
          </div>
          
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button 
              onClick={toggleDarkMode}
              style={{ padding: '10px 16px', background: isDarkMode ? '#fbbf24' : '#1e293b', color: isDarkMode ? '#000' : '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
            <button 
              onClick={() => setIsAdminMode(!isAdminMode)}
              style={{ padding: '10px 20px', backgroundColor: isAdminMode ? '#475569' : '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              {isAdminMode ? "🏠 通常画面に戻る" : "⚙️ 管理者画面"}
            </button>
          </div>
        </header>

        {isAdminMode ? (
          <AdminPanel users={users} onUpdate={triggerRefresh} />
        ) : (
          <>
            <div className="top-widgets">
              <div className="widget-timer">
                <PomodoroTimer activeTaskName={activeTaskName} setActiveTaskName={setActiveTaskName} />
              </div>
              <div className="widget-minutes">
                <MeetingMinutes onTaskExtracted={triggerRefresh} />
              </div>
            </div>
            <div style={{ marginTop: '24px' }}>
              <TaskBoard tasks={tasks} users={users} onTaskUpdate={triggerRefresh} activeTaskName={activeTaskName} setActiveTaskName={setActiveTaskName} />
            </div>
          </>
        )}
      </div>

      <style>{`
        .top-widgets { display: flex; gap: 24px; margin-bottom: 24px; flex-wrap: wrap; }
        .widget-timer { flex: 1 1 300px; }
        .widget-minutes { flex: 2 1 500px; }
        button { transition: all 0.2s ease; }
        button:hover { filter: brightness(1.1); transform: translateY(-2px); box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        button:active { transform: translateY(0); box-shadow: none; }
        input, textarea, select { transition: all 0.2s ease; outline: none; }
        input:focus, textarea:focus, select:focus { border-color: #3b82f6 !important; box-shadow: 0 0 0 3px rgba(59,130,246,0.2); }
        tr { transition: background-color 0.2s ease; }
        tr:hover { filter: brightness(0.95); }
      `}</style>
    </div>
  );
}
export default App;