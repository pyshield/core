
import React, { useState } from 'react';
import { CreditCard, Wallet as WalletIcon, Landmark, CheckCircle2, Loader2, X, ShieldCheck } from 'lucide-react';
import { PaymentMethod, PaymentStatus } from '../types.ts';

interface PaymentOrchestratorProps {
  amount: number;
  currency: string;
  onSuccess: (method: PaymentMethod) => void;
  onClose: () => void;
}

const PaymentOrchestrator: React.FC<PaymentOrchestratorProps> = ({ amount, currency, onSuccess, onClose }) => {
  const [step, setStep] = useState<'SELECT' | 'PROCESSING' | 'SUCCESS'>('SELECT');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);

  const handlePayment = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setStep('PROCESSING');
    setTimeout(() => {
      setStep('SUCCESS');
      setTimeout(() => onSuccess(method), 1500);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative bg-white rounded-[40px] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-200">
        <div className="p-10">
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">P</div>
              <h3 className="text-xl font-black text-slate-900">NexusPay</h3>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
              <X size={20} />
            </button>
          </div>

          {step === 'SELECT' && (
            <div className="space-y-6">
              <div className="text-center p-8 bg-slate-50 rounded-[32px] border border-slate-100 shadow-inner">
                <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">Total to Authorized</p>
                <p className="text-5xl font-black text-slate-900 tracking-tight">
                  <span className="text-slate-300 text-3xl font-medium mr-1">{currency}</span>
                  {amount.toFixed(2)}
                </p>
              </div>

              <div className="space-y-3">
                <PaymentOption 
                  icon={<CreditCard className="text-blue-600" size={20} />} 
                  title="Card Terminal" 
                  description="Visa, Mastercard, Amex"
                  onClick={() => handlePayment(PaymentMethod.STRIPE)}
                />
                <PaymentOption 
                  icon={<WalletIcon className="text-orange-600" size={20} />} 
                  title="Crypto Settlement" 
                  description="USDC, ETH, MATIC"
                  onClick={() => handlePayment(PaymentMethod.WALLET)}
                />
                <PaymentOption 
                  icon={<Landmark className="text-emerald-600" size={20} />} 
                  title="Bank Wire" 
                  description="SEPA / SWIFT Instant"
                  onClick={() => handlePayment(PaymentMethod.LOCAL)}
                />
              </div>
            </div>
          )}

          {step === 'PROCESSING' && (
            <div className="py-20 flex flex-col items-center text-center">
              <div className="relative">
                <Loader2 className="w-20 h-20 text-indigo-600 animate-spin" strokeWidth={1.5} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 bg-indigo-50 rounded-full animate-pulse" />
                </div>
              </div>
              <h4 className="text-2xl font-black text-slate-900 mt-8 mb-2">Securing Transaction</h4>
              <p className="text-slate-500 text-sm font-medium px-10">Connecting to secure {selectedMethod} nodes...</p>
            </div>
          )}

          {step === 'SUCCESS' && (
            <div className="py-20 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-8 border border-emerald-100 shadow-xl shadow-emerald-100 animate-bounce">
                <CheckCircle2 size={48} strokeWidth={2.5} />
              </div>
              <h4 className="text-2xl font-black text-slate-900 mb-2">Payment Dispatched</h4>
              <p className="text-slate-500 text-sm font-medium">Digital receipt transmitted successfully.</p>
            </div>
          )}
        </div>
        
        <div className="bg-slate-50 px-10 py-5 flex items-center justify-center gap-3 border-t border-slate-100">
          <ShieldCheck size={18} className="text-slate-400" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">AES-256 Encrypted Gateway</span>
        </div>
      </div>
    </div>
  );
};

const PaymentOption = ({ icon, title, description, onClick }: { icon: React.ReactNode, title: string, description: string, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center gap-5 p-5 bg-white border border-slate-100 rounded-3xl hover:border-indigo-600 hover:bg-indigo-50/30 transition-all text-left group shadow-sm hover:shadow-md active:scale-[0.98]"
  >
    <div className="w-12 h-12 flex items-center justify-center bg-white rounded-2xl shadow-sm border border-slate-100 group-hover:scale-110 group-hover:bg-white transition-all">
      {icon}
    </div>
    <div className="flex-1">
      <p className="font-black text-slate-900 text-sm leading-none mb-1">{title}</p>
      <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tighter">{description}</p>
    </div>
  </button>
);

export default PaymentOrchestrator;
