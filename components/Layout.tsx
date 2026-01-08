
import React, { useMemo } from 'react';
import { 
  LayoutDashboard, Users, CreditCard, ShoppingBag, Settings, Bell, LogOut, 
  Search, Sparkles, ShieldCheck, Newspaper, UserCheck, LogIn, Globe, Award, 
  Sliders, User as UserIcon, Wallet as WalletIcon, Landmark, Zap, Shield
} from 'lucide-react';
import { RoleCode } from '../types.ts';

interface LayoutProps {
  children: React.ReactNode;
  activeRole: RoleCode;
  userName: string;
  onTabChange: (tab: any) => void;
  activeTab: string;
  onLogout: () => void;
  isLoggedIn: boolean;
  onLoginRequest: () => void;
  points: number;
}

const Layout: React.FC<LayoutProps> = ({ children, activeRole, userName, onTabChange, activeTab, onLogout, isLoggedIn, onLoginRequest, points }) => {
  const isAdmin = useMemo(() => {
    return activeRole === RoleCode.COMPANY_ADMIN || activeRole === RoleCode.GROUP_ADMIN;
  }, [activeRole]);

  const isFinanceAdmin = useMemo(() => {
    return activeRole === RoleCode.FINANCE_ADMIN || activeRole === RoleCode.COMPANY_ADMIN;
  }, [activeRole]);

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans antialiased text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Sidebar */}
      <aside className="w-[280px] bg-white border-r border-slate-200 hidden lg:flex flex-col sticky top-0 h-screen z-30 shadow-[4px_0_24px_-4px_rgba(0,0,0,0.02)]">
        <div className="p-8">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => onTabChange('COMMUNITY')}>
            <div className="w-10 h-10 bg-[#0f172a] rounded-xl flex items-center justify-center shadow-xl shadow-indigo-100/50 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
               <span className="text-indigo-500 font-extrabold text-xl tracking-tighter italic">N</span>
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight leading-none mb-1">Nexus<span className="text-indigo-600">Core</span></h1>
              <div className="flex items-center gap-1.5 opacity-60">
                <ShieldCheck size={10} className="text-emerald-500" />
                <span className="text-[8px] text-slate-500 font-extrabold uppercase tracking-widest">Enterprise OS</span>
              </div>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto pb-8 scrollbar-hide">
          <SectionHeader label="Public Grid" />
          <NavItem icon={<Users size={18} />} label="Collective" active={activeTab === 'COMMUNITY'} onClick={() => onTabChange('COMMUNITY')} />
          <NavItem icon={<Newspaper size={18} />} label="Gazette" active={activeTab === 'BLOG'} onClick={() => onTabChange('BLOG')} />
          <NavItem icon={<ShoppingBag size={18} />} label="Market" active={activeTab === 'MARKETPLACE'} onClick={() => onTabChange('MARKETPLACE')} />

          {isLoggedIn && isAdmin && (
            <>
              <SectionHeader label="Operations" />
              <NavItem icon={<LayoutDashboard size={18} />} label="Executive Dash" active={activeTab === 'DASHBOARD'} onClick={() => onTabChange('DASHBOARD')} />
              <NavItem icon={<UserCheck size={18} />} label="Node Registry" active={activeTab === 'MEMBERS'} onClick={() => onTabChange('MEMBERS')} />
            </>
          )}

          {isLoggedIn && isFinanceAdmin && (
            <>
              <SectionHeader label="Finance Control" />
              <NavItem icon={<Landmark size={18} />} label="Treasury Hub" active={activeTab === 'TREASURY'} onClick={() => onTabChange('TREASURY')} />
            </>
          )}

          <SectionHeader label="Identity Workspace" />
          <NavItem icon={<UserIcon size={18} />} label="My Profile" active={activeTab === 'PROFILE'} onClick={() => onTabChange('PROFILE')} disabled={!isLoggedIn} />
          <NavItem icon={<WalletIcon size={18} />} label="My Assets" active={activeTab === 'WALLET'} onClick={() => onTabChange('WALLET')} disabled={!isLoggedIn} />
          <NavItem icon={<Sparkles size={18} />} label="AI Studio" active={activeTab === 'AI_STUDIO'} onClick={() => onTabChange('AI_STUDIO')} disabled={!isLoggedIn} />
          <NavItem icon={<Sliders size={18} />} label="Settings" active={activeTab === 'SETTINGS'} onClick={() => onTabChange('SETTINGS')} disabled={!isLoggedIn} />
        </nav>

        <div className="p-6 mt-auto">
          {isLoggedIn ? (
            <div className="p-5 bg-slate-50 rounded-[24px] border border-slate-200/50 shadow-sm relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-transform duration-500">
                  <Zap size={60} />
               </div>
               <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-indigo-600 font-extrabold text-sm ring-4 ring-indigo-50">
                    {userName.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-xs font-bold text-slate-900 truncate">{userName.split('@')[0]}</p>
                    <p className="text-[9px] text-indigo-600 font-extrabold uppercase tracking-widest">{activeRole.replace('_', ' ')}</p>
                  </div>
               </div>
               <div className="flex items-center justify-between pt-3 border-t border-slate-200/50">
                  <div className="flex items-center gap-1.5">
                    <Award size={12} className="text-amber-500" />
                    <span className="text-xs font-extrabold text-slate-700">{points.toLocaleString()}</span>
                  </div>
                  <button onClick={onLogout} className="text-slate-400 hover:text-rose-600 transition-colors">
                    <LogOut size={16} />
                  </button>
               </div>
            </div>
          ) : (
            <button 
              onClick={onLoginRequest}
              className="w-full bg-[#0f172a] text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 shadow-xl shadow-indigo-100 hover:bg-indigo-600 transition-all hover:-translate-y-1 active:translate-y-0"
            >
              <LogIn size={16} className="text-indigo-400" />
              Establish Identity
            </button>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex-1 max-w-xl">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Global Signal Scan..." 
                className="w-full bg-slate-50 border-transparent focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50 rounded-2xl py-2.5 pl-12 pr-4 text-sm font-medium transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-6">
            {!isLoggedIn && (
               <div className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-600 font-bold text-[9px] uppercase tracking-widest">
                  <Globe size={12} /> Guest Node Active
               </div>
            )}
            <button className="relative p-2.5 text-slate-400 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-100">
              <Bell size={20} />
              {isLoggedIn && <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>}
            </button>
            <div className="h-6 w-px bg-slate-200"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Protocol</p>
                <p className="text-xs font-extrabold text-emerald-600">v4.2.0-SECURE</p>
              </div>
            </div>
          </div>
        </header>

        <section className="flex-1 p-6 lg:p-12 overflow-y-auto scrollbar-hide">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </section>
      </main>
    </div>
  );
};

const SectionHeader = ({ label }: { label: string }) => (
  <div className="px-4 pt-6 pb-2 text-[9px] font-extrabold text-slate-400 uppercase tracking-[0.25em] opacity-60 flex items-center justify-between">
    <span>{label}</span>
  </div>
);

const NavItem = ({ icon, label, active = false, onClick, disabled = false }: { icon: React.ReactNode, label: string, active?: boolean, onClick: () => void, disabled?: boolean }) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-[14px] text-xs font-bold transition-all duration-200 relative group ${
      active 
        ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 translate-x-1' 
        : disabled 
          ? 'text-slate-300 cursor-not-allowed' 
          : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600 group'
    }`}
  >
    <span className={active ? 'text-white' : disabled ? 'text-slate-200' : 'text-slate-400 group-hover:text-indigo-600 transition-colors'}>{icon}</span>
    <span className="tracking-tight">{label}</span>
    {active && <div className="absolute right-3 w-1.5 h-1.5 bg-white rounded-full" />}
  </button>
);

export default Layout;
