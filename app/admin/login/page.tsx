'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabase } from '@/lib/supabase';

export default function AdminLoginPage(){
 const router=useRouter(); const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [error,setError]=useState(''); const [busy,setBusy]=useState(false);
 async function submit(e:React.FormEvent){e.preventDefault();setBusy(true);setError('');try{const sb=getSupabase();const {data,error}=await sb.auth.signInWithPassword({email,password});if(error)throw error;if(data.user?.app_metadata?.role!=='admin'){await sb.auth.signOut();throw new Error('This account does not have SOMSOA administrator access.');}router.replace('/admin');}catch(err){setError(err instanceof Error?err.message:'Unable to sign in.');}finally{setBusy(false)}}
 return <div style={{maxWidth:430,margin:'8vh auto',padding:28,background:'#fff',border:'1px solid #e8e3d9',borderRadius:14}}><p className="admin-kicker">SOMSOA · PRIVATE ACCESS</p><h1 className="admin-title">Welcome back</h1><p className="admin-muted">Sign in to manage your store.</p><form onSubmit={submit} style={{display:'grid',gap:13,marginTop:25}}><label>Email address<input className="admin-input" style={{display:'block',width:'100%',marginTop:7}} type="email" autoComplete="username" required value={email} onChange={e=>setEmail(e.target.value)}/></label><label>Password<input className="admin-input" style={{display:'block',width:'100%',marginTop:7}} type="password" autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)}/></label><button className="admin-button" disabled={busy}>{busy?'Signing in…':'Sign in'}</button></form>{error&&<p className="admin-error">{error}</p>}</div>
}
