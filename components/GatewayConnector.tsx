
import React, { useState } from 'react';
import { ShieldCheck, Loader2, X, CheckCircle2, Globe, Lock, Cpu, Link2, CreditCard, Wallet as WalletIcon, Landmark } from 'lucide-react';

export type GatewayType = 'STRIPE' | 'CRYPTO' | 'LOCAL';

interface GatewayConnectorProps {
  type: GatewayType;
  onSuccess: () => void;
  onClose: () => void;
}

const GatewayConnector: React.FC<GatewayConnectorProps> = ({ type, onSuccess, onClose }) => {
  const [step, setStep] = useState<'INIT' | 'SECURITY_CHECK' | 'HANDSHAKE' | 'SUCCESS'>('INIT');

  const initiateConnection = () => {
    setStep('SECURITY_CHECK');
    setTimeout(() => {
      setStep('HANDSHAKE');
      setTimeout(() => {
        setStep('SUCCESS');
        setTimeout(() => onSuccess(), 1500);
      }, 2500);
    }, 1500);
  };

  const config = {
    STRIPE: {
      title: 'Stripe Terminal',
      icon: <CreditCard size={32} />,
      color: 'bg-indigo-600',
      description: 'Synchronize fiat settlement rails for global payouts.',
      detail: 'AES-256 encrypted link to Stripe Connect'
    },
    CRYPTO: {
      title: 'Web3 Bridge',
      icon: <WalletIcon size={32} />,
      color: 'bg-orange-600',
      description: 'Authorize on-chain signatures and smart contract interactions.',
      detail: 'EVM compatible wallet handshake'
    },
    LOCAL: {
      title: 'Local Ledger',
      icon: <Landmark size={32} />,
      color: 'bg-emerald-600',
      description: 'Direct integration with local banking protocols (SEPA/ACH).',
      detail: 'Institutional grade bank verification'
    }
  }[type];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-500" onClick={onClose} />
      
      <div className="relative bg-white rounded-[48px] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-200">
        <div className="p-10 text-center">
          <div className="flex justify-between items-center mb-10">
            <div className={`w-14 h-14 ${config.color} text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100`}>
              {config.icon}
            </div>
            <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
              <X size={24} />
            </button>
          </div>

          {step === 'INIT' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-4">Initialize {config.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed mb-10 px-6">
                {config.description} You are about to link a new financial authority to this member node.
              </p>
              
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 mb-10 text-left">
                <div className="flex items-center gap-3 text-slate-400 mb-3">
                  <Lock size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Security Protocol</span>
                </div>
                <p className="text-xs font-bold text-slate-600 leading-none">{config.detail}</p>
              </div>

              <button 
                onClick={initiateConnection}
                className="w-full bg-slate-900 text-white py-5 rounded-[24px] font-black uppercase tracking-widest text-xs shadow-2xl hover:bg-indigo-600 hover:-translate-y-1 transition-all active:translate-y-0"
              >
                Establish Secure Link
              </button>
            </div>
          )}

          {(step === 'SECURITY_CHECK' || step === 'HANDSHAKE') && (
            <div className="py-12 flex flex-col items-center">
              <div className="relative mb-10">
                <div className="w-24 h-24 rounded-full border-4 border-slate-100 border-t-indigo-600 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Cpu size={32} className="text-indigo-600 animate-pulse" />
                </div>
              </div>
              <h4 className="text-2xl font-black text-slate-900 mb-2">
                {step === 'SECURITY_CHECK' ? 'Performing Node Audit' : 'Secure Handshake'}
              </h4>
              <p className="text-slate-400 text-sm font-bold uppercase tracking-widest animate-pulse">
                {step === 'SECURITY_CHECK' ? 'Verifying node integrity...' : 'Encrypting protocol tunnel...'}
              </p>
            </div>
          )}

          {step === 'SUCCESS' && (
            <div className="py-12 flex flex-col items-center animate-in zoom-in-95 duration-500">
              <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-8 border border-emerald-100 shadow-xl shadow-emerald-100">
                <CheckCircle2 size={48} strokeWidth={2.5} className="animate-bounce" />
              </div>
              <h4 className="text-3xl font-black text-slate-900 mb-2">Node Linked</h4>
              <p className="text-slate-500 font-medium">Protocol connectivity successfully established.</p>
            </div>
          )}
        </div>

        <div className="bg-slate-50 p-6 flex items-center justify-between border-t border-slate-100">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-emerald-500" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Enterprise Encrypted</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe size={14} className="text-slate-300" />
            <span className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter">Region: Global-Alpha</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GatewayConnector;
