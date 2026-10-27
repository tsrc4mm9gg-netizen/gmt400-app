'use client';
import {useEffect,useRef,useState,type CSSProperties} from 'react';
const button:CSSProperties={minHeight:44,padding:'10px 14px',border:'1px solid rgba(255,255,255,.22)',borderRadius:7,background:'var(--card-gradient)',color:'var(--accent-soft)',fontSize:16};
function safe(src:string){try{const url=new URL(src,'https://example.invalid');return ['http:','https:'].includes(url.protocol)&&(!src.startsWith('/')||/^\/(?![\\/])/.test(src));}catch{return false;}}
export default function MaterialImage({src,caption=''}:{src:string;caption?:string}){
 const dialogRef=useRef<HTMLDialogElement>(null),thumbnailRef=useRef<HTMLImageElement>(null);
 const [zoom,setZoom]=useState(100),[failedSource,setFailedSource]=useState<string|null>(null),[open,setOpen]=useState(false);
 const failed=failedSource===src;
 useEffect(()=>{setZoom(100);if(dialogRef.current?.open)dialogRef.current.close();const image=thumbnailRef.current;if(image?.complete&&image.naturalWidth===0)setFailedSource(src);},[src]);
 useEffect(()=>{if(!open)return;const previous=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{document.body.style.overflow=previous;};},[open]);
 function markFailed(){setFailedSource(src);if(dialogRef.current?.open)dialogRef.current.close();}
 if(!safe(src))return <p>Ilustracja ma niedostępny adres.</p>;
 function show(){const dialog=dialogRef.current;if(dialog&&typeof dialog.showModal==='function'){setZoom(100);dialog.showModal();setOpen(true);}else window.open(src,'_blank','noopener,noreferrer');}
 return <figure data-material-image style={{margin:'16px 0',minWidth:0,background:'var(--card-gradient)',color:'#ededed',padding:12,border:'1px solid rgba(255,255,255,.14)',borderRadius:10}}>
  {failed?<p role="status">Nie udało się wczytać ilustracji. Sprawdź plik źródłowy.</p>:<button type="button" aria-label="Powiększ ilustrację" onClick={show} style={{display:'block',width:'100%',padding:0,border:'1px solid rgba(255,255,255,.22)',borderRadius:7,background:'#0d0d0e',cursor:'zoom-in'}}><img ref={thumbnailRef} src={src} alt={caption||'Ilustracja z materiału Notion'} loading="lazy" onError={markFailed} style={{display:'block',width:'100%',height:'auto',maxHeight:480,objectFit:'contain'}}/></button>}
  {caption&&<figcaption style={{color:'#d0d5dc',lineHeight:1.6,marginTop:10,overflowWrap:'anywhere'}}>{caption}</figcaption>}
  <p style={{color:'#bdc6d2',fontSize:13,margin:'8px 0'}}>Ilustracja z materiału Notion. Obecność w materiale nie potwierdza zgodności z konkretnym autem.</p>
  <a href={src} target="_blank" rel="noopener noreferrer" style={{color:'var(--accent-soft)',display:'inline-block',minHeight:44,padding:'10px 0'}}>Otwórz plik źródłowy</a>
  <dialog ref={dialogRef} aria-label="Powiększona ilustracja" onClose={()=>{setOpen(false);setZoom(100);}} style={{boxSizing:'border-box',width:'min(96vw,1100px)',maxWidth:'96vw',maxHeight:'92dvh',margin:'auto',padding:16,border:'1px solid rgba(255,255,255,.22)',borderRadius:10,background:'#0d0d0e',color:'#fafafa',boxShadow:'0 0 0 100vmax #000b'}}>
   <div style={{display:'flex',flexWrap:'wrap',gap:8,alignItems:'center',marginBottom:12}}><button type="button" style={button} onClick={()=>dialogRef.current?.close()}>Zamknij podgląd</button><button type="button" style={button} aria-label="Zmniejsz powiększenie" disabled={zoom<=100} onClick={()=>setZoom(value=>Math.max(100,value-50))}>−</button><button type="button" style={button} aria-label="Zwiększ powiększenie" disabled={zoom>=300} onClick={()=>setZoom(value=>Math.min(300,value+50))}>+</button><span aria-live="polite">Powiększenie: {zoom}%</span></div>
   <div style={{maxHeight:'65dvh',overflow:'auto',minWidth:0}}>{open&&<img src={src} alt={caption||'Ilustracja z materiału Notion'} onError={markFailed} style={{display:'block',width:zoom+'%',maxWidth:'none',height:'auto'}}/>}</div>
   {caption&&<p style={{color:'#d0d5dc',lineHeight:1.6,overflowWrap:'anywhere',marginTop:12}}>{caption}</p>}
  </dialog>
 </figure>;
}
