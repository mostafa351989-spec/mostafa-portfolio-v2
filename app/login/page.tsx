'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
    if (res.ok) router.push('/admin');
    else alert('بيانات غير صحيحة');
  };
  return (<div className="min-h-screen flex items-center justify-center bg-black"><form onSubmit={handleSubmit} className="bg-white/10 p-8 rounded-xl w-96"><h1 className="text-2xl text-white mb-6">تسجيل الدخول</h1><input type="email" placeholder="البريد" value={email} onChange={e=>setEmail(e.target.value)} className="w-full p-2 mb-4 bg-black/50 rounded text-white" /><input type="password" placeholder="كلمة المرور" value={password} onChange={e=>setPassword(e.target.value)} className="w-full p-2 mb-6 bg-black/50 rounded text-white" /><button type="submit" className="w-full bg-indigo-600 py-2 rounded">دخول</button></form></div>);
}
