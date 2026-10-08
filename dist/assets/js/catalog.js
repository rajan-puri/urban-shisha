/* Shared preview catalog for homepage and shop; replace with WooCommerce data at conversion. */
(()=>{
const products=[
 {id:'studio-black',brand:'COCOYAYA',name:'COCOYAYA Brando',price:9499,art:0,type:'hookahs',label:'Modern hookah',badge:'The edit',description:'Explore this product alongside the accessories that complete your setup. Product specifications, package contents and compatibility will be confirmed with the live catalog.'},
 {id:'signature-chrome',brand:'COCOYAYA',name:'COCOYAYA Slims Sterling',price:12999,art:1,type:'hookahs',label:'Statement hookah',badge:'Signature',description:'Explore this product alongside the accessories that complete your setup. Product specifications, package contents and compatibility will be confirmed with the live catalog.'},
 {id:'compact-emerald',brand:'Dark Knight',name:'Dark Knight Slash',price:4499,art:2,type:'hookahs',label:'Compact hookah',badge:'Compact',description:'Explore this product alongside the accessories that complete your setup. Product specifications, package contents and compatibility will be confirmed with the live catalog.'},
 {id:'carbon-edition',brand:'COCOYAYA',name:'COCOYAYA Denali Bonzai',price:14999,art:3,type:'hookahs',label:'Statement hookah',description:'Explore this product alongside the accessories that complete your setup. Product specifications, package contents and compatibility will be confirmed with the live catalog.'},
 {id:'phunnel-bowl',brand:'COCOYAYA',name:'American Funnel Bowl',price:1299,art:4,type:'bowls',label:'Ceramic bowl',description:'Explore this product alongside the accessories that complete your setup. Product specifications, package contents and compatibility will be confirmed with the live catalog.'},
 {id:'heat-management',brand:'NaGrani',name:'NaGrani HMD',price:2499,art:5,type:'heat',label:'Heat management',description:'Explore this product alongside the accessories that complete your setup. Product specifications, package contents and compatibility will be confirmed with the live catalog.'},
 {id:'silicone-hose',brand:'VG',name:'VG Big Handle Hose',price:799,art:6,type:'hoses',label:'Hose & mouthpiece',description:'Explore this product alongside the accessories that complete your setup. Product specifications, package contents and compatibility will be confirmed with the live catalog.'},
 {id:'mouthpiece',brand:'VG',name:'VG Small Handle Hose',price:999,art:7,type:'hoses',label:'Compact hose',description:'Explore this product alongside the accessories that complete your setup. Product specifications, package contents and compatibility will be confirmed with the live catalog.'},
 {id:'tongs',brand:'COCOYAYA',name:'COCOYAYA Gold Tongs',price:799,art:8,type:'care',label:'Essential accessory',description:'Explore this product alongside the accessories that complete your setup. Product specifications, package contents and compatibility will be confirmed with the live catalog.'},
 {id:'cleaning-brush',brand:'',name:'Foil Puncher',price:499,art:9,type:'care',label:'Setup tool',description:'Explore this product alongside the accessories that complete your setup. Product specifications, package contents and compatibility will be confirmed with the live catalog.'},
 {id:'coconut-charcoal',brand:'COCOYAYA',name:'COCOYAYA Coconut Coal — 250g / 18 pcs',price:135,art:10,type:'charcoal',label:'Everyday essential',description:'Explore this product alongside the accessories that complete your setup. Product specifications, package contents and compatibility will be confirmed with the live catalog.'},
 {id:'ceramic-duo',brand:'COCOYAYA',name:'COCOYAYA Silicone Bowl',price:2199,art:11,type:'bowls',label:'Ceramic bowls',badge:'New',description:'Explore this product alongside the accessories that complete your setup. Product specifications, package contents and compatibility will be confirmed with the live catalog.'}
];
const imageFrames=[[251,0,767,1254,1254,1254],[140,0,985,1254,1254,1254],[0,71,1254,1088,1254,1254],[173,0,740,1476,1056,1489],[7,116,1230,1084,1254,1254],[7,218,1247,834,1254,1254],[105,18,1018,1235,1254,1254],[74,43,1104,1175,1254,1254],[33,269,1221,769,1254,1254],[0,40,1230,1198,1254,1254],[100,47,1103,1182,1254,1254],[173,20,945,1205,1254,1254]];
const brands=[{"id": "al-fakher", "name": "Al Fakher", "image": "assets/images/brands/brand-1.webp"}, {"id": "nakhla", "name": "Nakhla", "image": "assets/images/brands/brand-2.webp"}, {"id": "serbetli", "name": "Serbetli", "image": "assets/images/brands/brand-3.png"}, {"id": "revoshi", "name": "Revoshi", "image": "assets/images/brands/brand-4.webp"}, {"id": "jibiar", "name": "Jibiar", "image": "assets/images/brands/brand-5.webp"}, {"id": "musthave", "name": "MustHave", "image": "assets/images/brands/brand-6.webp"}];
window.UrbanCatalog={products,brands,imageFrames};

function initBackToTop(){
  const btn=document.getElementById('back-to-top');
  if(!btn||btn.dataset.bttReady)return;
  btn.dataset.bttReady='true';
  let ticking=false;
  const update=()=>{
    const visible=window.scrollY>350;
    btn.classList.toggle('is-visible',visible);
    ticking=false;
  };
  window.addEventListener('scroll',()=>{
    if(!ticking){
      requestAnimationFrame(update);
      ticking=true;
    }
  },{passive:true});
  btn.addEventListener('click',e=>{
    e.preventDefault();
    const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({top:0,behavior:reduce?'instant':'smooth'});
    const topTarget=document.getElementById('top')||document.body;
    if(topTarget){
      topTarget.setAttribute('tabindex','-1');
      topTarget.focus({preventScroll:true});
    }
  });
  update();
}
window.initBackToTop=initBackToTop;
if(typeof document!=='undefined'){
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',initBackToTop);
  }else{
    initBackToTop();
  }
}
})();

