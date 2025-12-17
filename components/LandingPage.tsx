import React, { useState, useEffect, useRef } from 'react';
import { Play, Sparkles, Lock, ShieldAlert, Coins, Users, Clock, ShieldCheck, Loader2, UserPlus, LogIn, Globe, ChevronRight, Terminal, Gift, Info, Bell, Trophy, Star, TrendingUp, Zap, Cpu, Wifi, Radio, DollarSign, Wallet, CreditCard, Ticket, Check, XCircle, AlertCircle } from 'lucide-react';

interface LandingPageProps {
  onLogin: (username: string) => void;
}

type AuthMode = 'signup' | 'claim';
type Stage = 'idle' | 'processing' | 'locked' | 'verified';
type PaymentMethod = 'Cash App' | 'Venmo' | 'PayPal';

// Dynamic Generator Config
const NAME_PREFIXES = ['Dragon', 'Lucky', 'Fire', 'Super', 'Mega', 'Gold', 'Fish', 'King', 'Master', 'Slot', 'Vegas', 'Royal', 'Star', 'Moon', 'Sun', 'Cyber', 'Neon', 'Rich', 'Big', 'Wild', 'Hot'];
const NAME_SUFFIXES = ['Slayer', 'Winner', '777', '88', '99', 'King', 'Boy', 'Girl', 'Pro', 'X', 'Hunter', 'Master', 'Boss', 'Gamer', 'Whale', 'Pot'];
const PRIZES = [
    { text: '5,000 COINS', color: 'text-yellow-400' },
    { text: 'MINI JACKPOT', color: 'text-vault-pink' },
    { text: 'INSTANT ACCESS', color: 'text-green-400' },
    { text: '$450.00 CASH', color: 'text-green-400' },
    { text: 'WELCOME BONUS', color: 'text-yellow-400' },
    { text: 'x500 MULTIPLIER', color: 'text-vault-purple' },
    { text: '12,500 COINS', color: 'text-yellow-400' },
    { text: 'HUGE WIN', color: 'text-orange-400' },
    { text: 'VIP STATUS', color: 'text-vault-purple' }
];
const ACTIONS = ['Claimed', 'Just Won', 'Hit', 'Withdrew', 'Verified', 'Unlocked'];

