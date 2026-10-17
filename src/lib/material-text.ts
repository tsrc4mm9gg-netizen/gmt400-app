export type TextBlock={kind:'heading'|'paragraph';text:string};
export type ListBlock={kind:'list';ordered:boolean;items:{text:string;value?:number}[]};
export type MaterialBlock=TextBlock|ListBlock;
export const plainInline=(text:string)=>text.replace(/\*\*([^*\n]+)\*\*/g,'$1');
export function parseMaterialText(text:string):MaterialBlock[]{
 const blocks:MaterialBlock[]=[];let paragraph:TextBlock|null=null,list:ListBlock|null=null;
 for(const raw of text.replace(/<br\s*\/?>/gi,'\n').replace(/\r\n?/g,'\n').split('\n')){
  const line=raw.trim();if(!line){paragraph=null;list=null;continue;}
  const bold=/^\*\*([^*]+)\*\*\s*$/.exec(line),markdown=/^#{1,3}\s+(.+)$/.exec(line);
  if(bold||markdown){blocks.push({kind:'heading',text:(bold||markdown)![1]});paragraph=null;list=null;continue;}
  const numbered=/^(\d{1,3})[.)]\s+(.+)$/.exec(line),bullet=/^[-*]\s+(.+)$/.exec(line);
  if(numbered||bullet){const ordered=!!numbered;if(!list||list.ordered!==ordered){list={kind:'list',ordered,items:[]};blocks.push(list);}list.items.push(numbered?{text:numbered[2],value:Number(numbered[1])}:{text:bullet![1]});paragraph=null;continue;}
  list=null;if(paragraph)paragraph.text+='\n'+raw;else{paragraph={kind:'paragraph',text:raw};blocks.push(paragraph);}
 }
 return blocks;
}
