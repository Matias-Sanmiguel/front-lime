import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch } from '@/api/client'
import { useAuth } from '@/auth/AuthContext.jsx'
import { ErrorAlert, Notice } from './ui.jsx'
export default function ProfilePage() {
 const {token,login}=useAuth()
 const [profile,setProfile]=useState(null),[error,setError]=useState(null),[notice,setNotice]=useState(''),[busy,setBusy]=useState(false)
 useEffect(()=>{let active=true;apiFetch('/api/v1/me').then(p=>{if(active)setProfile(p)}).catch(e=>{if(active)setError(e)});return()=>{active=false}},[])
 async function submit(event){
  event.preventDefault();setBusy(true);setError(null);setNotice('')
  const data=new FormData(event.currentTarget),body={name:data.get('name'),agencyName:data.get('agencyName') || null}
  if(data.get('newPassword')) Object.assign(body,{currentPassword:data.get('currentPassword'),newPassword:data.get('newPassword')})
  try {const updated=await apiFetch('/api/v1/me',{method:'PATCH',body});setProfile(updated);login(token,updated);setNotice('Perfil actualizado.');event.target.reset()}catch(e){setError(e)}finally{setBusy(false)}
 }
 return <><header className="page-head"><Link to="/" className="back-link">← Volver al inicio</Link><h1>Mi perfil</h1><p className="page-meta">Actualizá tus datos de contacto y tu contraseña.</p></header>{error && <ErrorAlert title="No pudimos actualizar el perfil" error={error}/>} {notice && <Notice>{notice}</Notice>}{profile?<form className="panel-card property-form" onSubmit={submit}><div className="field"><label htmlFor="profile-name">Nombre</label><input id="profile-name" name="name" defaultValue={profile.name} required maxLength={100}/></div><p className="muted">Email: {profile.email}</p>{profile.role==='AGENCY' && <div className="field"><label htmlFor="profile-agency">Inmobiliaria</label><input id="profile-agency" name="agencyName" defaultValue={profile.agencyName} required maxLength={150}/></div>}<h2>Cambiar contraseña</h2><p className="muted">Dejá estos campos vacíos para conservar tu contraseña.</p><div className="field"><label htmlFor="current-password">Contraseña actual</label><input id="current-password" name="currentPassword" type="password" autoComplete="current-password"/></div><div className="field"><label htmlFor="new-password">Nueva contraseña</label><input id="new-password" name="newPassword" type="password" minLength={8} maxLength={72} autoComplete="new-password"/></div><button className="btn btn-primary" disabled={busy}>{busy?'Guardando…':'Guardar perfil'}</button></form>:!error&&<p role="status">Cargando perfil…</p>}</>
}
