import React, { useState, useEffect } from 'react';
import { Lock, Play, ShieldAlert, X } from 'lucide-react';

const UnlockModal = ({ isOpen, onClose, onUnlock, algoName }) => {
  const [isWatching, setIsWatching] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);

  useEffect(() => {
    let timer;
    if (isWatching && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            // Trì hoãn việc hoàn thành sang tick tiếp theo để tránh lỗi render hàng loạt
            setTimeout(() => {
              setIsWatching(false);
              onUnlock(algoName);
            }, 0);
            return 0;
          }
          return t - 1;
        });
        setProgress(p => Math.min(p + 20, 100));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isWatching, timeLeft, onUnlock, algoName]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 border-4 border-black dark:border-gray-700 w-full max-w-md overflow-hidden relative shadow-[8px_8px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_rgba(255,255,255,0.1)]">
        
        {/* Tiêu đề */}
        <div className="bg-indigo-600 p-4 border-b-4 border-black dark:border-gray-700 flex items-center justify-between text-white">
          <h3 className="font-black uppercase tracking-tighter text-xl flex items-center gap-2">
            <Lock size={20} />
            Khu vực Premium
          </h3>
          <button onClick={onClose} className="hover:rotate-90 transition-transform">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {!isWatching ? (
            <div className="text-center space-y-6">
              <div className="inline-flex p-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-full text-indigo-600 mb-2">
                <ShieldAlert size={48} />
              </div>
              <div>
                <h4 className="text-2xl font-black mb-2 dark:text-white uppercase">Mở khóa {algoName}</h4>
                <p className="text-slate-600 dark:text-gray-400 font-medium leading-relaxed">
                   Đây là thuật toán đặc biệt. Bạn có thể nâng cấp tài khoản hoặc xem một quảng cáo ngắn để truy cập.
                </p>
              </div>

              <div className="grid gap-3">
                <button 
                  onClick={() => setIsWatching(true)}
                  className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-black py-4 border-b-4 border-emerald-800 active:border-b-0 active:translate-y-1 transition-all uppercase tracking-wide"
                >
                  <Play size={20} fill="currentColor" />
                  Xem Ads mở khóa (5s)
                </button>
                <button 
                  onClick={() => onUnlock(algoName)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 border-b-4 border-indigo-900 active:border-b-0 active:translate-y-1 transition-all uppercase tracking-wide shadow-lg"
                >
                  Nâng cấp VIP (99k)
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-6 py-8">
              <div className="relative inline-flex items-center justify-center">
                <div className="w-24 h-24 rounded-full border-8 border-slate-200 dark:border-gray-800"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                   <span className="text-3xl font-black dark:text-white">{timeLeft}</span>
                </div>
                <svg className="absolute inset-0 w-24 h-24 -rotate-90">
                  <circle
                    cx="48" cy="48" r="40"
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-indigo-600"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 - (251.2 * progress) / 100}
                  />
                </svg>
              </div>
              <div>
                <p className="text-xl font-black uppercase tracking-widest dark:text-white animate-pulse">
                   Đang tải quảng cáo...
                </p>
                <p className="text-slate-500 text-sm mt-2">Cảm ơn bạn đã ủng hộ AlgoVision!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnlockModal;
