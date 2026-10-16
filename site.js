(function(){
var d=document,de=d.documentElement;
/* ---------- Прелоадер ---------- */
var pre=d.getElementById('pre');var rq=[];function onReady(f){if(de.classList.contains('ready'))f();else rq.push(f);}
function endPre(){
  if(!pre||pre.classList.contains('out'))return;
  pre.classList.add('out');
  try{sessionStorage.setItem('swek_intro','1');}catch(e){}
  setTimeout(function(){pre.style.display='none';de.classList.add('ready');rq.forEach(function(f){f();});},700);
}
if(pre&&!de.classList.contains('nopre')){
  var fr=pre.querySelector('iframe');if(fr)fr.src=fr.getAttribute('data-src');
  var started=false;
  function go(){if(started)return;started=true;setTimeout(endPre,6400);}
  if(fr){fr.addEventListener('load',go);setTimeout(go,2500);}
  var sk=d.getElementById('preSkip');if(sk)sk.addEventListener('click',endPre);
  addEventListener('keydown',function(e){if(e.key==='Escape')endPre();});
  d.body.style.overflow='hidden';
  var o=new MutationObserver(function(){if(pre.classList.contains('out'))d.body.style.overflow='';});
  o.observe(pre,{attributes:true});
}else{de.classList.add('ready');}
/* ---------- Появление при прокрутке ---------- */
var els=[].slice.call(d.querySelectorAll('.rv'));
onReady(function(){
if('IntersectionObserver' in window){
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{rootMargin:'0px 0px -8% 0px',threshold:.06});
  els.forEach(function(e,i){e.style.transitionDelay=((i%4)*70)+'ms';io.observe(e);});
}else els.forEach(function(e){e.classList.add('in');});
});
/* ---------- Счётчики ---------- */
var cs=[].slice.call(d.querySelectorAll('[data-count]'));
if('IntersectionObserver' in window&&cs.length){
  var co=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;co.unobserve(e.target);
    var el=e.target,to=parseFloat(el.getAttribute('data-count')),t0=performance.now(),D=1400;
    (function f(n){var k=Math.min(1,(n-t0)/D),v=to*(1-Math.pow(1-k,3));el.textContent=Math.round(v);if(k<1)requestAnimationFrame(f);})(t0);
  });},{threshold:.4});
  cs.forEach(function(e){co.observe(e);});
}
/* ---------- Живой профиль толщины (главная) ---------- */
var lp=d.getElementById('liveProfile');
if(lp){
  var path=lp.querySelector('.lp-path'),dot=lp.querySelector('.lp-dot'),car=lp.querySelector('.lp-car'),stem=lp.querySelector('.lp-stem'),rd=d.getElementById('lpRead'),pos=d.getElementById('lpPos');
  var X=function(t){return 40+t*820;},reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
  function dev(t,ph){return 2.4*Math.sin(2*Math.PI*1.25*t+0.5+ph)+0.9*Math.sin(2*Math.PI*4*t+1.2+ph*1.7)+0.35*Math.sin(2*Math.PI*9*t+ph*3);}
  function frame(ms){
    var ph=reduce?0:ms/2600,s='';
    for(var i=0;i<=120;i++){var t=i/120;s+=(i?'L':'M')+X(t).toFixed(1)+' '+(140-dev(t,ph)*26).toFixed(1)+' ';}
    path.setAttribute('d',s);
    var tc=reduce?.38:(0.5+0.5*Math.sin(ms/3400-1.2)),x=X(tc),y=140-dev(tc,ph)*26;
    dot.setAttribute('cx',x);dot.setAttribute('cy',y);car.setAttribute('x',x-18);stem.setAttribute('x1',x);stem.setAttribute('x2',x);stem.setAttribute('y2',y);
    var v=dev(tc,ph);rd.textContent=(v>=0?'+':'−')+Math.abs(v).toFixed(1).replace('.',',')+' %';pos.textContent=Math.round(tc*100)+' % ширины';
    if(!reduce)requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
/* ---------- Мобильное меню ---------- */
var bt=d.getElementById('navBtn'),nv=d.getElementById('navMain');
if(bt&&nv)bt.addEventListener('click',function(){nv.classList.toggle('open');bt.setAttribute('aria-expanded',nv.classList.contains('open'));});
})();
