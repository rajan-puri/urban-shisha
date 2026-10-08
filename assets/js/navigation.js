/* Account disclosure: hover for mice, click/tap and keyboard; no login-state guesses. */
(()=>{
'use strict';
const entry=document.querySelector('.account-entry'),trigger=document.querySelector('#account-trigger'),panel=document.querySelector('#account-shortcuts');
if(!entry||!trigger||!panel)return;
let hideTimer,reason='',queued=false;
function position(){if(panel.hidden)return;panel.style.setProperty('--account-menu-shift','0px');const anchor=entry.getBoundingClientRect();panel.style.setProperty('--account-menu-available',`${Math.max(100,innerHeight-anchor.bottom-30)}px`);const rect=panel.getBoundingClientRect();const shift=rect.left<14?14-rect.left:rect.right>innerWidth-14?innerWidth-14-rect.right:0;panel.style.setProperty('--account-menu-shift',`${shift}px`);}
function close(restoreFocus=false){clearTimeout(hideTimer);panel.hidden=true;trigger.setAttribute('aria-expanded','false');trigger.setAttribute('aria-label','Open My Account menu');reason='';if(restoreFocus)trigger.focus();}
function closeOtherNavigation(){const mega=document.querySelector('#mega-toggle[aria-expanded="true"]');if(mega)mega.click();const mobile=document.querySelector('.mobile-toggle[aria-expanded="true"]');if(mobile)mobile.click();}
function open(source){clearTimeout(hideTimer);if(panel.hidden)closeOtherNavigation();reason=source;panel.hidden=false;trigger.setAttribute('aria-expanded','true');trigger.setAttribute('aria-label','Close My Account menu');position();}
trigger.addEventListener('click',()=>{if(!panel.hidden&&reason!=='hover')close();else open('click');});
trigger.addEventListener('keydown',e=>{if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();open('keyboard');const links=[...panel.querySelectorAll('a')];(e.key==='ArrowUp'?links.at(-1):links[0]).focus();}});
entry.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'&&matchMedia('(hover:hover) and (pointer:fine)').matches){clearTimeout(hideTimer);if(panel.hidden)open('hover');}});
entry.addEventListener('pointerleave',e=>{if(e.pointerType!=='mouse'||reason!=='hover')return;hideTimer=setTimeout(()=>{if(!entry.contains(document.activeElement))close();},170);});
entry.addEventListener('focusout',e=>{if(!entry.contains(e.relatedTarget))close();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden){e.preventDefault();e.stopPropagation();close(true);}},true);
document.addEventListener('click',e=>{if(!entry.contains(e.target))close();});
panel.addEventListener('click',e=>{if(e.target.closest('a'))close();});
for(const other of document.querySelectorAll('#mega-toggle,.mobile-toggle')){other.addEventListener('click',()=>close());other.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')close();});}
function queuePosition(){if(queued||panel.hidden)return;queued=true;requestAnimationFrame(()=>{position();queued=false;});}
window.addEventListener('resize',queuePosition);window.addEventListener('scroll',queuePosition,{passive:true});window.addEventListener('pageshow',()=>close());
})();
