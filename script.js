(() => {
const menu=document.getElementById('menu'),nav=document.getElementById('nav');
menu?.addEventListener('click',()=>{nav.classList.toggle('open');menu.setAttribute('aria-expanded',nav.classList.contains('open')?'true':'false')});
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
const nodes=document.querySelectorAll('.section,.project,.hero-copy,.hero-art,.facts,.stack-group,.journey-copy>div');
nodes.forEach(n=>n.classList.add('reveal'));
if('IntersectionObserver'in window&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.12});
nodes.forEach(n=>io.observe(n));
}else nodes.forEach(n=>n.classList.add('visible'));
})();