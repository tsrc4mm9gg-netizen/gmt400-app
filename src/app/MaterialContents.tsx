'use client';
import { useEffect, useRef, useState } from 'react';
type Entry = {id:string;label:string;level:number};
export default function MaterialContents({entryId}:{entryId:string}) {
 const navRef=useRef<HTMLElement>(null);const [entries,setEntries]=useState<Entry[]>([]);
 useEffect(()=>{
  const nav=navRef.current,article=nav?.closest('article');if(!nav||!article)return;
  const used=new Set<string>(),restore:(()=>void)[]=[],items:Entry[]=[];
  const prefix='material-'+(entryId.replace(/[^a-z0-9-]/gi,'')||'entry');
  const headings=Array.from(article.querySelectorAll<HTMLElement>('h2,h3')).filter(heading=>!nav.contains(heading)&&heading.textContent?.trim()&&!heading.closest('[hidden],[aria-hidden="true"]'));
  headings.forEach((heading,index)=>{
   const oldId=heading.getAttribute('id'),oldTab=heading.getAttribute('tabindex'),oldMargin=heading.style.scrollMarginTop;
   let id=oldId||'',suffix=index+1;
   if(!id||used.has(id)||document.getElementById(id)!==heading){do{id=prefix+'-'+suffix++;}while(used.has(id)||(document.getElementById(id)&&document.getElementById(id)!==heading));}
   used.add(id);heading.id=id;if(oldTab===null)heading.tabIndex=-1;heading.style.scrollMarginTop='96px';
   items.push({id,label:heading.textContent?.trim()||'',level:heading.tagName==='H3'?3:2});
   restore.push(()=>{if(heading.id!==id)return;if(oldId===null)heading.removeAttribute('id');else heading.setAttribute('id',oldId);if(oldTab===null)heading.removeAttribute('tabindex');else heading.setAttribute('tabindex',oldTab);heading.style.scrollMarginTop=oldMargin;});
  });
  setEntries(items);return()=>restore.forEach(reset=>reset());
 },[entryId]);
 return <nav ref={navRef} aria-label="Spis treści materiału" data-material-outline hidden={entries.length<3} style={{background:'#171d25',color:'#ededed',border:'1px solid #343a43',borderRadius:10,padding:'8px 16px',margin:'16px 0',minWidth:0}}>
  <details><summary style={{minHeight:44,display:'list-item',alignContent:'center',cursor:'pointer',color:'#f2cf85',fontWeight:650}}>Spis treści ({entries.length})</summary>
   <ol style={{paddingLeft:20,margin:'8px 0'}}>{entries.map(entry=><li key={entry.id} style={{marginLeft:entry.level===3?16:0,overflowWrap:'anywhere'}}><a href={'#'+encodeURIComponent(entry.id)} style={{display:'block',minHeight:44,padding:'10px 0',color:'#d0d5dc',textDecoration:'underline'}} onClick={()=>requestAnimationFrame(()=>document.getElementById(entry.id)?.focus({preventScroll:true}))}>{entry.label}</a></li>)}</ol>
  </details>
 </nav>;
}
