import React, { useState, useEffect, useRef } from 'react';

function PomodoroTimer() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false); // ダークモード状態
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
            alert(nextBreak ? "休憩に入ります！" : "作業再開！");
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
  }, [isActive, minutes, seconds, isBreak]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      timerRef.current.requestFullscreen().catch(err => alert(`失敗: ${err.message}`));
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div
      ref={timerRef}
      className="timer-container"
      style={{
        background: isDarkMode ? '#1f2937' : '#fff',
        color: isDarkMode ? '#f9fafb' : '#1e293b',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        textAlign: 'center',
        position: 'relative', // ボタン配置のために必要
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        transition: 'background 0.3s'
      }}
    >
      {/* 画面右上のツールボタンエリア */}
      <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '5px' }}>
        <button onClick={() => setIsDarkMode(!isDarkMode)} style={{ cursor: 'pointer', background: 'transparent', border: '1px solid #94a3b8', borderRadius: '4px', padding: '4px 8px', color: isDarkMode ? '#fff' : '#000' }}>
          {isDarkMode ? '☀️' : '🌙'}
        </button>
        <button onClick={toggleFullscreen} style={{ cursor: 'pointer', background: 'transparent', border: '1px solid #94a3b8', borderRadius: '4px', padding: '4px 8px', color: isDarkMode ? '#fff' : '#000' }}>
          ⛶
        </button>
      </div>

      <h3 style={{ margin: '0 0 10px 0', color: isBreak ? '#10b981' : '#ef4444' }}>
        {isBreak ? "☕ 休憩モード" : "🍅 ポモドーロタイマー"}
      </h3>
      
      {/* タイマー表示（全画面時に大きくなるようCSSクラスを設定） */}
      <div className="timer-text" style={{ fontSize: '72px', fontWeight: 'bold', margin: '20px 0' }}>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={() => setIsActive(!isActive)} style={{ padding: '10px 20px', background: isActive ? '#64748b' : '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          {isActive ? "一時停止" : "スタート"}
        </button>
        <button onClick={() => { setIsActive(false); setMinutes(isBreak ? 5 : 25); setSeconds(0); }} style={{ padding: '10px 20px', background: isDarkMode ? '#374151' : '#e2e8f0', color: isDarkMode ? '#fff' : '#334155', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          リセット
        </button>
      </div>

      {/* フルスクリーン時のスタイル制御用スタイルタグ */}
      <style>{`
        .timer-container:fullscreen {
          background-color: ${isDarkMode ? '#000' : '#fff'} !important;
        }
        .timer-text:fullscreen {
          font-size: 20vw !important; /* 全画面時は画面幅の20%の大きさにする */
        }
      `}</style>
    </div>
  );
}

export default PomodoroTimer;
