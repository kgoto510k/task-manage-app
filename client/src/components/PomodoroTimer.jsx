import React, { useState, useEffect, useRef } from 'react';
import { Fullscreen } from 'lucide-react';

function PomodoroTimer() {
    const [minutes, setMinutes] = useState(25);
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [isBreak, setIsBreak] = useState(false);
    const timerRef = useRef(null); // Fullscreen用

    // 通知音の設定
    const playSound = () => {
        const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
        audio.play().catch(e => console.log("音声を再生できませんでした:", e));
    };

    useEffect(() => {
        let interval = null;
        if (isActive) {
            interval = setInterval(() => {
                if (seconds === 0) {
                    if (minutes === 0) {
                        // タイマー終了時の処理
                        playSound(); // 音を鳴らす

                        const nextBreak = !isBreak;
                        setIsBreak(nextBreak);
                        setMinutes(nextBreak ? 5 : 25); // 休憩なら5分、作業なら25分
                        setSeconds(0);
                        setIsActive(true); // タイマーを止めずに継続

                        alert(nextBreak ? "お疲れ様です！5分休憩に入ります。" : "休憩終了！作業を再開しましょう。");
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

    // フルスクリーン切り替え関数
    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            timerRef.current.requestFullscreen().catch(err => {
                alert(`フルスクリーンにできませんでした: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    };

    return (
        <div
            ref={timerRef}
            style={{
                background: '#fff',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                textAlign: 'center',
                // フルスクリーン時に画面全体に広がるように調整
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
            }}
        >
            <div style={{ display: 'flex' }}>
                <h3 style={{ margin: '0 0 10px 0', color: isBreak ? '#10b981' : '#ef4444' }}>
                    {isBreak ? "☕ 休憩モード" : "ポモドーロタイマー"}
                </h3>
                <button
                    onClick={toggleFullscreen}
                    style={{ padding: '10px 20px', background: '#fff', color: '#2b2b2b', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    <Fullscreen />
                </button>
            </div>
            <div style={{ fontSize: '72px', fontWeight: 'bold', margin: '20px 0', color: '#1e293b' }}>
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
                <button
                    onClick={() => setIsActive(!isActive)}
                    style={{ padding: '10px 20px', background: isActive ? '#64748b' : '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    {isActive ? "一時停止" : "スタート"}
                </button>
                <button
                    onClick={() => { setIsActive(false); setMinutes(isBreak ? 5 : 25); setSeconds(0); }}
                    style={{ padding: '10px 20px', background: '#e2e8f0', color: '#334155', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    リセット
                </button>
            </div>
        </div >
    );
}

export default PomodoroTimer;