import React, { useState, useEffect } from 'react';
function PomodoroTimer() {
 const [minutes, setMinutes] = useState(25);
 const [seconds, setSeconds] = useState(0);
 const [isActive, setIsActive] = useState(false);
 const [isBreak, setIsBreak] = useState(false);
 useEffect(() => {
 let interval = null;
 if (isActive) {
 interval = setInterval(() => {
 if (seconds === 0) {
 if (minutes === 0) {
 // タイマー終了
 setIsBreak(!isBreak);
 setMinutes(isBreak ? 25 : 5);
 setSeconds(0);
 setIsActive(false);
 alert(isBreak ? "作業時間を開始しましょう！" : "お疲れ様です！休憩してください。");
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
 return (
 <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textAlign: 'center' }}>
 <h3 style={{ margin: '0 0 10px 0', color: isBreak ? '#10b981' : '#ef4444' }}>
 {isBreak ? " 休憩モード" : " ポモドーロタイマー"}
 </h3>
 <div style={{ fontSize: '48px', fontWeight: 'bold', margin: '15px 0', color: '#1e293b' }}
>
 {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
 </div>
 <div>
 <button
 onClick={() => setIsActive(!isActive)}
 style={{ padding: '8px 16px', marginRight: '8px', background: isActive ? '#64748b' :
'#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
 >
 {isActive ? "一時停止" : "スタート"}
 </button>
 <button
 onClick={() => { setIsActive(false); setMinutes(isBreak ? 5 : 25); setSeconds(0); }}
 style={{ padding: '8px 16px', background: '#e2e8f0', color: '#334155', border:
'none', borderRadius: '4px', cursor: 'pointer' }}
 >
 リセット
 </button>
 </div>
 </div>
 );
}
export default PomodoroTimer;