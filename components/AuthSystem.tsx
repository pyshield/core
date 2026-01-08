
import React, { useState } from 'react';
import { ShieldCheck, Fingerprint, Mail, Key, Phone, UserPlus, ArrowRight, Loader2, Sparkles, Shield, User, Globe, Info, Crown, Zap, ShoppingCart, Landmark } from 'lucide-react';
import { RoleCode, Member, MemberStatus } from '../types.ts';

interface AuthSystemProps {
  onAuth: (user: Member) => void;
  existingMembers: Member[];
}

const AuthSystem: React.FC<AuthSystemProps> = ({ onAuth, existingMembers }) => {
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // Simulated
  const [role, setRole] = useState<RoleCode>(RoleCode.CUSTOMER);

  const handleLogin = (e?: React.FormEvent, bypassEmail?: string) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setError(null);

    const targetEmail = bypassEmail || email;

    // Simulated network delay
    setTimeout(() => {
      const user = existingMembers.find(m => m.email.toLowerCase() === targetEmail.toLowerCase());
      if (user) {
        if (user.status === MemberStatus.BANNED) {
          setError("IDENTITY_REVOKED: This node has been permanently terminated from the network.");
          setIsLoading(false);
          return;
        }
        onAuth(user);
      } else {
        setError("CREDENTIAL_MISMATCH: No active node found matching these coordinates.");
        setIsLoading(false);
      }
    }, 1500);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      const newUser: Member = {
        id: `user-${Math.random().toString(36).substr(2, 5)}`,
        email,
        phone: '+1 000 0000',
        status: MemberStatus.ACTIVE,
        mfaEnabled: true,
        role: role,
        points: 0,
        createdAt: new Date().toISOString(),
      };
      onAuth(newUser);
    }, 2000);
  };

  const quickLogins = [
    { label: 'Admin', email: 'admin.prime@nexuscore.io', icon: <Crown size={14} className="text-amber-500" />, bg: 'bg-amber-50 border-amber-100' },
    { label: 'Finance', email: 'finance.lead@nexuscore.io', icon: <Landmark size={14} className="text-blue-500" />, bg: 'bg-blue-50 border-blue-100' },
    { label: 'Creator', email: 'alex.creator@nexuscore.io', icon: <Zap size={14} className="text-indigo-500" />, bg: 'bg-indigo-50 border-indigo-100' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500 rounded-full blur-[120px]" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-violet-500 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-xl relative z-10 animate-in fade-in zoom-in-95 duration-700">
        <div className="bg-white rounded-[48px] shadow-2xl shadow-indigo-200/50 border border-slate-200 overflow-hidden">
          <div className="p-10 sm:p-14 pb-6">
            <header className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-100 mb-6 transform hover:rotate-6 transition-transform">
                <ShieldCheck size={32} className="text-white" />
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tighter mb-1">NexusCore <span className="text-indigo-600">Pro</span></h1>
              <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em]">Institutional Identity Protocol</p>
            </header>

            {error && (
              <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3 animate-in slide-in-from-top-2 duration-300">
                <Info size={16} className="text-rose-500 mt-0.5" />
                <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest leading-relaxed">{error}</p>
              </div>
            )}

            <form onSubmit={mode === 'LOGIN' ? (e) => handleLogin(e) : handleRegister} className="space-y-5">
              <div className="space-y-3">
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                  <input 
                    required
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Node Email Address"
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl py-4 pl-12 pr-6 text-sm font-bold transition-all outline-none"
                  />
                </div>
                
                <div className="relative group">
                  <Key className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                  <input 
                    required
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Access Credential"
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl py-4 pl-12 pr-6 text-sm font-bold transition-all outline-none"
                  />
                </div>

                {mode === 'REGISTER' && (
                  <div className="grid grid-cols-1 gap-3 animate-in fade-in duration-500 pt-2">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Protocol Role Assignment</p>
                    <div className="grid grid-cols-2 gap-2">
                      {[RoleCode.CREATOR, RoleCode.CUSTOMER, RoleCode.FINANCE_ADMIN].map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setRole(r)}
                          className={`py-3 rounded-xl text-[9px] font-black uppercase tracking-widest border-2 transition-all ${
                            role === r ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                          }`}
                        >
                          {r.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button 
                disabled={isLoading}
                className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl hover:bg-indigo-600 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:translate-y-0"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Synchronizing...</span>
                  </>
                ) : (
                  <>
                    <Fingerprint size={16} />
                    <span>{mode === 'LOGIN' ? 'Establish Session' : 'Register Node'}</span>
                  </>
                )}
              </button>
            </form>

            {mode === 'LOGIN' && (
              <div className="mt-8 pt-6 border-t border-slate-50">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 text-center">Quick Access Nodes</p>
                <div className="grid grid-cols-3 gap-3">
                  {quickLogins.map((q) => (
                    <button
                      key={q.email}
                      disabled={isLoading}
                      onClick={() => {
                        setEmail(q.email);
                        handleLogin(undefined, q.email);
                      }}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all hover:shadow-lg active:scale-95 disabled:opacity-50 ${q.bg} border-transparent hover:border-indigo-200`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                        {q.icon}
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-600">{q.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-slate-50 text-center">
              <button 
                onClick={() => setMode(mode === 'LOGIN' ? 'REGISTER' : 'LOGIN')}
                className="text-indigo-600 font-black text-[10px] uppercase tracking-widest hover:text-indigo-800 transition-colors flex items-center gap-2 mx-auto group"
              >
                {mode === 'LOGIN' ? (
                  <>Create Identity <UserPlus size={14} className="group-hover:translate-x-1 transition-transform" /></>
                ) : (
                  <>Return to Login <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" /></>
                )}
              </button>
            </div>
          </div>

          <div className="bg-slate-50 p-5 flex items-center justify-between border-t border-slate-100">
             <div className="flex items-center gap-2">
                <Globe size={12} className="text-slate-300" />
                <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Global Proxy Active</span>
             </div>
             <div className="flex items-center gap-2">
                <Shield size={12} className="text-emerald-500" />
                <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">v2.4 Core Secured</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthSystem;