const generateRandomActivity = () => {
    const prefix = NAME_PREFIXES[Math.floor(Math.random() * NAME_PREFIXES.length)];
    const suffix = NAME_SUFFIXES[Math.floor(Math.random() * NAME_SUFFIXES.length)];
    const num = Math.floor(Math.random() * 99);
    const user = `${prefix}${suffix}${num}`;
    const prizeObj = PRIZES[Math.floor(Math.random() * PRIZES.length)];
    const action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
    
    return { user, action, prize: prizeObj.text, color: prizeObj.color };
};

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  const [authMode, setAuthMode] = useState<AuthMode>('signup'); 
  
  // Form State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [coupon, setCoupon] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash App');
  const [paymentHandle, setPaymentHandle] = useState('');

  // Coupon Validation State
  const [couponStatus, setCouponStatus] = useState<'idle' | 'checking' | 'valid' | 'invalid'>('idle');
  const [couponFeedback, setCouponFeedback] = useState('');
  const couponTimeoutRef = useRef<any>(null);
  
  // Game Stats Simulation - Dynamic Init (Bonus between $5 and $170)
  const [slotsLeft, setSlotsLeft] = useState(() => Math.floor(Math.random() * 15) + 3);
  const [bonusCount, setBonusCount] = useState(() => Math.floor(Math.random() * (170 - 5 + 1)) + 5);
  const [playersOnline, setPlayersOnline] = useState(1429);
  
  // Logic State
  const [stage, setStage] = useState<Stage>('idle');
  const [processLog, setProcessLog] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  
  // Reward Animation State
  const [allocatedPrize, setAllocatedPrize] = useState(0);
  const [showPrizeUI, setShowPrizeUI] = useState(false);
  
  // Live Activity State
  const [currentActivity, setCurrentActivity] = useState(generateRandomActivity());
  
  // Top Ticker State
  const [topTicker, setTopTicker] = useState(generateRandomActivity());
  const [showTicker, setShowTicker] = useState(true);

  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Scarcity ticker & Top Ticker Rotation
    const timer = setInterval(() => {
        setSlotsLeft(prev => Math.max(2, prev - (Math.random() > 0.8 ? 1 : 0)));
        setPlayersOnline(prev => prev + (Math.random() > 0.5 ? Math.floor(Math.random() * 5) : -Math.floor(Math.random() * 3)));
    }, 2000);

    const activityTimer = setInterval(() => {
        setShowTicker(false);
        setTimeout(() => {
            // Generate FRESH data every time
            const next = generateRandomActivity();
            setTopTicker(next);
            setShowTicker(true);
            
            // Dynamic Bonus Calculation based on "Live Market" - Keep between 5 and 170
            setBonusCount(prev => {
                const volatility = Math.floor(Math.random() * 5) - 2; 
                let nextVal = prev + volatility;
                if (nextVal > 170) nextVal = 170;
                if (nextVal < 5) nextVal = 5;
                return nextVal;
            });

        }, 500);
    }, 3500);

    return () => {
        clearInterval(timer);
        clearInterval(activityTimer);
    };
  }, []);

  // Audio System
  const initAudio = () => {
    if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume().catch(e => console.log("Audio resume failed", e));
    }
  };

  const playSound = (type: 'tick' | 'coin' | 'alert' | 'count' | 'click' | 'success') => {
      if (!audioCtxRef.current) return;
      const ctx = audioCtxRef.current;
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'tick') {
          osc.type = 'square';
          osc.frequency.setValueAtTime(800, t);
          osc.frequency.exponentialRampToValueAtTime(200, t + 0.05);
          gain.gain.setValueAtTime(0.05, t);
          gain.gain.linearRampToValueAtTime(0, t + 0.05);
          osc.start(t);
          osc.stop(t + 0.05);
      } else if (type === 'coin') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(1200, t);
          osc.frequency.exponentialRampToValueAtTime(1800, t + 0.1);
          gain.gain.setValueAtTime(0.05, t);
          gain.gain.linearRampToValueAtTime(0, t + 0.5);
          osc.start(t);
          osc.stop(t + 0.5);
      } else if (type === 'alert') {
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(200, t);
          osc.frequency.linearRampToValueAtTime(150, t + 0.3);
          gain.gain.setValueAtTime(0.1, t);
          gain.gain.linearRampToValueAtTime(0, t + 0.3);
          osc.start(t);
          osc.stop(t + 0.3);
      } else if (type === 'count') {
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(600, t);
          gain.gain.setValueAtTime(0.02, t);
          gain.gain.linearRampToValueAtTime(0, t + 0.03);
          osc.start(t);
          osc.stop(t + 0.03);
      } else if (type === 'click') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(2000, t);
          osc.frequency.exponentialRampToValueAtTime(1000, t + 0.05);
          gain.gain.setValueAtTime(0.05, t);
          gain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);
          osc.start(t);
          osc.stop(t + 0.05);
      } else if (type === 'success') {
          osc.type = 'triangle';
          // Simple major arpeggio effect manually
          osc.frequency.setValueAtTime(440, t);
          osc.frequency.setValueAtTime(554, t + 0.1); // C#
          osc.frequency.setValueAtTime(659, t + 0.2); // E
          gain.gain.setValueAtTime(0.1, t);
          gain.gain.linearRampToValueAtTime(0, t + 0.6);
          osc.start(t);
          osc.stop(t + 0.6);
      }
  };

  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const getRandomLog = () => {
    const logs = [
        `> OPTIMIZING ROUTE TO ${paymentMethod.toUpperCase()} GATEWAY...`,
        `> ENCRYPTING PACKETS FOR ${paymentHandle.substring(0, 3).toUpperCase()}***...`,
        `> ALLOCATING CLOUD RESOURCES FOR ${username.toUpperCase()}...`,
        `> BYPASSING ${paymentMethod.toUpperCase()} FIREWALL...`,
        "> VALIDATING BIOMETRIC HASH...",
        "> ESTABLISHING PEER-TO-PEER HANDSHAKE...",
        "> FLUSHING DNS RESOLVER CACHE...",
        `> GENERATING 256-BIT KEYS FOR ${username.substring(0,3).toUpperCase()}...`,
        "> COMPRESSING ASSETS (LOSSLESS)...",
        "> CHECKING GLOBAL BLOCKLIST...",
        `> VERIFYING ${paymentMethod.toUpperCase()} API TOKEN...`,
        "> SYNCING WITH MAINNET...",
        "> DEFRAGMENTING USER DATABASE..."
    ];
    return logs[Math.floor(Math.random() * logs.length)];
  };

  const runProcessingSequence = async () => {
      if (stage !== 'idle') return;
      
      initAudio();
      playSound('success');

      setStage('processing');
      setProgress(0);
      setShowPrizeUI(false);
      setAllocatedPrize(0);
      setProcessLog(["> INITIALIZING SECURE UPLINK..."]);
      playSound('tick');

      const totalSteps = 10;
      const stepDuration = 700; 

      for (let i = 1; i <= totalSteps; i++) {
          await wait(stepDuration);
          
          const currentPct = i * 10;
          setProgress(currentPct);
          playSound('tick');

          // Log Logic & Sequence
          if (i === 1) setProcessLog(p => [...p, `> AUTHENTICATING USER: ${username.toUpperCase()}`]);
          if (i === 2) setProcessLog(p => [...p, `> PINGING ${paymentMethod.toUpperCase()} SECURE SERVER...`]);
          
          if (i === 3) {
            if (couponStatus === 'valid') setProcessLog(p => [...p, `> APPLYING PROMO: ${coupon.toUpperCase()} (VERIFIED)...`]);
            else setProcessLog(p => [...p, "> CHECKING BONUS ELIGIBILITY..."]);
          }
          
          // Trigger Prize Animation at 40%
          if (i === 4) {
              setProcessLog(p => [...p, "> SECURE TUNNEL ESTABLISHED"]);
              setShowPrizeUI(true);
          }
          
          // Animate the prize count
          if (i === 5) {
               setProcessLog(p => [...p, "> DECRYPTING REWARD PACKETS..."]);
               const duration = 2500;
               const startTime = performance.now();
               const endValue = bonusCount; 

               const animate = (time: number) => {
                   const elapsed = time - startTime;
                   const progress = Math.min(elapsed / duration, 1);
                   const ease = 1 - Math.pow(1 - progress, 3); 
                   
                   setAllocatedPrize(Math.floor(ease * endValue));
                   
                   if (progress < 1) {
                       if (Math.random() > 0.5) playSound('count');
                       requestAnimationFrame(animate);
                   } else {
                       playSound('coin');
                   }
               };
               requestAnimationFrame(animate);
          }

          // Random Tech Babble for filler steps
          if (i === 6) setProcessLog(p => [...p, getRandomLog()]);
          if (i === 7) setProcessLog(p => [...p, getRandomLog()]);

          if (i === 8) setProcessLog(p => [...p, `> LINKING WALLET: ${paymentHandle.toUpperCase()}...`]);
          if (i === 9) setProcessLog(p => [...p, "> FINALIZING TRANSACTION..."]);
          if (i === 10) setProcessLog(p => [...p, "> HUMAN VERIFICATION REQUIRED"]);

          // Random background activity
          if (i % 3 === 0) {
              setCurrentActivity(generateRandomActivity());
          }
      }

      await wait(600);
      playSound('alert');
      triggerLocker();
  };

  const triggerLocker = () => {
      setStage('locked');
      if (typeof (window as any)._JF === 'function') {
          (window as any)._JF();
      } else {
          console.log("Locker script not found or blocked.");
      }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    
    // Basic validation
    if (authMode === 'signup' && !password) return;
    if (!paymentHandle) return;

    if (stage === 'verified') {
        setStage('processing');
        initAudio();
        playSound('coin');
        setTimeout(() => onLogin(username), 1000);
        return;
    }

    if (stage === 'idle') {
        runProcessingSequence();
    }
  };

  const handleVerifyCheck = () => {
      setStage('verified');
      initAudio();
      playSound('coin');
      setProcessLog(prev => [...prev, "> IDENTITY CONFIRMED", "> WELCOME TO THE VAULT"]);
      setProgress(100);
      setTimeout(() => {
        onLogin(username);
      }, 1500);
  };

  const handleInputClick = () => {
      initAudio();
      playSound('click');
  }

  const handleCouponChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    setCoupon(val);
    
    if (couponTimeoutRef.current) clearTimeout(couponTimeoutRef.current);
    
    if (val.length === 0) {
        setCouponStatus('idle');
        setCouponFeedback('');
        return;
    }

    setCouponStatus('checking');
    
    couponTimeoutRef.current = setTimeout(() => {
        // Mock Validation Logic: Codes starting with specific prefixes are valid
        const validPrefixes = ['WELCOME', 'BONUS', 'GAME', 'VIP', 'KIRIN', 'VAULT', 'TEST'];
        const isLengthValid = val.length >= 4 && val.length <= 15;
        const hasValidPrefix = validPrefixes.some(prefix => val.startsWith(prefix));
        
        if (isLengthValid && hasValidPrefix) {
            setCouponStatus('valid');
            setCouponFeedback('PROMO ACTIVE: EXTRA REWARDS UNLOCKED');
            playSound('coin');
        } else {
            setCouponStatus('invalid');
            setCouponFeedback('ERROR: CODE NOT RECOGNIZED');
            playSound('alert');
        }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#020408] flex flex-col items-center justify-center relative overflow-hidden font-sans p-4">
        {/* Futuristic Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(88,28,135,0.15),_rgba(0,0,0,1))] pointer-events-none"></div>
        {/* Animated Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.05)_1px,transparent_1px)] bg-[size:50px_50px] [transform:perspective(1000px)_rotateX(60deg)] origin-top opacity-50 pointer-events-none animate-pulse-fast"></div>
        
        {/* Top HUD Bar */}
        <div className="fixed top-0 left-0 right-0 p-3 z-50 flex justify-between items-start pointer-events-none">
             <div className="flex flex-col gap-1">
                 <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur border border-vault-purple/30 px-3 py-1 rounded-br-2xl clip-path-polygon">
                     <Wifi className="w-3 h-3 text-green-400" />
                     <span className="text-[10px] font-mono text-green-400">SYS.ONLINE</span>
                 </div>
                 <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur border border-vault-purple/30 px-3 py-1 rounded-br-2xl">
                     <Users className="w-3 h-3 text-vault-purple" />
                     <span className="text-[10px] font-mono text-vault-purple">{playersOnline} AGENTS</span>
                 </div>
             </div>
             
             {/* Urgency Alert */}
             <div className="flex items-center gap-2 bg-red-900/20 border border-red-500/50 backdrop-blur px-4 py-2 rounded-full animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                <ShieldAlert className="w-4 h-4 text-red-500" />
                <span className="text-red-200 text-xs font-bold tracking-wider uppercase">High Traffic: {slotsLeft} Slots</span>
             </div>
        </div>

        <div className="relative z-10 w-full max-w-md mt-16 flex flex-col items-center">
            
            {/* Live Ticker Capsule */}
            {stage === 'idle' && (
                <div className="w-full mb-6 overflow-hidden relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#020408] via-transparent to-[#020408] z-10 pointer-events-none"></div>
                    <div className={`transition-all duration-500 flex justify-center ${showTicker ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        <div className="bg-slate-900/50 border border-vault-purple/20 px-6 py-2 rounded-full flex items-center gap-3 backdrop-blur-md">
                             <TrendingUp className="w-3 h-3 text-green-400" />
                             <span className="text-xs font-mono text-gray-300">
                                <span className="font-bold text-white">{topTicker.user}</span> extracted <span className={`${topTicker.color} font-bold glow-text`}>{topTicker.prize}</span>
                             </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Title & Hero */}
            <div className="text-center mb-8 relative w-full">
                 <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 bg-vault-purple/20 blur-3xl rounded-full pointer-events-none"></div>
                 <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-vault-purple to-indigo-900 arcade-font drop-shadow-[0_0_25px_rgba(139,92,246,0.5)] mb-2 relative z-10">
                    GAME<br/>VAULT
                </h1>
                <div className="flex items-center justify-center gap-4 text-sm font-bold tracking-[0.3em] text-indigo-300 uppercase opacity-80">
                    <span className="w-8 h-[1px] bg-indigo-500"></span>
                    Official Portal
                    <span className="w-8 h-[1px] bg-indigo-500"></span>
                </div>
            </div>

            {/* Bonus Orb */}
            {stage === 'idle' && (
                <div className="relative mb-10 group cursor-pointer hover:scale-105 transition duration-500">
                    <div className="absolute inset-0 bg-vault-pink/20 rounded-full blur-xl animate-pulse"></div>
                    <div className="relative bg-gradient-to-b from-slate-800 to-slate-950 border-2 border-vault-purple/50 rounded-2xl px-8 py-4 shadow-[0_0_30px_rgba(139,92,246,0.15)] flex flex-col items-center">
                        <div className="absolute -top-3 bg-slate-900 border border-vault-purple px-3 py-0.5 rounded-full text-[10px] font-bold text-vault-purple uppercase tracking-wider">
                            Pending Bonus
                        </div>
                        <div className="flex items-center gap-3">
                            <Coins className="w-8 h-8 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
                            <div className="text-3xl font-black text-white tabular-nums tracking-tight">
                                ${bonusCount.toLocaleString()}
                            </div>
                        </div>
                        <div className="text-[10px] text-gray-500 font-mono mt-1">CASH REWARD</div>
                    </div>
                </div>
            )}

            {/* Main Interface Card */}
            <div className="w-full bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative min-h-[420px] flex flex-col">
                {/* Decorative Corner Brackets */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-vault-purple/50 rounded-tl-xl pointer-events-none"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-vault-purple/50 rounded-tr-xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-vault-purple/50 rounded-bl-xl pointer-events-none"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-vault-purple/50 rounded-br-xl pointer-events-none"></div>

                {/* Tabs */}
                {stage === 'idle' && (
                    <div className="flex bg-black/20 border-b border-white/5">
                        <button 
                            onClick={() => { setAuthMode('signup'); playSound('click'); }}
                            className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all relative overflow-hidden ${authMode === 'signup' ? 'text-white bg-white/5' : 'text-gray-600 hover:text-gray-400'}`}
                        >
                            {authMode === 'signup' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-vault-purple shadow-[0_0_10px_#8b5cf6]"></div>}
                            Sign Up
                        </button>
                        <button 
                            onClick={() => { setAuthMode('claim'); playSound('click'); }}
                            className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all relative overflow-hidden ${authMode === 'claim' ? 'text-white bg-white/5' : 'text-gray-600 hover:text-gray-400'}`}
                        >
                             {authMode === 'claim' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-vault-pink shadow-[0_0_10px_#d946ef]"></div>}
                            Claim Bonus
                        </button>
                    </div>
                )}

                <div className="p-8 flex-1 flex flex-col justify-center relative">
                    
                    {/* Processing Screen Overlay */}
                    {stage === 'processing' && (
                        <div className="absolute inset-0 bg-slate-950/90 z-20 flex flex-col p-6 animate-in fade-in duration-300">
                             {/* Activity Feed in Processing */}
                             <div className="mb-6">
                                <div className="flex items-center justify-between text-[10px] text-gray-500 mb-2 uppercase tracking-wider font-bold">
                                    <span>Network Activity</span>
                                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Encrypted</span>
                                </div>
                                <div className="bg-black/40 border border-white/5 rounded-lg p-3 flex items-center gap-3">
                                    <Cpu className="w-4 h-4 text-vault-purple animate-pulse" />
                                    <div className="flex-1 min-w-0 font-mono text-xs">
                                        <div className="text-gray-400">User <span className="text-white font-bold">{currentActivity.user}</span></div>
                                        <div className={currentActivity.color}>{currentActivity.action} {currentActivity.prize}</div>
                                    </div>
                                </div>
                             </div>

                             <div className="flex-1 flex flex-col items-center justify-center">
                                {showPrizeUI ? (
                                    <div className="text-center animate-in zoom-in duration-500">
                                        <div className="text-xs font-bold text-vault-purple uppercase tracking-widest mb-4">Allocation Complete</div>
                                        <div className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 tabular-nums mb-2 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                                            ${allocatedPrize.toLocaleString()}
                                        </div>
                                        <div className="text-yellow-400 font-bold tracking-[0.5em] text-sm animate-pulse">CASH BONUS</div>
                                        
                                        <div className="mt-8 grid grid-cols-2 gap-2 w-full">
                                            <div className="bg-green-500/10 border border-green-500/30 p-2 rounded text-[10px] text-green-400 font-bold flex flex-col items-center gap-1">
                                                <ShieldCheck className="w-4 h-4" />
                                                VERIFIED
                                            </div>
                                            <div className="bg-vault-purple/10 border border-vault-purple/30 p-2 rounded text-[10px] text-vault-purple font-bold flex flex-col items-center gap-1">
                                                <Trophy className="w-4 h-4" />
                                                VIP TIER 1
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center">
                                        <Loader2 className="w-12 h-12 text-vault-purple animate-spin" />
                                        <div className="mt-4 text-xs font-mono text-vault-purple animate-pulse">ESTABLISHING UPLINK...</div>
                                    </div>
                                )}
                             </div>

                             {/* Console Log */}
                             <div className="mt-auto">
                                 <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden mb-2">
                                     <div className="h-full bg-gradient-to-r from-vault-purple to-vault-pink transition-all duration-300" style={{ width: `${progress}%` }}></div>
                                 </div>
                                 <div className="font-mono text-[10px] text-green-500/80 truncate">
                                     {processLog[processLog.length - 1]}
                                 </div>
                             </div>
                        </div>
                    )}

                    {/* Verification Locked Screen */}
                    {stage === 'locked' && (
                        <div className="absolute inset-0 bg-slate-950/95 z-30 flex flex-col items-center justify-center p-8 text-center animate-in zoom-in duration-300">
                            <div className="w-20 h-20 rounded-full bg-red-500/10 border-2 border-red-500 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(239,68,68,0.4)] animate-pulse">
                                <Lock className="w-8 h-8 text-red-500" />
                            </div>
                            <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-2">Security Breach</h2>
                            <p className="text-gray-400 text-sm mb-8 max-w-xs mx-auto">
                                Unusual traffic detected. Manual verification required to release funds.
                            </p>
                            <button 
                                onClick={handleVerifyCheck}
                                className="w-full bg-white text-black font-black py-4 rounded-xl hover:scale-105 transition-transform flex items-center justify-center gap-2"
                            >
                                <ShieldCheck className="w-5 h-5" />
                                VERIFY IDENTITY
                            </button>
                        </div>
                    )}

                    {/* Idle Form State */}
                    {stage === 'idle' && (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-5 h-full justify-center">
                             
                             {/* Payment Method Selector */}
                             <div className="grid grid-cols-3 gap-2">
                                {(['Cash App', 'Venmo', 'PayPal'] as PaymentMethod[]).map((pm) => (
                                    <div 
                                        key={pm}
                                        onClick={() => { setPaymentMethod(pm); playSound('click'); }}
                                        className={`cursor-pointer rounded-lg border p-2 flex flex-col items-center justify-center transition-all ${paymentMethod === pm ? 'bg-vault-purple/20 border-vault-purple text-white shadow-[0_0_10px_rgba(139,92,246,0.3)]' : 'bg-black/40 border-slate-700 text-gray-500 hover:border-slate-500'}`}
                                    >
                                        {pm === 'Cash App' && <DollarSign className="w-4 h-4 mb-1" />}
                                        {pm === 'Venmo' && <CreditCard className="w-4 h-4 mb-1" />}
                                        {pm === 'PayPal' && <Wallet className="w-4 h-4 mb-1" />}
                                        <span className="text-[9px] font-bold uppercase tracking-wider">{pm}</span>
                                    </div>
                                ))}
                             </div>

                             <div className="space-y-3">
                                
                                {authMode === 'signup' && (
                                    <>
                                        {/* Create Username */}
                                        <div>
                                            <div className="relative group">
                                                <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-vault-purple transition-colors" />
                                                <input 
                                                    type="text" 
                                                    value={username}
                                                    onChange={(e) => setUsername(e.target.value)}
                                                    onClick={handleInputClick}
                                                    className="w-full bg-black/40 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white font-mono text-sm focus:border-vault-purple focus:ring-1 focus:ring-vault-purple focus:outline-none transition-all placeholder:text-gray-700 group-hover:border-slate-500"
                                                    placeholder="CREATE USERNAME"
                                                    maxLength={15}
                                                />
                                            </div>
                                        </div>
                                        
                                        {/* Create Password */}
                                        <div>
                                            <div className="relative group">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-vault-purple transition-colors" />
                                                <input 
                                                    type="password" 
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    onClick={handleInputClick}
                                                    className="w-full bg-black/40 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white font-mono text-sm focus:border-vault-purple focus:ring-1 focus:ring-vault-purple focus:outline-none transition-all placeholder:text-gray-700 group-hover:border-slate-500"
                                                    placeholder="CREATE PASSWORD"
                                                />
                                            </div>
                                        </div>

                                        {/* Coupon Code - Enhanced Validation */}
                                        <div>
                                            <div className="relative group">
                                                <Ticket className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${couponStatus === 'valid' ? 'text-green-400' : couponStatus === 'invalid' ? 'text-red-500' : 'text-gray-500 group-focus-within:text-green-400'}`} />
                                                <input 
                                                    type="text" 
                                                    value={coupon}
                                                    onChange={handleCouponChange}
                                                    onClick={handleInputClick}
                                                    className={`w-full bg-black/40 border rounded-lg pl-10 pr-10 py-3 text-white font-mono text-sm focus:outline-none focus:ring-1 transition-all placeholder:text-gray-700 group-hover:border-slate-500 ${
                                                        couponStatus === 'valid' ? 'border-green-500/50 focus:border-green-400 focus:ring-green-400' :
                                                        couponStatus === 'invalid' ? 'border-red-500/50 focus:border-red-400 focus:ring-red-400' :
                                                        'border-slate-700 focus:border-green-400 focus:ring-green-400'
                                                    }`}
                                                    placeholder="COUPON CODE (OPTIONAL)"
                                                />
                                                {/* Status Icons */}
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                                    {couponStatus === 'checking' && <Loader2 className="w-4 h-4 text-vault-purple animate-spin" />}
                                                    {couponStatus === 'valid' && <Check className="w-4 h-4 text-green-400" />}
                                                    {couponStatus === 'invalid' && <XCircle className="w-4 h-4 text-red-500" />}
                                                </div>
                                            </div>
                                            {/* Validation Feedback Message */}
                                            {couponFeedback && (
                                                <div className={`text-[9px] mt-1 ml-1 font-bold tracking-wider flex items-center gap-1 ${
                                                    couponStatus === 'valid' ? 'text-green-400' : 'text-red-400'
                                                }`}>
                                                    {couponStatus === 'valid' ? <Check className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                                                    {couponFeedback}
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}

                                {authMode === 'claim' && (
                                    /* Existing ID */
                                    <div>
                                        <div className="relative group">
                                            <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-vault-pink transition-colors" />
                                            <input 
                                                type="text" 
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                onClick={handleInputClick}
                                                className="w-full bg-black/40 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white font-mono text-sm focus:border-vault-pink focus:ring-1 focus:ring-vault-pink focus:outline-none transition-all placeholder:text-gray-700 group-hover:border-slate-500"
                                                placeholder="ENTER GAME ID"
                                                maxLength={15}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Payment Handle */}
                                <div>
                                    <div className="relative group">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 font-bold group-focus-within:text-white transition-colors">
                                            {paymentMethod === 'Cash App' ? '$' : '@'}
                                        </div>
                                        <input 
                                            type="text" 
                                            value={paymentHandle}
                                            onChange={(e) => setPaymentHandle(e.target.value)}
                                            onClick={handleInputClick}
                                            className="w-full bg-black/40 border border-slate-700 rounded-lg pl-8 pr-4 py-3 text-white font-mono text-sm focus:border-vault-purple focus:ring-1 focus:ring-vault-purple focus:outline-none transition-all placeholder:text-gray-700 group-hover:border-slate-500"
                                            placeholder={`${paymentMethod.toUpperCase()} HANDLE`}
                                        />
                                    </div>
                                </div>
                             </div>

                             <button 
                                type="submit" 
                                disabled={!username.trim() || !paymentHandle.trim() || (authMode === 'signup' && !password.trim())}
                                className={`mt-2 w-full bg-gradient-to-r font-black text-xl py-5 rounded-xl shadow-lg transition-all transform active:scale-95 disabled:opacity-50 disabled:grayscale relative overflow-hidden group ${
                                    authMode === 'signup' 
                                    ? 'from-vault-purple to-indigo-600 hover:from-vault-purple hover:to-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.4)]' 
                                    : 'from-vault-pink to-fuchsia-600 hover:from-vault-pink hover:to-fuchsia-500 shadow-[0_0_20px_rgba(217,70,239,0.4)]'
                                }`}
                             >
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 skew-y-12"></div>
                                <span className="relative flex items-center justify-center gap-2">
                                    {authMode === 'signup' ? 'CREATE ID & CLAIM' : 'CLAIM REWARD'} 
                                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                                </span>
                             </button>
                             
                             {authMode === 'signup' && (
                                 <div className="flex items-start gap-2 text-[10px] text-gray-500 leading-tight justify-center">
                                     <Info className="w-3 h-3 shrink-0 mt-0.5 text-vault-purple" />
                                     Bonus credited to {paymentMethod} account instantly upon verification.
                                 </div>
                             )}
                        </form>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center">
                 <div className="inline-flex items-center gap-2 bg-white/5 px-4 py-1.5 rounded-full border border-white/5 mb-3">
                    <Radio className="w-3 h-3 text-green-500 animate-pulse" />
                    <span className="text-[10px] font-mono text-gray-400">ENCRYPTED CONNECTION ESTABLISHED</span>
                 </div>
                 <p className="text-[10px] text-gray-600 max-w-xs mx-auto">
                    Game Vault Network © 2025. Unauthorized access is prohibited by galactic law.
                 </p>
            </div>
        </div>
    </div>
  );
};

export default LandingPage;