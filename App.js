import React, { useEffect, useState } from 'react';

const defaultCurriculum = [
  { id: 'interfaccia', titolo: 'Interfaccia e navigazione', lezioni: [ {id:'ui', titolo:'Panoramica', desc:'Interfaccia, pannelli e preferenze.'}, {id:'nav', titolo:'Navigazione 3D', desc:'Zoom, pan e rotazione.'} ] },
  { id: 'modellazione', titolo: 'Modellazione', lezioni: [ {id:'box', titolo:'Box Modeling', desc:'Estrusioni e modificatori.'}, {id:'sculpt', titolo:'Sculpting', desc:'Scolpire forme organiche.'} ] },
  { id: 'shading', titolo: 'Materiali e Shading', lezioni: [ {id:'base', titolo:'Materiali base', desc:'Principled BSDF'}, {id:'proc', titolo:'Materiali procedurali', desc:'Nodi avanzati'} ] }
];

export default function App(){
  const [curriculum] = useState(defaultCurriculum);
  const [selectedModule, setSelectedModule] = useState(curriculum[0]);
  const [selectedLesson, setSelectedLesson] = useState(curriculum[0].lezioni[0]);
  const [progress, setProgress] = useState({});
  const [isFull, setIsFull] = useState(false);

  // load progress from electron store if available, otherwise localStorage fallback
  useEffect(() => {
    async function load() {
      try {
        if (window.electronAPI && window.electronAPI.loadProgress) {
          const p = await window.electronAPI.loadProgress();
          setProgress(p || {});
        } else {
          const p = JSON.parse(localStorage.getItem('bt_progress')||'{}');
          setProgress(p);
        }
      } catch(e){ console.error(e); }
    }
    load();
  }, []);

  // save progress both to electron store and localStorage
  useEffect(() => {
    try {
      if (window.electronAPI && window.electronAPI.saveProgress) {
        window.electronAPI.saveProgress(progress);
      }
      localStorage.setItem('bt_progress', JSON.stringify(progress));
    } catch(e){}
  }, [progress]);

  const markDone = (moduleId, lessonId) => {
    const key = `${moduleId}:${lessonId}`;
    setProgress(prev => ({...prev, [key]: true}));
  };

  const toggleFullscreen = async () => {
    if (window.electronAPI && window.electronAPI.toggleFullscreen) {
      const newState = await window.electronAPI.toggleFullscreen();
      setIsFull(newState);
    } else {
      // fallback browser fullscreen
      const el = document.documentElement;
      if (!document.fullscreenElement) { el.requestFullscreen?.(); setIsFull(true); }
      else { document.exitFullscreen?.(); setIsFull(false); }
    }
  };

  return (
    <div style={{display:'flex',height:'100vh'}}>
      <aside style={{width:240,background:'#111',color:'#fff',padding:16,overflow:'auto'}}>
        <h2>Blender Tutor</h2>
        <div style={{marginTop:8}}>
          {curriculum.map(m=>(
            <div key={m.id} style={{padding:6,cursor:'pointer',background:selectedModule.id===m.id? '#222':''}} onClick={()=>{setSelectedModule(m); setSelectedLesson(m.lezioni[0]);}}>
              {m.titolo}
            </div>
          ))}
        </div>
        <div style={{position:'absolute',bottom:16,left:16,right:16,color:'#ccc'}}>
          <button onClick={toggleFullscreen} style={{width:'100%',padding:8,marginTop:8}}> {isFull ? 'Esci Schermo Intero' : 'Schermo Intero'} </button>
          <div style={{marginTop:8,fontSize:12}}>Lezioni completate: {Object.keys(progress).length}</div>
        </div>
      </aside>
      <main style={{flex:1,display:'flex'}}>
        <div style={{width:360,background:'#f4f4f4',padding:16,overflow:'auto'}}>
          <h3>Lezioni</h3>
          {selectedModule.lezioni.map(l=>(
            <div key={l.id} style={{padding:8,marginBottom:8,background:selectedLesson.id===l.id? '#ddd':'#fff',cursor:'pointer'}} onClick={()=>setSelectedLesson(l)}>
              <div style={{fontWeight:600}}>{l.titolo}</div>
              <div style={{fontSize:13,color:'#333'}}>{l.desc}</div>
            </div>
          ))}
        </div>
        <section style={{flex:1,padding:20,overflow:'auto'}}>
          <h2>{selectedLesson.titolo}</h2>
          <p>{selectedLesson.desc}</p>
          <div style={{marginTop:12}}>
            <button onClick={()=>markDone(selectedModule.id, selectedLesson.id)} style={{padding:'8px 12px'}}>Segna come completata</button>
          </div>
          <div style={{marginTop:20}}>
            <model-viewer src="" alt="Anteprima modello" auto-rotate camera-controls style={{width:'100%',height:360}}></model-viewer>
          </div>
        </section>
      </main>
    </div>
  );
}
