import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail } from 'lucide-react';

export function AuthView({ onLogin, onCreateAccount }: { onLogin: (email: string) => void, onCreateAccount: () => void }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  
  const handleLogin = (provider: string) => {
    setError('');
    
    // Fallback social emails
    let loginEmail = email;
    if (provider !== 'email') {
      if (!loginEmail) {
        setError(`Por favor, informe seu e-mail para usar o ${provider}.`);
        return;
      }
    }
    
    if (!loginEmail || !loginEmail.includes('@')) {
      setError('Por favor, informe um e-mail válido.');
      return;
    }

    try {
      const usersData = localStorage.getItem('tea_users');
      const users = usersData ? JSON.parse(usersData) : [];
      if (!users.includes(loginEmail)) {
        setError('E-mail não encontrado. Por favor, crie uma conta (Boas-vindas).');
        return;
      }
      
      localStorage.setItem('currentUserEmail', loginEmail);
      localStorage.setItem('isLoggedIn', 'true');
      onLogin(loginEmail);
    } catch(e) {
      setError('Erro ao fazer login.');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen bg-[#060b13] text-white flex flex-col items-center justify-center p-6 pb-24 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-blue/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent-purple/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="z-10 w-full max-w-sm flex flex-col gap-8">
        <div className="text-center">
          <h1 className="text-3xl font-poppins font-bold mb-2">TEA SoundScapes</h1>
          <p className="text-gray-400 text-sm">Faça login para continuar</p>
        </div>
        
        <div className="glass-card p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs text-gray-400 font-medium ml-1">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input type="email" value={email} onChange={e => {setEmail(e.target.value); setError('');}} placeholder="seu@email.com" className={`w-full bg-white/5 border ${error ? 'border-red-500/50' : 'border-white/10'} rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-accent-blue/50 transition-colors`} />
            </div>
            {error && <p className="text-red-500 text-xs ml-1 font-medium">{error}</p>}
          </div>
          <button onClick={() => handleLogin('email')} className="glass-card-active py-3 rounded-xl font-medium mt-2 active:scale-95 transition-transform text-white">
            Acessar com E-mail
          </button>
          
          <div className="flex items-center gap-2 my-2 w-full">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-[10px] text-gray-500 font-medium uppercase min-w-max">Ou entre com e-mail acima e</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => handleLogin('Google')} className="glass-card flex items-center justify-center py-2.5 rounded-xl border border-white/5 hover:bg-white/5 active:scale-95 transition-all text-sm gap-2">
              <img src="https://cdn-icons-png.flaticon.com/512/300/300221.png" className="w-4 h-4 opacity-80" /> Google
            </button>
            <button onClick={() => handleLogin('Facebook')} className="glass-card flex items-center justify-center py-2.5 rounded-xl border border-white/5 hover:bg-white/5 active:scale-95 transition-all text-sm gap-2">
              <img src="https://cdn-icons-png.flaticon.com/512/5968/5968764.png" className="w-4 h-4 opacity-80" /> Facebook
            </button>
            <button onClick={() => handleLogin('Outlook')} className="glass-card flex items-center justify-center py-2.5 rounded-xl border border-white/5 hover:bg-white/5 active:scale-95 transition-all text-sm gap-2 col-span-2">
              <img src="https://cdn-icons-png.flaticon.com/512/732/732221.png" className="w-4 h-4 opacity-80" /> Outlook
            </button>
          </div>
        </div>
        
        <div className="text-center mt-2">
          <p className="text-sm text-gray-400">Não tem uma conta?</p>
          <button onClick={onCreateAccount} className="text-sm text-accent-blue font-medium mt-1 active:opacity-70 transition-opacity">
            Criar conta (Boas-vindas)
          </button>
        </div>
      </div>
    </motion.div>
  );
}
