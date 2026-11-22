const sh=a=>[...a].sort(()=>Math.random()-.5);
const say=t=>{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang='en-GB';u.rate=.85;speechSynthesis.speak(u)};
const o=(w,k)=>sh([w[k],...sh(W.filter(x=>x!==w)).slice(0,3).map(x=>x[k])]);
const spk=t=>`<button class=spk onclick="event.stopPropagation();say('${t}')">🔊</button>`;
const pool=()=>sh(W).slice(0,LIM);
function quiz(c,qs,re){let i=0,sc=0,ms=[],auto=false;const q$=s=>c.querySelector(s);
const go=()=>{if(i>=qs.length)return fin();const q=qs[i];
c.innerHTML=`<div class=prog><i style="width:${i/qs.length*100}%"></i></div><div class=q>${q.p}</div><div id=o></div><div id=fb></div>`;
if(q.s&&auto)say(q.s);
const done=ok=>{auto=true;if(ok)sc++;else{ms.push(q);q$('#fb').innerHTML=`<div class=ans>✔ ${q.ok}</div>`}if(q.x)say(q.x);setTimeout(()=>{i++;go()},ok?800:1900)};
if(q.t){q$('#o').innerHTML='<input id=in autocomplete=off autocapitalize=off spellcheck=false><button class=btn id=go>OK</button>';
const cc=()=>{const v=q$('#in');if(v.disabled)return;v.disabled=true;done(v.value.trim().toLowerCase()==q.ok.toLowerCase())};
q$('#go').onclick=cc;q$('#in').onkeydown=e=>e.key=='Enter'&&cc()}
else{let l=0;q.opts.forEach(t=>{const b=document.createElement('button');b.className='opt';b.textContent=t;
b.onclick=()=>{if(l)return;l=1;const ok=t==q.ok;b.classList.add(ok?'good':'bad');if(!ok)[...q$('#o').children].find(x=>x.textContent==q.ok).classList.add('good');done(ok)};q$('#o').append(b)})}};
const fin=()=>{c.innerHTML=`<div class=q>${sc} / ${qs.length} 🎉</div><div class=row>${ms.length?'<button class=btn id=r>Повторить ошибки</button>':''}<button class=btn id=a>Ещё раз</button></div>`;
if(ms.length)q$('#r').onclick=()=>quiz(c,sh(ms),re);q$('#a').onclick=re};go()}
function cards(c){let i=0,L=[...W],auto=false;const q$=s=>c.querySelector(s);const sd=()=>{const w=L[i];
c.innerHTML=`<div class=prog><i style="width:${(i+1)/L.length*100}%"></i></div><div class=card id=cd><div class=f><div class=big>${w[0]}</div>${spk(w[0])}<small>нажми, чтобы перевернуть</small></div><div class="f b"><div class=big>${w[1]}</div><div class=ex>${w[2].replace('___','<b>'+w[3]+'</b>')}</div>${spk(w[2].replace('___',w[3]))}</div></div><div class=row><button class=btn id=p>←</button><span>${i+1} / ${L.length}</span><button class=btn id=n>→</button><button class=btn id=s>🔀</button></div>`;
q$('#cd').onclick=()=>q$('#cd').classList.toggle('flip');if(auto)say(w[0]);
q$('#p').onclick=()=>{auto=true;i=(i+L.length-1)%L.length;sd()};q$('#n').onclick=()=>{auto=true;i=(i+1)%L.length;sd()};q$('#s').onclick=()=>{L=sh(L);i=0;sd()}};sd()}
function match(c,re){const ws=sh(W).slice(0,10);let s=null,n=0;c.innerHTML=`<div class=q>Соедини пары</div><div class=mt><div id=a></div><div id=b></div></div><div id=fb></div>`;const q$=x=>c.querySelector(x);
const mk=(id,k)=>sh(ws).forEach(w=>{const b=document.createElement('button');b.className='opt';b.textContent=w[k];
b.onclick=()=>{if(b.disabled)return;if(k==0)say(w[0]);
if(!s||s.k==k){if(s)s.b.classList.remove('sel');s={b,w,k};b.classList.add('sel');return}
if(s.w==w){[b,s.b].forEach(x=>{x.classList.remove('sel');x.classList.add('good');x.disabled=true});s=null;if(++n==ws.length){q$('#fb').innerHTML='<div class=ans>🎉 Все пары найдены! <button class=btn id=m>Ещё раз</button></div>';q$('#m').onclick=re}}
else{const p=s.b;b.classList.add('bad');p.classList.add('bad');s=null;setTimeout(()=>{b.classList.remove('bad');p.classList.remove('bad','sel')},500)}};q$(id).append(b)});
mk('#a',0);mk('#b',1)}
const Z=(f)=>(c,re)=>quiz(c,pool().map(f),re);
const S=[['Карточки',cards],
['EN → RU',Z(w=>({p:`<div class=big>${w[0]}</div>`,s:w[0],opts:o(w,1),ok:w[1]}))],
['RU → EN',Z(w=>({p:`<div class=big>${w[1]}</div>`,opts:o(w,0),ok:w[0]}))],
['Слушаем',Z(w=>({p:spk(w[0]).replace('class=spk','class="spk lg"'),s:w[0],opts:o(w,0),ok:w[0]}))],
['Пишем',Z(w=>({t:1,p:`<div class=hint>напиши по-английски</div><div class=big>${w[1]}</div>${spk(w[0])}`,ok:w[0],x:w[0]}))],
['Пропуски',Z(w=>({p:`<div class=hint>${w[1]}</div><div class=sen>${w[2].replace('___','<span class=blank>_____</span>')}</div>`,opts:o(w,3),ok:w[3],x:w[2].replace('___',w[3])}))],
['Пары',match]];
const main=document.getElementById('app'),nav=document.getElementById('nav');
S.forEach(([t,f],i)=>{nav.insertAdjacentHTML('beforeend',`<a href="#s${i}">${t}</a>`);
const s=document.createElement('section');s.id='s'+i;s.innerHTML=`<h2>${i+1}. ${t}</h2><div class=box></div>`;main.append(s);
const box=s.querySelector('.box'),run=()=>f(box,run);run()});