import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { apiFetch } from '@/api/client'
import { ErrorAlert } from './ui.jsx'

const dateFormat = new Intl.DateTimeFormat('es-AR', { dateStyle: 'medium', timeStyle: 'short' })
export default function InquiriesPage() {
  const [params,setParams] = useSearchParams()
  const [result,setResult] = useState(null)
  const [error,setError] = useState(null)
  const [busy,setBusy] = useState(null)
  const [version,setVersion] = useState(0)
  const [notice,setNotice] = useState('')
  const query=params.toString()
  useEffect(()=>{
    let cancelled=false
    apiFetch(`/api/v1/me/inquiries?${query}`)
      .then(data=>{if(!cancelled){setResult(data);setError(null)}})
      .catch(err=>{if(!cancelled)setError(err)})
    return ()=>{cancelled=true}
  },[query,version])
  function filter(key,value) {
    const next=new URLSearchParams(params)
    if(value) next.set(key,value); else next.delete(key)
    if(key!=='page') next.delete('page')
    setResult(null);setError(null);setParams(next)
  }
  async function markRead(id) {
    setBusy(id);setError(null)
    try {
      await apiFetch(`/api/v1/me/inquiries/${id}`,{method:'PATCH',body:{read:true}})
      setNotice('Consulta marcada como leída.')
      if(result.content.length===1 && Number(params.get('page'))>0) filter('page',String(Number(params.get('page'))-1))
      else setVersion(value=>value+1)
    } catch(err){setError(err)} finally {setBusy(null)}
  }
  return <>
    <header className="page-head"><Link className="back-link" to="/panel">← Volver al panel</Link><h1>Consultas recibidas</h1><p className="page-meta">{result?`Tenés ${result.unreadCount} consultas sin leer.`:'Consultas de tus avisos publicados.'}</p></header>
    <div className="inbox-filters"><label className="inbox-check"><input type="checkbox" checked={params.get('unreadOnly')==='true'} onChange={e=>filter('unreadOnly',e.target.checked?'true':'')}/>Solo sin leer</label><button className="btn btn-secondary btn-small" onClick={()=>{setError(null);setVersion(v=>v+1)}}>Actualizar</button></div>
    {notice && <p className="visually-hidden" role="status">{notice}</p>}
    {error && <ErrorAlert title="No pudimos cargar o actualizar las consultas" error={error}/>}
    {!result && !error && <p role="status" className="panel-loading">Cargando consultas…</p>}
    {result?.content.length===0 && <section className="panel-card"><h2>No hay consultas{params.get('unreadOnly')==='true'?' sin leer':''}</h2><p className="muted">Cuando alguien consulte por tus avisos, vas a encontrar su mensaje acá.</p></section>}
    {result?.content.map(item=><article key={item.id} className="panel-card inquiry-card">
      <div className="inquiry-heading"><div><h2>{item.name} {!item.readAt && <span className="inquiry-new">Nueva</span>}</h2><p className="muted inquiry-contact"><a href={`mailto:${item.email}`}>{item.email}</a>{item.phone && <> · <a href={`tel:${item.phone}`}>{item.phone}</a></>}</p></div><time className="muted" dateTime={item.createdAt}>{dateFormat.format(new Date(item.createdAt))}</time></div>
      <p className="muted">Sobre: <Link className="text-link underline" to={`/propiedad/${item.propertyId}`}>{item.propertyTitle}</Link></p>
      <p className="inquiry-message">{item.message}</p>
      {!item.readAt && <button className="btn btn-secondary btn-small" disabled={busy!==null} onClick={()=>markRead(item.id)}>{busy===item.id?'Guardando…':'Marcar como leída'}</button>}
    </article>)}
    {result?.totalPages>1 && <nav className="inbox-pagination" aria-label="Páginas de consultas"><button className="btn btn-secondary" disabled={result.page===0} onClick={()=>filter('page',String(result.page-1))}>Anterior</button><span>{result.page+1} de {result.totalPages}</span><button className="btn btn-secondary" disabled={result.page+1>=result.totalPages} onClick={()=>filter('page',String(result.page+1))}>Siguiente</button></nav>}
  </>
}
