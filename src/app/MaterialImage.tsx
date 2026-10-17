'use client';
import {useEffect,useRef,useState,type CSSProperties} from 'react';
const button:CSSProperties={minHeight:44,padding:'10px 14px',border:'1px solid #596371',borderRadius:7,background:'#171d25',color:'#f2cf85',fontSize:16};
function safe(src:string){try{const url=new URL(src,'https://example.invalid');return ['http:','https:'].includes(url.protocol)&&(!src.startsWith('/')||/^\/(?![\\/])/.test(src));}catch{return false;}}
export default function MaterialImage({src,caption=''}:{src:string;caption?:string}){
 const openerRef=useRef<HTMLButtonElement>(null),closeRef=useRef<HTMLButtonElement>(null),thumbnailRef=useRef<HTMLImageElement>(null);
 const [zoom,setZoom]=useState(100),[failedSource,setFailedSource]=useState<string|null>(null),[open,setOpen]=useState(false);
 const failed=failedSource===src;
 useEffect(()=>{setZoom(100);setOpen(false);const image=thumbnailRef.current;if(image?.complete&&image.naturalWidth===0)setFailedSource(src);},[src]);
 useEffect(()=>{if(!open)return;const previous=document.body.style.overflow;const previousActive=document.activeElement as HTMLElement|null;document.body.style.overflow='hidden';closeRef.current?.focus();function onKeyDown(event:KeyboardEvent){if(event.key==='Escape'){event.preventDefault();setOpen(false);}}document.addEventListener('keydown',onKeyDown);return()=>{document.body.style.overflow=previous;document.removeEventListener('keydown',onKeyDown);previousActive?.focus?.();};},[open]);
 function markFailed(){setFailedSource(src);setOpen(false);}
 if(!safe(src))return <p>Ilustracja ma niedostępny adres.</p>;
 return <figure data-material-image style={{margin:'16px 0',minWidth:0,background:'#171d25',color:'#ededed',padding:12,border:'1px solid #343a43',borderRadius:10}}>
  {failed?<p role="status">Nie udało się wczytać ilustracji. Sprawdź plik źródłowy.</p>:<button ref={openerRef} type="button" aria-label="Powiększ ilustrację" onClick={()=>{setZoom(100);setOpen(true);}} style={{display:'block',width:'100%',padding:0,border:'1px solid #596371',borderRadius:7,background:'#101317',cursor:'zoom-in'}}><img ref={thumbnailRef} src={src} alt={caption||'Ilustracja z materiału Notion'} loading="lazy" onError={markFailed} style={{display:'block',width:'100%',height:'auto',maxHeight:480,objectFit:'contain'}}/></button>}
  {caption&&<figcaption style={{color:'#d0d5dc',lineHeight:1.6,marginTop:10,overflowWrap:'anywhere'}}>{caption}</figcaption>}
  <p style={{color:'#bdc6d2',fontSize:13,margin:'8px 0'}}>Ilustracja z materiału Notion. Obecność w materiale nie potwierdza zgodności z konkretnym autem.</p>
  <a href={src} target="_blank" rel="noopener noreferrer" style={{color:'#f2cf85',display:'inline-block',minHeight:44,padding:'10px 0'}}>Otwórz plik źródłowy</a>
  {open&&<div role="dialog" aria-modal="true" aria-label="Powiększona ilustracja" style={{position:'fixed',inset:0,zIndex:1000,display:'grid',placeItems:'center',padding:16,background:'#000b'}}>
   <div style={{boxSizing:'border-box',width:'min(96vw,1100px)',maxWidth:'96vw',maxHeight:'92dvh',overflow:'auto',padding:16,border:'1px solid #596371',borderRadius:10,background:'#101317',color:'#fafafa',boxShadow:'0 0 0 100vmax #000b'}}>
    <div style={{display:'flex',flexWrap:'wrap',gap:8,alignItems:'center',marginBottom:12}}><button ref={closeRef} type="button" style={button} onClick={()=>setOpen(false)}>Zamknij podgląd</button><button type="button" style={button} aria-label="Zmniejsz powiększenie" disabled={zoom<=100} onClick={()=>setZoom(value=>Math.max(100,value-50))}>−</button><button type="button" style={button} aria-label="Zwiększ powiększenie" disabled={zoom>=300} onClick={()=>setZoom(value=>Math.min(300,value+50))}>+</button><span aria-live="polite">Powiększenie: {zoom}%</span></div>
    <div style={{maxHeight:'65dvh',overflow:'auto',minWidth:0}}><img src={src} alt={caption||'Ilustracja z materiału Notion'} onError={markFailed} style={{display:'block',width:zoom+'%',maxWidth:'none',height:'auto'}}/></div>
    {caption&&<p style={{color:'#d0d5dc',lineHeight:1.6,overflowWrap:'anywhere',marginTop:12}}>{caption}</p>}
   </div>
  </div>}
 </figure>;
}
