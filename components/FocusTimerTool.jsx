"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Volume2, VolumeX, Coffee, Brain, Timer } from "lucide-react";
import { toast } from "sonner";

const MODES = {
  focus: { id: "focus", label: "Focus", minutes: 25, icon: Brain },
  shortBreak: { id: "shortBreak", label: "Short Break", minutes: 5, icon: Coffee },
  longBreak: { id: "longBreak", label: "Long Break", minutes: 15, icon: Timer },
};

export default function FocusTimerTool() {
  const [mode, setMode] = useState(MODES.focus.id);
  const [timeLeft, setTimeLeft] = useState(MODES.focus.minutes * 60);
  const [isActive, setIsActive] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  
  const timerRef = useRef(null);
  const audioRef = useRef(null);

  // Initialize audio lazily to avoid SSR issues
  useEffect(() => {
    // A soft, minimalist chime sound
    audioRef.current = new Audio("https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg");
    audioRef.current.volume = 0.5;

    // Load sessions from local storage
    const saved = localStorage.getItem("entry_focus_sessions");
    if (saved) {
        const data = JSON.parse(saved);
        // Only load if it's from today
        const todayStr = new Date().toDateString();
        if (data.date === todayStr) {
            setSessionsCompleted(data.count);
        }
    }
  }, []);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      handleComplete();
    }

    return () => clearInterval(timerRef.current);
  }, [isActive, timeLeft]);

  const handleComplete = () => {
    setIsActive(false);
    clearInterval(timerRef.current);
    
    if (soundEnabled && audioRef.current) {
        audioRef.current.play().catch(e => console.log("Audio play failed:", e));
    }

    if (mode === "focus") {
        toast.success("Focus session complete! Time for a break.");
        const newCount = sessionsCompleted + 1;
        setSessionsCompleted(newCount);
        localStorage.setItem("entry_focus_sessions", JSON.stringify({
            date: new Date().toDateString(),
            count: newCount
        }));
        switchMode("shortBreak");
    } else {
        toast.success("Break is over. Ready to focus?");
        switchMode("focus");
    }
  };

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(MODES[mode].minutes * 60);
  };

  const switchMode = (newMode) => {
    setIsActive(false);
    setMode(newMode);
    setTimeLeft(MODES[newMode].minutes * 60);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Calculate progress for the circle
  const totalSeconds = MODES[mode].minutes * 60;
  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;
  
  const circumference = 2 * Math.PI * 140; // r=140
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center max-w-xl mx-auto space-y-12 py-8">
        
      {/* Mode Selector */}
      <div className="flex p-1.5 bg-[var(--input)] border border-[var(--border)] rounded-full w-full sm:w-auto">
          {Object.values(MODES).map((m) => {
              const Icon = m.icon;
              return (
                  <button
                      key={m.id}
                      onClick={() => switchMode(m.id)}
                      className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                          mode === m.id
                              ? "bg-[var(--background)] text-[var(--accent)] shadow-sm border border-[var(--border)]"
                              : "text-[var(--muted)] hover:text-[var(--foreground)]"
                      }`}
                  >
                      <Icon size={14} className={mode === m.id ? "text-[var(--accent)]" : "text-[var(--muted)]"} />
                      <span className="hidden sm:inline">{m.label}</span>
                  </button>
              );
          })}
      </div>

      {/* Circular Timer Display */}
      <div className="relative w-80 h-80 flex items-center justify-center">
          {/* Background Circle */}
          <svg className="absolute inset-0 w-full h-full transform -rotate-90">
              <circle
                  cx="160"
                  cy="160"
                  r="140"
                  fill="none"
                  stroke="var(--card)"
                  strokeWidth="8"
              />
              {/* Progress Circle */}
              <circle
                  cx="160"
                  cy="160"
                  r="140"
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  style={{
                      strokeDasharray: circumference,
                      strokeDashoffset: strokeDashoffset,
                      transition: "stroke-dashoffset 1s linear"
                  }}
              />
          </svg>
          
          <div className="relative text-center">
              <h2 className="text-7xl font-bold tracking-tighter text-[var(--foreground)] font-saira mb-2">
                  {formatTime(timeLeft)}
              </h2>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[var(--accent)]">
                  {MODES[mode].label}
              </p>
          </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6">
          <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="w-12 h-12 rounded-full flex items-center justify-center border border-[var(--border)] text-[var(--muted)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors"
              title={soundEnabled ? "Mute sound" : "Enable sound"}
          >
              {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
          
          <button
              onClick={toggleTimer}
              className="w-20 h-20 rounded-full flex items-center justify-center bg-[var(--foreground)] text-[var(--background)] hover:scale-105 active:scale-95 transition-all shadow-xl"
          >
              {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-2" />}
          </button>

          <button
              onClick={resetTimer}
              className="w-12 h-12 rounded-full flex items-center justify-center border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
              title="Reset timer"
          >
              <RotateCcw size={18} />
          </button>
      </div>

      {/* Session Stats */}
      <div className="pt-8 border-t border-[var(--border)] w-full text-center">
          <p className="text-xs uppercase tracking-[0.3em] font-bold text-[var(--muted)] mb-2">Today's Progress</p>
          <div className="flex items-center justify-center gap-2">
              <Brain size={16} className="text-[var(--accent)]" />
              <span className="text-xl font-bold">{sessionsCompleted}</span>
              <span className="text-[var(--muted)] italic">Focus sessions completed</span>
          </div>
      </div>
    </div>
  );
}
