
import React, { useState, useEffect, useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import Layout from './components/Layout.tsx';
import PaymentOrchestrator from './components/PaymentOrchestrator.tsx';
import GatewayConnector, { GatewayType } from './components/GatewayConnector.tsx';
import AuthSystem from './components/AuthSystem.tsx';
import { 
  AppState, 
  RoleCode, 
  PaymentMethod, 
  PaymentStatus, 
  PaymentRecord,
  Wallet,
  Member,
  MemberStatus,
  Post,
  Comment
} from './types.ts';
import { MOCK_MEMBERS, MOCK_POSTS, MOCK_BLOG_POSTS, MOCK_PRODUCTS, MOCK_WALLETS } from './constants.tsx';
import { getCommunityInsights, getMemberAudit, generateOwnershipManifesto } from './geminiService.ts';
import { 
  TrendingUp, Award, MessageSquare, Heart, 
  Sparkles, Zap, Users, Wallet as WalletIcon,
  ArrowUpRight, Box, ShieldCheck, X, ChevronRight, ArrowDownLeft,
  User, Shield, BellRing, Key, ExternalLink, Activity, 
  ArrowUpCircle, History,
  Power, LogOut, Crown, KeyRound, Binary, LogIn, Send, Ghost, Sliders, ToggleLeft, ToggleRight,
  Eye, EyeOff, Save, Trash2, Loader2, Search, ArrowLeft, BarChart3, Radio,
  // Added missing RefreshCw and Landmark icons
  RefreshCw, Landmark
} from 'lucide-react';

const PERFORMANCE_DATA = [
  { name: '00:00', value: 400 },
  { name: '04:00', value: 300 },
  { name: '08:00', value: 600 },
  { name: '12:00', value: 800 },
  { name: '16:00', value: 500 },
  { name: '20:00', value: 900 },
  { name: '23:59', value: 700 },
];

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    currentUser: null,
    currentRole: RoleCode.CUSTOMER,
    members: MOCK_MEMBERS,
    posts: MOCK_POSTS,
    blogPosts: MOCK_BLOG_POSTS,
    products: MOCK_PRODUCTS,
    wallets: MOCK_WALLETS,
    payments: []
  });

  const [guestId] = useState(() => `guest-${Math.random().toString(36).substr(2, 9)}`);
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'COMMUNITY' | 'BLOG' | 'MARKETPLACE' | 'AI_STUDIO' | 'TREASURY' | 'SETTINGS' | 'MEMBERS' | 'PROFILE' | 'WALLET'>('COMMUNITY');
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [showAuthGate, setShowAuthGate] = useState(false);
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentValue, setCommentValue] = useState('');
  
  const [aiInsights, setAiInsights] = useState<string>('');
  const [isInsightsLoading, setIsInsightsLoading] = useState<boolean>(true);
  const [isPaying, setIsPaying] = useState<{ amount: number; contextId: string; type: 'TIP' | 'PRODUCT' | 'GRANT' } | null>(null);

  const [isConnectingGateway, setIsConnectingGateway] = useState<GatewayType | null>(null);
  const [memberSearch, setMemberSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<MemberStatus | 'ALL'>('ALL');

  const [memberAuditText, setMemberAuditText] = useState<string>('');
  const [isAuditLoading, setIsAuditLoading] = useState(false);
  const [isManifestoGenerating, setIsManifestoGenerating] = useState(false);

  // Settings & Profile Edit State
  const [mfaActive, setMfaActive] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [editBio, setEditBio] = useState('');
  const [passwordForm, setPasswordForm] = useState({ current: '', next: '', confirm: '' });
  const [showPasswords, setShowPasswords] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const isAdmin = useMemo(() => {
    return state.currentUser?.role === RoleCode.COMPANY_ADMIN || state.currentUser?.role === RoleCode.GROUP_ADMIN;
  }, [state.currentUser]);

  const isFinanceAdmin = useMemo(() => {
    return state.currentUser?.role === RoleCode.FINANCE_ADMIN || state.currentUser?.role === RoleCode.COMPANY_ADMIN;
  }, [state.currentUser]);

  useEffect(() => {
    if (state.currentUser) {
      setEditBio(state.currentUser.bio || '');
    }
  }, [state.currentUser]);

  const fetchInsights = async () => {
    setIsInsightsLoading(true);
    try {
      const insights = await getCommunityInsights(state.posts);
      setAiInsights(insights);
    } catch (e) {
      setAiInsights("System analysis indicates peak collaborative engagement within decentralized network nodes.");
    } finally {
      setIsInsightsLoading(false);
    }
  };

  const fetchMemberAudit = async (member: Member) => {
    setIsAuditLoading(true);
    try {
      const audit = await getMemberAudit(member);
      setMemberAuditText(audit);
    } catch (e) {
      setMemberAuditText("Audit failure. Manual node verification required.");
    } finally {
      setIsAuditLoading(false);
    }
  };

  const fetchManifesto = async (member: Member) => {
    setIsManifestoGenerating(true);
    try {
      const manifesto = await generateOwnershipManifesto(member);
      setState(prev => ({
        ...prev,
        members: prev.members.map(m => m.id === member.id ? { ...m, ownershipManifesto: manifesto } : m),
        currentUser: prev.currentUser?.id === member.id ? { ...prev.currentUser, ownershipManifesto: manifesto } : prev.currentUser
      }));
    } catch (e) {
      console.error("Manifesto Gen Error", e);
    } finally {
      setIsManifestoGenerating(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const handleAuth = (user: Member) => {
    setState(prev => ({ 
      ...prev, 
      currentUser: user, 
      currentRole: user.role,
      members: prev.members.some(m => m.id === user.id) ? prev.members : [...prev.members, user]
    }));
    setShowAuthGate(false);
  };

  const handleLogout = () => {
    setState(prev => ({ ...prev, currentUser: null }));
    setActiveTab('COMMUNITY');
    setSelectedMemberId(null);
  };

  const triggerAuthAction = (callback: () => void) => {
    if (!state.currentUser) {
      setShowAuthGate(true);
    } else {
      callback();
    }
  };

  const handleLike = (postId: string) => {
    const userId = state.currentUser ? state.currentUser.id : guestId;
    
    setState(prev => {
      const targetPost = prev.posts.find(p => p.id === postId);
      if (!targetPost) return prev;

      const isLiking = !targetPost.likes.includes(userId);
      const pointAward = (state.currentUser && isLiking) ? 5 : 0; 

      return {
        ...prev,
        currentUser: prev.currentUser ? { ...prev.currentUser, points: prev.currentUser.points + pointAward } : null,
        posts: prev.posts.map(post => {
          if (post.id === postId) {
            const newLikes = post.likes.includes(userId) 
              ? post.likes.filter(id => id !== userId) 
              : [...post.likes, userId];
            return { ...post, likes: newLikes };
          }
          return post;
        })
      };
    });
  };

  const handleComment = (postId: string) => {
    if (!commentValue.trim()) return;
    
    const isGuest = !state.currentUser;
    const newComment: Comment = {
      id: `c-${Math.random().toString(36).substr(2, 5)}`,
      authorId: isGuest ? guestId : state.currentUser!.id,
      authorName: isGuest ? 'Anonymous' : state.currentUser!.email.split('@')[0],
      content: commentValue,
      createdAt: new Date().toISOString()
    };

    setState(prev => ({
      ...prev,
      currentUser: prev.currentUser ? { ...prev.currentUser, points: prev.currentUser.points + 10 } : null,
      posts: prev.posts.map(post => {
        if (post.id === postId) {
          return { ...post, comments: [...post.comments, newComment] };
        }
        return post;
      })
    }));
    setCommentValue('');
    setActiveCommentPostId(null);
  };

  const handlePaymentSuccess = (method: PaymentMethod) => {
    if (!isPaying || !state.currentUser) return;
    const newPayment: PaymentRecord = {
      id: `TX-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      payerId: state.currentUser.id,
      payeeId: selectedMemberId || 'creator-alpha-1',
      amount: isPaying.amount,
      currency: 'USD',
      method: method,
      status: PaymentStatus.SUCCESS,
      contextType: isPaying.type === 'GRANT' ? 'SUBSCRIPTION' : isPaying.type as any,
      contextId: isPaying.contextId,
      createdAt: new Date().toISOString()
    };
    setState(prev => ({ ...prev, payments: [newPayment, ...prev.payments] }));
    setIsPaying(null);
  };

  const handleGatewaySuccess = () => {
    if (!state.currentUser || !isConnectingGateway) return;
    
    const newWallet: Wallet = {
      id: `w-${Math.random().toString(36).substr(2, 5)}`,
      ownerId: state.currentUser.id,
      address: isConnectingGateway === 'CRYPTO' ? '0x' + Math.random().toString(16).substr(2, 12) + '...f92a' : 'bank-routing-...' + Math.random().toString(10).substr(2, 4),
      currency: isConnectingGateway === 'CRYPTO' ? 'USDT' : 'BTC',
      balance: 0,
      securityProtocol: 'QUANTUM_SHIELD'
    };

    setState(prev => ({
      ...prev,
      wallets: [...prev.wallets, newWallet]
    }));
    setIsConnectingGateway(null);
  };

  const filteredMembers = useMemo(() => {
    return state.members.filter(m => {
      const matchesSearch = m.email.toLowerCase().includes(memberSearch.toLowerCase()) || m.id.toLowerCase().includes(memberSearch.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || m.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [state.members, memberSearch, statusFilter]);

  const selectedMember = useMemo(() => {
    if (activeTab === 'PROFILE' && state.currentUser) return state.currentUser;
    return state.members.find(m => m.id === selectedMemberId);
  }, [state.members, selectedMemberId, activeTab, state.currentUser]);

  const memberWallets = useMemo(() => {
    const target = selectedMember;
    if (!target) return [];
    return state.wallets.filter(w => w.ownerId === target.id);
  }, [selectedMember, state.wallets]);

  useEffect(() => {
    if (selectedMember) {
      fetchMemberAudit(selectedMember);
      if (!selectedMember.ownershipManifesto) {
        fetchManifesto(selectedMember);
      }
    }
  }, [selectedMemberId, activeTab, state.currentUser]);

  const handleTabChange = (tab: any) => {
    const authTabs = ['AI_STUDIO', 'SETTINGS', 'PROFILE', 'WALLET'];
    
    if (tab === 'DASHBOARD' || tab === 'MEMBERS') {
      if (!state.currentUser) {
        setShowAuthGate(true);
      } else if (!isAdmin) {
        setActiveTab('COMMUNITY');
      } else {
        setActiveTab(tab);
      }
    } else if (tab === 'TREASURY') {
      if (!state.currentUser) {
        setShowAuthGate(true);
      } else if (!isFinanceAdmin) {
        setActiveTab('COMMUNITY');
      } else {
        setActiveTab(tab);
      }
    } else if (authTabs.includes(tab)) {
      if (!state.currentUser) {
        setShowAuthGate(true);
      } else {
        setActiveTab(tab);
        if (tab === 'PROFILE') setSelectedMemberId(null);
      }
    } else {
      setActiveTab(tab);
      setSelectedMemberId(null);
    }
  };

  const handleSaveProfile = () => {
    if (!state.currentUser) return;
    setIsSaving(true);
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        currentUser: prev.currentUser ? { ...prev.currentUser, bio: editBio } : null,
        members: prev.members.map(m => m.id === prev.currentUser?.id ? { ...m, bio: editBio } : m)
      }));
      setIsSaving(false);
    }, 1000);
  };

  const handleUpdatePassword = () => {
    setIsSaving(true);
    setTimeout(() => {
      setPasswordForm({ current: '', next: '', confirm: '' });
      setIsSaving(false);
      alert("Credentials synchronized successfully.");
    }, 1500);
  };

  const renderMemberDetail = (member: Member) => (
    <div className="animate-in fade-in slide-in-from-right-8 duration-500 space-y-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        {activeTab === 'MEMBERS' && (
          <button onClick={() => setSelectedMemberId(null)} className="flex items-center gap-3 text-slate-500 hover:text-indigo-600 font-bold text-xs uppercase tracking-widest transition-all group">
            <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center group-hover:border-indigo-100 group-hover:shadow-lg transition-all">
              <ArrowLeft size={18} />
            </div>
            Back to Registry
          </button>
        )}
        {activeTab === 'PROFILE' && (
           <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Identity Node: <span className="text-indigo-600">{member.email.split('@')[0]}</span></h2>
        )}
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-premium p-10 text-center relative scanline">
            <div className="absolute top-0 left-0 w-full h-32 bg-indigo-600/5" />
            <div className="relative mt-4">
              <div className="w-32 h-32 mx-auto rounded-full bg-white p-1.5 border border-slate-200 shadow-xl mb-6 ring-4 ring-indigo-50">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.id}`} className="w-full h-full object-cover rounded-full" alt="avatar" />
              </div>
              <div className="flex items-center justify-center gap-2 mb-1">
                <h3 className="text-2xl font-bold text-slate-900 leading-tight">{member.email.split('@')[0]}</h3>
                <Crown size={16} className="text-amber-500" />
              </div>
              <p className="text-xs font-bold text-slate-400 mb-6 mono">{member.id.toUpperCase()}</p>
              
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 text-left mb-6 shadow-sm">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 opacity-70">Manifesto</p>
                <p className="text-xs font-medium text-slate-600 leading-relaxed italic">
                  "{isManifestoGenerating ? "Synthesizing manifesto..." : member.ownershipManifesto}"
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-2">
                <span className="px-3 py-1 bg-indigo-600 text-white rounded-full text-[9px] font-bold uppercase tracking-widest">{member.role}</span>
                <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${member.status === MemberStatus.ACTIVE ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>{member.status}</span>
              </div>
            </div>
          </div>

          <div className="bg-[#0f172a] rounded-[32px] p-8 text-white relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform">
                <KeyRound size={120} />
             </div>
             <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
               <Binary size={14} /> Active Secure Nodes
             </h4>
             <div className="space-y-3 relative z-10">
                {memberWallets.map(w => (
                  <div key={w.id} className="p-4 glass-dark rounded-2xl flex justify-between items-center group/item hover:bg-white/5 transition-all">
                    <div>
                       <p className="text-xs font-bold text-white">{w.currency} Settlement</p>
                       <span className="text-[9px] font-bold text-indigo-300 mono opacity-60">{w.address.slice(0, 10)}...</span>
                    </div>
                    <button className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center hover:bg-indigo-500/40 transition-all text-indigo-400">
                      <ExternalLink size={14} />
                    </button>
                  </div>
                ))}
                {memberWallets.length === 0 && (
                   <p className="text-[10px] text-indigo-300/30 font-bold uppercase italic text-center py-4 tracking-widest">No active nodes detected</p>
                )}
             </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white rounded-[32px] border border-slate-200 p-10 shadow-premium relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
               <Activity size={120} />
             </div>
             <div className="flex items-center gap-3 px-4 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full w-fit mb-8">
               <ShieldCheck size={14} className="text-indigo-600" />
               <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Autonomous Security Audit</span>
             </div>
             <p className="text-slate-900 font-medium text-lg leading-relaxed italic tracking-tight border-l-4 border-indigo-600 pl-8 relative z-10">
               "{isAuditLoading ? "Gathering node telemetry..." : memberAuditText}"
             </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatCard icon={<Award className="text-amber-500" />} label="Identity Reputation" value={member.points.toLocaleString()} trend="+4%" sub="Nexus Score" />
            <StatCard icon={<Activity className="text-indigo-600" />} label="Network Presence" value="98.2%" trend="+0.5%" sub="Uptime Ratio" />
          </div>

          <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-premium">
            <h4 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2">
              <History size={16} className="text-slate-400" /> Operational History
            </h4>
            <div className="space-y-4">
              <HistoryItem label="Last Protocol Authentication" date="2 hours ago" status="SECURE" />
              <HistoryItem label="Treasury Settlement: #TX-902A" date="Yesterday" status="SUCCESS" />
              <HistoryItem label="Identity Node Migration" date="3 days ago" status="SUCCESS" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (showAuthGate) {
    return (
      <div className="relative h-screen w-full bg-[#0f172a]">
        <button 
          onClick={() => setShowAuthGate(false)}
          className="absolute top-8 left-8 z-[100] glass-dark p-3 rounded-2xl shadow-lg hover:bg-white/10 transition-all flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white"
        >
          <ArrowLeft size={16} /> Public Grid
        </button>
        <AuthSystem onAuth={handleAuth} existingMembers={state.members} />
      </div>
    );
  }

  return (
    <Layout 
      activeRole={state.currentRole} 
      userName={state.currentUser?.email || 'Guest Visitor'} 
      activeTab={activeTab} 
      isLoggedIn={!!state.currentUser}
      points={state.currentUser?.points || 0}
      onTabChange={handleTabChange}
      onLogout={handleLogout}
      onLoginRequest={() => setShowAuthGate(true)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-4">
        {activeTab === 'DASHBOARD' && state.currentUser && isAdmin && (
          <div className="space-y-10 animate-in fade-in duration-700">
             <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Live System Status</span>
                </div>
                <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Executive Control Hub</h2>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={fetchInsights} className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-premium">
                  <RefreshCw size={18} className={isInsightsLoading ? 'animate-spin' : ''} />
                </button>
                <div className="px-5 py-3 bg-indigo-600 rounded-2xl text-white flex items-center gap-3 shadow-lg shadow-indigo-100">
                  <Zap size={18} />
                  <span className="text-xs font-bold uppercase tracking-widest">Optimal Performance</span>
                </div>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard icon={<TrendingUp className="text-indigo-600" />} label="Gross Revenue" value="$28,492" trend="+24%" sub="Monthly Peak" />
              <StatCard icon={<Users className="text-blue-600" />} label="Active Nodes" value={state.members.length.toString()} trend="+2" sub="Network Load" />
              <StatCard icon={<Award className="text-amber-500" />} label="Reputation" value={state.currentUser.points.toLocaleString()} trend="+125" sub="Nexus Points" />
              <StatCard icon={<ShieldCheck className="text-emerald-500" />} label="Trust Score" value="A++" trend="Locked" sub="System Security" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
               <div className="lg:col-span-8 space-y-8">
                  <div className="bg-white p-10 rounded-[32px] border border-slate-200 shadow-premium">
                    <div className="flex justify-between items-center mb-10">
                      <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <BarChart3 size={20} className="text-indigo-600" />
                        Network Throughput
                      </h3>
                      <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-500" /> Traffic</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-100" /> Baseline</span>
                      </div>
                    </div>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={PERFORMANCE_DATA}>
                          <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} dy={10} />
                          <YAxis hide />
                          <Tooltip 
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                          />
                          <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-white p-10 rounded-[32px] border border-slate-200 shadow-premium relative overflow-hidden group hover:border-indigo-100 transition-all">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform">
                      <Sparkles size={120} />
                    </div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-indigo-600 rounded-xl text-white">
                        <Radio size={20} className="animate-pulse" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">Intelligence Synthesis</h3>
                    </div>
                    <div className="bg-slate-950 rounded-2xl p-8 text-indigo-100/90 relative z-10 mono">
                      <p className="text-lg leading-relaxed italic border-l-2 border-indigo-500 pl-6">
                        {isInsightsLoading ? "Decrypting telemetry feeds..." : aiInsights}
                      </p>
                    </div>
                  </div>
               </div>
               <div className="lg:col-span-4 space-y-6">
                  <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-premium">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Priority Clearances</h4>
                    <div className="space-y-3">
                      <DashboardAction icon={<Users size={18} />} label="Collective Registry" onClick={() => handleTabChange('MEMBERS')} color="bg-blue-50 text-blue-600" />
                      <DashboardAction icon={<Landmark size={18} />} label="Treasury Gateway" onClick={() => handleTabChange('TREASURY')} color="bg-emerald-50 text-emerald-600" />
                      <DashboardAction icon={<Sliders size={18} />} label="System Calibrations" onClick={() => handleTabChange('SETTINGS')} color="bg-slate-50 text-slate-600" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[32px] p-8 text-white shadow-xl shadow-indigo-100 relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-10 opacity-10 transform translate-x-10 -translate-y-10 group-hover:scale-110 transition-transform">
                       <Zap size={150} />
                     </div>
                     <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-200 mb-1">Network Capacity</p>
                     <h4 className="text-4xl font-extrabold tracking-tight mb-8">99.9%</h4>
                     <div className="space-y-4 relative z-10">
                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                           <div className="h-full bg-white w-4/5 rounded-full" />
                        </div>
                        <p className="text-xs font-bold text-indigo-100/70">8/10 active node shards operating within nominal parameters.</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'COMMUNITY' && (
          <div className="max-w-3xl mx-auto space-y-12 animate-in slide-in-from-bottom-6 duration-700">
             <header className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full mb-6">
                  <Sparkles size={14} className="text-indigo-600" />
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">NexusCore Intelligence Feed</span>
                </div>
                <h2 className="text-5xl font-extrabold text-slate-900 tracking-tight mb-4">The Collective</h2>
                <p className="text-slate-500 text-lg font-medium leading-relaxed">Encrypted discourse and strategic signals from authenticated network nodes.</p>
             </header>
             
             {state.posts.map(post => (
              <div key={post.id} className="bg-white rounded-[32px] border border-slate-200 p-8 sm:p-10 shadow-premium hover:shadow-2xl hover:border-indigo-100 transition-all group">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 shadow-sm group-hover:scale-105 transition-transform">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.authorId}`} className="w-full h-full object-cover rounded-2xl" alt="author" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-slate-900">{post.authorName}</p>
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mono">{post.id.toUpperCase()} • {new Date(post.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors tracking-tight leading-tight">{post.title}</h3>
                <p className="text-slate-600 leading-relaxed mb-8 font-medium italic opacity-90 border-l-2 border-slate-100 pl-6">"{post.content}"</p>
                
                <div className="flex items-center justify-between pt-8 border-t border-slate-50 mb-4">
                  <div className="flex items-center gap-6">
                    <button 
                      onClick={() => handleLike(post.id)} 
                      className={`flex items-center gap-2 font-bold transition-all ${post.likes.includes(state.currentUser?.id || guestId) ? 'text-rose-500' : 'text-slate-400 hover:text-rose-500'}`}
                    >
                      <Heart size={20} fill={post.likes.includes(state.currentUser?.id || guestId) ? 'currentColor' : 'none'} />
                      <span className="text-xs">{post.likes.length}</span>
                    </button>
                    <button 
                      onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                      className={`flex items-center gap-2 font-bold transition-colors ${activeCommentPostId === post.id ? 'text-indigo-600' : 'text-slate-400 hover:text-indigo-600'}`}
                    >
                      <MessageSquare size={20} />
                      <span className="text-xs">{post.comments.length}</span>
                    </button>
                  </div>
                  <button 
                    onClick={() => triggerAuthAction(() => setIsPaying({ amount: 15.00, contextId: post.id, type: 'TIP' }))} 
                    className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg hover:bg-indigo-600 transition-all active:scale-95"
                  >
                    Send Tip
                  </button>
                </div>

                {/* Comment Section */}
                {(activeCommentPostId === post.id || post.comments.length > 0) && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500 mt-6 pt-6 border-t border-slate-50">
                    <div className="space-y-3">
                      {post.comments.map(c => (
                        <div key={c.id} className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 group/comment">
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">{c.authorName}</span>
                            <span className="text-[9px] text-slate-300 font-bold mono">{new Date(c.createdAt).toLocaleTimeString()}</span>
                          </div>
                          <p className="text-sm text-slate-600 font-medium leading-relaxed">{c.content}</p>
                        </div>
                      ))}
                    </div>

                    {activeCommentPostId === post.id && (
                      <div className="flex gap-3 pt-2">
                        <input 
                          type="text" 
                          value={commentValue}
                          onChange={(e) => setCommentValue(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleComment(post.id)}
                          placeholder={state.currentUser ? "Broadcast signal..." : "Anonymous transmission..."}
                          className="flex-1 bg-slate-50 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 rounded-xl px-5 py-3 text-sm font-medium transition-all"
                        />
                        <button 
                          onClick={() => handleComment(post.id)}
                          disabled={!commentValue.trim()}
                          className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg hover:bg-indigo-700 disabled:opacity-50 transition-all active:scale-90"
                        >
                          <Send size={18} />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* PROFILE View */}
        {activeTab === 'PROFILE' && state.currentUser && renderMemberDetail(state.currentUser)}

        {/* SETTINGS View */}
        {activeTab === 'SETTINGS' && state.currentUser && (
          <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500">
             <header>
                <div className="flex items-center gap-3 mb-2">
                   <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                      <Sliders size={18} />
                   </div>
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Node Configuration</span>
                </div>
                <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">System Calibrations</h2>
             </header>

             <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
                <section className="bg-white p-10 rounded-[32px] border border-slate-200 shadow-premium">
                  <div className="flex items-center justify-between mb-10">
                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                      <User className="text-indigo-600" size={24} />
                      Identity Attributes
                    </h3>
                    <button 
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="px-6 py-3 bg-indigo-600 text-white rounded-2xl text-xs font-bold uppercase tracking-widest shadow-lg hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center gap-2"
                    >
                      {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                      Update Node
                    </button>
                  </div>
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-3 ml-1">Identity Mail</label>
                        <input readOnly value={state.currentUser.email} className="w-full bg-slate-50 border-transparent rounded-2xl py-4 px-6 text-sm font-bold text-slate-400 cursor-not-allowed" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-3 ml-1">Node Status</label>
                        <div className="w-full bg-emerald-50 border border-emerald-100 rounded-2xl py-4 px-6 text-sm font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                           <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> ACTIVE PROTOCOL
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-3 ml-1">Operational Biography</label>
                      <textarea 
                        value={editBio}
                        onChange={(e) => setEditBio(e.target.value)}
                        placeholder="Define your node mission..."
                        className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl py-5 px-7 text-sm font-medium transition-all outline-none min-h-[140px] shadow-inner"
                      />
                    </div>
                  </div>
                </section>

                <section className="bg-white p-10 rounded-[32px] border border-slate-200 shadow-premium">
                   <h3 className="text-xl font-bold text-slate-900 mb-10 flex items-center gap-3">
                      <Shield className="text-indigo-600" size={24} />
                      Security Protocols
                   </h3>
                   <div className="space-y-4">
                      <SettingToggle 
                        icon={<KeyRound size={20} />} 
                        label="Multi-Factor Authentication" 
                        description="Hardware key and biometric secondary validation layers."
                        active={mfaActive}
                        onToggle={() => setMfaActive(!mfaActive)}
                      />
                      <SettingToggle 
                        icon={<BellRing size={20} />} 
                        label="Telemetry Notifications" 
                        description="Real-time encrypted alerts for all node interactions."
                        active={notifications}
                        onToggle={() => setNotifications(!notifications)}
                      />
                   </div>
                </section>
             </div>
          </div>
        )}

        {/* Registry & Treasury (Admin only sections rendered simplified for space) */}
        {activeTab === 'MEMBERS' && isAdmin && !selectedMemberId && (
          <div className="space-y-8 animate-in fade-in duration-500">
             <header>
               <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Collective Registry</h2>
               <p className="text-slate-500 font-medium">Verified node monitoring and reputation audits.</p>
             </header>
             <div className="bg-white rounded-[32px] border border-slate-200 shadow-premium overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                   <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input 
                        type="text" 
                        value={memberSearch}
                        onChange={(e) => setMemberSearch(e.target.value)}
                        placeholder="Filter by Node ID..." 
                        className="w-full bg-slate-50 border-transparent focus:bg-white focus:border-indigo-500 rounded-xl py-3 pl-12 pr-4 text-sm font-bold transition-all"
                      />
                   </div>
                </div>
                <div className="divide-y divide-slate-50">
                  {filteredMembers.map(member => (
                    <div key={member.id} onClick={() => setSelectedMemberId(member.id)} className="p-6 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors group">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                             <User size={20} />
                          </div>
                          <div>
                             <p className="font-bold text-slate-900">{member.email}</p>
                             <p className="text-[10px] font-bold text-slate-400 mono">{member.id.toUpperCase()}</p>
                          </div>
                       </div>
                       <ChevronRight className="text-slate-200 group-hover:text-indigo-400 transition-colors" />
                    </div>
                  ))}
                </div>
             </div>
          </div>
        )}
      </div>

      {isPaying && <PaymentOrchestrator amount={isPaying.amount} currency="USD" onSuccess={handlePaymentSuccess} onClose={() => setIsPaying(null)} />}
    </Layout>
  );
};

const StatCard = ({ icon, label, value, trend, sub }: { icon: React.ReactNode, label: string, value: string, trend: string, sub: string }) => (
  <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-premium transition-all hover:shadow-2xl hover:border-indigo-100 group">
    <div className="flex justify-between items-start mb-6">
      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-indigo-50 transition-colors">{icon}</div>
      <div className={`px-2 py-1 rounded-lg text-[10px] font-bold ${trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
        {trend}
      </div>
    </div>
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</p>
    <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">{value}</h3>
    <p className="text-[11px] font-bold text-slate-300 italic mt-1">{sub}</p>
  </div>
);

const DashboardAction = ({ icon, label, onClick, color }: { icon: React.ReactNode, label: string, onClick?: () => void, color: string }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 p-5 rounded-2xl transition-all hover:shadow-lg active:scale-95 group border border-transparent hover:border-indigo-100 ${color}/10 hover:bg-white`}>
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform ${color}`}>
      {icon}
    </div>
    <span className="text-sm font-bold text-slate-700 tracking-tight">{label}</span>
    <ChevronRight size={16} className="ml-auto opacity-20" />
  </button>
);

const HistoryItem = ({ label, date, status }: { label: string, date: string, status: string }) => (
  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group">
    <div className="flex items-center gap-3">
      <div className="w-2 h-2 rounded-full bg-emerald-400" />
      <div>
        <p className="text-xs font-bold text-slate-900">{label}</p>
        <p className="text-[10px] font-bold text-slate-400 uppercase">{date}</p>
      </div>
    </div>
    <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">{status}</span>
  </div>
);

const SettingToggle = ({ icon, label, description, active, onToggle }: { icon: React.ReactNode, label: string, description: string, active: boolean, onToggle: () => void }) => (
  <div className="flex items-center justify-between p-6 bg-slate-50/50 rounded-2xl border border-slate-100 transition-all hover:bg-white hover:shadow-md">
    <div className="flex items-center gap-5">
      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 border border-slate-100 shadow-sm group-hover:text-indigo-600">
        {icon}
      </div>
      <div>
        <p className="text-sm font-bold text-slate-900 mb-1">{label}</p>
        <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-sm">{description}</p>
      </div>
    </div>
    <button onClick={onToggle} className={`transition-all ${active ? 'text-indigo-600' : 'text-slate-300'}`}>
      {active ? <ToggleRight size={44} /> : <ToggleLeft size={44} />}
    </button>
  </div>
);

export default App;
