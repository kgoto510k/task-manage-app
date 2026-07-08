import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

function PomodoroTimer({ activeTaskName, setActiveTaskName }) {
  const { isDarkMode, colors } = useTheme();
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const timerRef = useRef(null);

  const playSound = () => {
    const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
    audio.play().catch(e => console.log("音声再生失敗:", e));
  };

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            playSound();
            const nextBreak = !isBreak;
            setIsBreak(nextBreak);
            setMinutes(nextBreak ? 5 : 25);
            setSeconds(0);
            setIsActive(true);
            
            const taskContext = activeTaskName ? `「${activeTaskName}」の` : "";
            toast.success(nextBreak ? `${taskContext}作業お疲れ様！5分休憩に入ります。` : "休憩終了！作業再開！", {
              icon: nextBreak ? '☕' : '🍅',
              duration: 6000,
            });
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, minutes, seconds, isBreak, activeTaskName]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      timerRef.current.requestFullscreen().catch(err => toast.error(`失敗: ${err.message}`));
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div
      ref={timerRef}
      className="timer-container"
      style={{
        background: colors.cardBg, color: colors.text, padding: '24px', borderRadius: '8px',
        border: `1px solid ${colors.border}`, textAlign: 'center', position: 'relative',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
      }}
    >
      <div style={{ position: 'absolute', top: '15px', right: '15px' }}>
        <button onClick={toggleFullscreen} style={{ background: 'transparent', border: `1px solid ${colors.border}`, borderRadius: '4px', padding: '6px 10px', color: colors.text }}>
          ⛶ 全画面
        </button>
      </div>

      <h3 style={{ margin: '0 0 5px 0', color: isBreak ? '#10b981' : '#ef4444' }}>
        {isBreak ? "☕ 休憩モード" : "🍅 ポモドーロタイマー"}
      </h3>

      <div style={{ 
        margin: '10px 0 5px 0', 
        padding: '6px 12px', 
        borderRadius: '20px', 
        fontSize: '14px', 
        background: activeTaskName ? (isDarkMode ? '#1e3a8a' : '#eff6ff') : 'transparent',
        color: activeTaskName ? (isDarkMode ? '#93c5fd' : '#1e40af') : colors.text,
        border: activeTaskName ? '1px solid currentColor' : 'none',
        maxWidth: '80%',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }}>
        {activeTaskName ? `🎯 実行中: ${activeTaskName}` : "💡 タスクボードから取り組むタスクを選ぼう"}
        {activeTaskName && (
          <span 
            onClick={() => setActiveTaskName(null)} 
            style={{ marginLeft: '8px', cursor: 'pointer', fontWeight: 'bold', opacity: 0.6 }}
            title="選択を解除"
          >
            ✕
          </span>
        )}
      </div>
      
      <div className="timer-text" style={{ fontSize: '72px', fontWeight: 'bold', margin: '15px 0 20px 0' }}>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={() => setIsActive(!isActive)} style={{ padding: '12px 24px', background: isActive ? '#64748b' : '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold' }}>
          {isActive ? "一時停止" : "スタート"}
        </button>
        <button onClick={() => { setIsActive(false); setMinutes(isBreak ? 5 : 25); setSeconds(0); }} style={{ padding: '12px 24px', background: isDarkMode ? '#374151' : '#e2e8f0', color: colors.text, border: 'none', borderRadius: '6px', fontWeight: 'bold' }}>
          リセット
        </button>
      </div>

      <style>{`
        .timer-container:fullscreen { background-color: ${isDarkMode ? '#000' : '#fff'} !important; border: none !important; }
        .timer-text:fullscreen { font-size: 25vw !important; }
      `}</style>
    </div>
  );
}
export default PomodoroTimer;