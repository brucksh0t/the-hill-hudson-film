// The Hill: film concept. Facts: hudsonvalleyweddings.net. No availability data is published,
// so an in-season date is always "Lisa confirms", never "open" or "booked".
(function(){
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var G=window.gsap,ST=window.ScrollTrigger,motion=!RM&&!!G&&!!ST;
  var root=document.documentElement;
  if(!motion)root.classList.remove('motion');
  if(motion){G.registerPlugin(ST);ST.config({ignoreMobileResize:true});}

  /* ---------- date checker (logic and copy unchanged from the QA-passed version) ---------- */
  var f=document.getElementById('checker');
  var out=f.querySelector('[data-results]'),send=f.querySelector('[data-send]');
  var gout=f.querySelector('[data-gout]'),gnote=f.querySelector('[data-gnote]');
  var DAYS=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  var MON=['January','February','March','April','May','June','July','August','September','October','November','December'];
  function parse(v){var p=v.split('-');return new Date(Date.UTC(+p[0],p[1]-1,+p[2]));}
  function label(d){return DAYS[d.getUTCDay()]+', '+MON[d.getUTCMonth()]+' '+d.getUTCDate()+', '+d.getUTCFullYear();}
  function check(v){
    var d=parse(v);if(isNaN(d))return null;var m=d.getUTCMonth(),y=d.getUTCFullYear(),dow=d.getUTCDay();
    if(y!==2027)return {cls:'closed',t:label(d)+': this checker covers 2027 only. Call to confirm other years.'};
    if(m<4||m>9)return {cls:'closed',t:label(d)+': outside the May–October season The Hill publishes.'};
    var wk=(dow===0||dow>=5)?' A weekend date.':' A weekday. Ask whether weekdays are offered.';
    return {cls:'later',t:label(d)+': in season.'+wk+' Availability not published. Lisa confirms.'};
  }
  function guestText(g){return g<75?'Fewer than 75 guests. The Hill’s stated range is 75–300, so call to confirm smaller weddings.':g>300?'More than 300 guests. The Hill’s stated range is 75–300, so call to confirm.':g+' guests fits the barn’s listed 75–300.';}
  var ready=false,sun=document.querySelector('.sun__disc');
  function update(){
    var rows=[],lines=[];
    ['d1','d2','d3'].forEach(function(n,i){
      var v=f.elements[n].value,card=f.querySelector('[data-card="'+n+'"]');card.classList.remove('is-in','is-out');
      if(!v)return;var r=check(v);if(!r)return;
      card.classList.add(r.cls==='later'?'is-in':'is-out');
      var nm=i?'Alternate '+i:'First choice';
      rows.push('<li><span class="dot dot--'+r.cls+'" aria-hidden="true"></span><span><b>'+nm+':</b> '+r.t+'</span></li>');
      var flag=r.cls==='closed'?(/2027 only/.test(r.t)?' (outside 2027, which this request covers)':' (outside the May–October season)'):'';
      lines.push('- '+nm+': '+label(parse(v))+flag);
    });
    var g=parseInt(f.elements.guests.value,10);
    gout.textContent=g>=400?'400+':g;gnote.textContent=guestText(g);
    rows.push('<li><span class="dot dot--'+((g>300||g<75)?'later':'open')+'" aria-hidden="true"></span><span><b>Guests:</b> '+guestText(g)+'</span></li>');
    var html=rows.join('');
    if(html!==out.innerHTML){out.innerHTML=html;
      if(ready&&motion)G.fromTo(out.children,{opacity:0,y:12},{opacity:1,y:0,duration:.5,ease:'power2.out',stagger:.06,clearProps:'transform'});
      if(ready&&motion&&sun&&f.querySelector('.is-in'))G.fromTo(sun,{scale:.82,transformOrigin:'60px 60px'},{scale:1,duration:.7,ease:'power3.out'});}
    var nmv=f.elements.name.value.trim(),ph=f.elements.phone.value.trim(),sign='Thank you,';
    if(nmv)sign+='\nName: '+nmv;if(ph)sign+='\nPhone: '+ph;
    var body='Hi Lisa,\n\nWe’re looking at The Hill for our 2027 wedding. Our dates:\n'+(lines.join('\n')||'- (dates)')+'\n- Guests: about '+g+'\n\nAre any of these open? We’d also love to schedule a tour.\n\n'+sign+'\n';
    send.href='mailto:lisacoon231@gmail.com?subject='+encodeURIComponent('2027 date request')+'&body='+encodeURIComponent(body);
  }
  f.addEventListener('submit',function(e){e.preventDefault();send.focus();});f.addEventListener('input',update);f.addEventListener('change',update);update();ready=true;

  /* ---------- one filled primary per screen ----------
     The header (desktop) and bar (mobile) CHECK A DATE are filled unless another filled primary is on screen,
     in which case they step back to an outline. The bar itself is visible from first paint. */
  var holds=[].slice.call(document.querySelectorAll('[data-hold]'));
  var prim=[].slice.call(document.querySelectorAll('main .btn--primary'));
  function shown(el){var r=el.getBoundingClientRect();if(!(r.bottom>-.15*innerHeight&&r.top<1.2*innerHeight&&r.width>0))return false; // look ahead so the hold steps back before another primary arrives
    var c=el.closest('.cap');if(!c)return true;var cs=getComputedStyle(c);return parseFloat(cs.opacity)>.05&&cs.visibility!=='hidden';}
  var tick=false;
  function setBar(){tick=false;var other=prim.some(shown);holds.forEach(function(h){h.classList.toggle('is-quiet',other);});}
  function req(){if(!tick){tick=true;requestAnimationFrame(setBar);}}
  addEventListener('scroll',req,{passive:true});addEventListener('resize',req);setBar();
  setInterval(req,200); // entrance animations move buttons without a scroll event

  window.__hill={check:check,motion:function(){return motion;}};
  if(!motion)return;

  /* ---------- tones: collected from main section[data-tone] up front (no pin-spacers can hide the films) ---------- */
  root.classList.add('ready'); // later films' posters load once the hero has painted
  var tones=[].slice.call(document.querySelectorAll('main section[data-tone]')).map(function(s){return {el:s,tone:s.dataset.tone,out:s.dataset.out||s.dataset.tone,film:s.classList.contains('film')};});

  /* ---------- helpers ---------- */
  function split(el){
    (function walk(node){
      [].slice.call(node.childNodes).forEach(function(n){
        if(n.nodeType===3){
          var parts=n.textContent.split(/([ \n\t]+)/),frag=document.createDocumentFragment();
          parts.forEach(function(p){if(!p)return;if(/^[ \n\t]+$/.test(p)){frag.appendChild(document.createTextNode(' '));return;}
            var w=document.createElement('span');w.className='w';var i=document.createElement('span');i.className='wi';i.textContent=p;w.appendChild(i);frag.appendChild(w);});
          n.parentNode.replaceChild(frag,n);
        }else if(n.nodeType===1&&n.tagName!=='BR')walk(n);
      });
    })(el);
    return el.querySelectorAll('.wi');
  }
  document.querySelectorAll('.split').forEach(split);
  var small=innerWidth<700;

  /* ---------- frame-sequence player: WebP frames drawn to canvas ----------
     Tiers: m = 1080x1440 portrait crop (phones), d = 1920x1080. Recut from the 2x upscales: clean shots only,
     joined by a dip through dark; no frame shows two scenes. Frame index = round(progress*(n-1)), linear. */
  var FV='3';
  function cap(){return Math.min(window.devicePixelRatio||1,2);}
  function Seq(sec){
    var n=+sec.dataset.frames,name=sec.dataset.film,set=small?'m':'d';
    var cv=sec.querySelector('canvas'),ctx=cv.getContext('2d'),imgs=new Array(n),ok=new Uint8Array(n);
    var want=0,drawn=-1,queue=[],active=0,phase=0,fails=0;
    function src(i){return 'film/'+name+'/'+set+'/'+('00'+i).slice(-3)+'.webp?v='+FV;}
    function range(s){var a=[];for(var i=0;i<n;i+=s)a.push(i);return a;}
    var coarse=[0,n-1].concat(range(8)),fine=range(4).concat(range(2),range(1)),seen={};
    function add(list){list.forEach(function(i){if(!seen[i]){seen[i]=1;queue.push(i);}});pump();}
    function pump(){while(active<4&&queue.length){(function(i){active++;var im=new Image();im.decoding='async';
      im.onload=function(){ok[i]=1;imgs[i]=im;active--;if(drawn<0||Math.abs(i-want)<Math.abs(drawn-want))paint();pump();};
      im.onerror=function(){active--;fails++;pump();};im.src=src(i);})(queue.shift());}}
    // phase 1: a coarse pass (every 8th frame) so scrubbing works at once; phase 2: everything else
    function start(){if(phase<1){phase=1;add(coarse);}}
    function full(){start();if(phase<2){phase=2;add(fine);}}
    function nearest(i){for(var d=0;d<n;d++){if(i-d>=0&&ok[i-d])return i-d;if(i+d<n&&ok[i+d])return i+d;}return -1;}
    var W=0,H=0;
    function size(){var dpr=cap(),w=Math.round(cv.clientWidth*dpr),h=Math.round(cv.clientHeight*dpr);if(w===W&&h===H)return;
      W=cv.width=w;H=cv.height=h;ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';drawn=-1;paint();}
    // until a frame is drawn the stage shows the poster (frame 0) as its background, so the stage is never blank
    function paint(){var k=nearest(want);if(k<0||k===drawn)return;var im=imgs[k],s=Math.max(W/im.naturalWidth,H/im.naturalHeight),w=im.naturalWidth*s,h=im.naturalHeight*s;
      ctx.drawImage(im,(W-w)/2,(H-h)/2,w,h);drawn=k;}
    var raf=0;
    function go(p){var i=Math.max(0,Math.min(n-1,Math.round(p*(n-1))));if(i!==want){want=i;if(phase<2&&i>0)full();}
      if(!raf)raf=requestAnimationFrame(function(){raf=0;paint();});}
    addEventListener('resize',size);size();
    return {go:go,start:start,full:full,state:function(){return {want:want,drawn:drawn,loaded:ok.reduce(function(a,b){return a+b;},0),n:n,set:set,cw:W,ch:H,fails:fails,src:imgs[drawn]?imgs[drawn].naturalWidth+'x'+imgs[drawn].naturalHeight:null};}};
  }

  /* ---------- the films: held by CSS sticky; one scrubbed timeline per film owns frame, captions and veil ---------- */
  var seqs=[];
  document.querySelectorAll('.film').forEach(function(sec,idx){
    var seq=Seq(sec);seqs.push(seq);
    var len=+sec.dataset.len;
    if(!idx){ // hero: poster first, then a coarse pass after load, the rest once the visitor scrolls or the page is idle
      var kick=function(){seq.start();};
      if(document.readyState==='complete')kick();else addEventListener('load',kick);
      addEventListener('scroll',function once(){seq.full();removeEventListener('scroll',once);},{passive:true});
    }else{
      new IntersectionObserver(function(e,o){if(e[0].isIntersecting){seq.start();o.disconnect();}},{rootMargin:'300% 0px'}).observe(sec);
      new IntersectionObserver(function(e,o){if(e[0].isIntersecting){seq.full();o.disconnect();}},{rootMargin:'150% 0px'}).observe(sec);
    }
    var tl=G.timeline({defaults:{ease:'none'},onUpdate:req,scrollTrigger:{trigger:sec,start:'top top',end:'bottom bottom',scrub:.6,onUpdate:req,onToggle:req}});
    var pr={p:0};
    tl.to(pr,{p:1,duration:1,onUpdate:function(){seq.go(pr.p);}},0);
    tl.fromTo(sec.querySelector('.film__meter span'),{scaleY:0},{scaleY:1,duration:1},0);
    // the next section rises over the last 60svh of the pin; the film reaches that section's colour as it does
    var vout=sec.querySelector('.film__veil--out'),label=sec.querySelector('.film__label'),f=Math.min(.3,60/len);
    if(vout)tl.fromTo(vout,{opacity:0},{opacity:1,duration:f,ease:'power1.in'},1-f);
    if(label){if(idx)tl.fromTo(label,{opacity:0},{opacity:1,duration:.03},0);tl.to(label,{opacity:0,duration:.03},1-f);}
    var hint=sec.querySelector('.film__hint');if(hint)tl.to(hint,{opacity:0,duration:.04},.02);
    sec.querySelectorAll('.cap').forEach(function(c){
      var at=c.dataset.at.split(',').map(Number),a=at[0],b=at[1],kids=[].slice.call(c.children).filter(function(k){return !k.classList.contains('split');}),words=c.querySelectorAll('.wi');
      if(a>0){
        tl.fromTo(c,{autoAlpha:0},{autoAlpha:1,duration:.03},a);
        tl.fromTo(words,{yPercent:110},{yPercent:0,duration:.06,stagger:.006,ease:'power2.out'},a);
        tl.fromTo(kids,{y:28,opacity:0},{y:0,opacity:1,duration:.05,stagger:.012,ease:'power2.out'},a+.012);
      }else G.set(c,{opacity:1,visibility:'visible'}); // the H1 card stays in the accessibility tree; it only fades
      if(b<1){tl.to(kids,{y:-16,opacity:0,duration:.035,stagger:.006,ease:'power1.in'},b-.045);
        tl.to(words,{yPercent:-110,duration:.04,stagger:.004,ease:'power1.in'},b-.045);
        if(a>0)tl.to(c,{autoAlpha:0,duration:.01},b);
        else{tl.to(c,{opacity:0,duration:.01},b);tl.set(c.querySelectorAll('a'),{pointerEvents:'none'},b);}}
    });
  });

  /* ---------- body tone follows the section under the middle of the screen (built before pinning) ---------- */
  var body=document.body,lastTone='';
  function paintTone(){var mid=innerHeight/2,c=tones[0].tone;
    for(var i=0;i<tones.length;i++){var r=tones[i].el.getBoundingClientRect();if(r.top<=mid&&r.bottom>mid){c=tones[i].film&&r.top<=0?tones[i].out:tones[i].tone;}}
    if(c!==lastTone){body.style.backgroundColor=c;lastTone=c;}}
  addEventListener('scroll',paintTone,{passive:true});ST.addEventListener('refresh',paintTone);paintTone();

  window.__hill.films=function(){return seqs.map(function(s){return s.state();});};
  window.__hill.tones=function(){return tones.map(function(t){return t.el.id+':'+t.tone+(t.film?'>'+t.out:'');});};
  /* ---------- hero entrance ---------- */
  // (the hero card's entrance is CSS, so it shows before this script loads)
  var intro=document.querySelector('.cap--intro');
  // keyboard: focusing a hero CTA after the card has faded brings the card back into view
  intro.addEventListener('focusin',function(){if(parseFloat(getComputedStyle(intro).opacity)<.5)scrollTo(0,0);});

  /* ---------- section motion: line reveals, slide-ins from every side, timelines drawing ---------- */
  function reveal(sel){document.querySelectorAll(sel).forEach(function(h){
    G.fromTo(h.querySelectorAll('.wi'),{yPercent:110},{yPercent:0,duration:1,ease:'power4.out',stagger:.05,scrollTrigger:{trigger:h,start:'top 95%',once:true}});});}
  reveal('main > section:not(.film) .split');
  var X=small?40:110,FROM={left:{x:-X,y:30},right:{x:X,y:30},bottom:{x:0,y:110}};

  // date
  G.from('.date__intro > *:not(h2)',{y:36,opacity:0,duration:.9,ease:'power3.out',stagger:.07,scrollTrigger:{trigger:'.date',start:'top 90%',once:true}});
  G.from('.checker',{y:80,opacity:0,duration:1.1,ease:'power3.out',scrollTrigger:{trigger:'.checker',start:'top 92%',once:true}});
  G.from('.dcard',{opacity:0,duration:.9,ease:'power3.out',stagger:.12,x:function(i){return [-60,0,60][i];},y:function(i){return i===1?60:20;},clearProps:'transform',scrollTrigger:{trigger:'.dates',start:'top 92%',once:true}});

  // day: the sun crosses the sky as you read
  var arc=document.querySelector('[data-arcsun]'),o={a:0};
  G.to(o,{a:1,ease:'none',scrollTrigger:{trigger:'.scenes',start:'top 70%',end:'bottom 40%',scrub:.6},onUpdate:function(){var t=Math.PI*(1-o.a);arc.setAttribute('cx',100+90*Math.cos(t));arc.setAttribute('cy',100-90*Math.sin(t));}});
  document.querySelectorAll('.scene').forEach(function(s){
    var d=FROM[s.dataset.from]||FROM.bottom,fig=s.querySelector('.scene__img'),img=fig.querySelector('img'),copy=s.querySelector('.scene__copy').children;
    var t=G.timeline({scrollTrigger:{trigger:s,start:'top 82%',once:true}});
    t.fromTo(fig,{x:d.x,y:d.y,opacity:0,clipPath:'inset(12% 12% 12% 12% round 3px)'},{x:0,y:0,opacity:1,clipPath:'inset(0% 0% 0% 0% round 3px)',duration:1.4,ease:'expo.out'})
     .fromTo(img,{scale:1.2},{scale:1,duration:1.8,ease:'expo.out'},0)
     .from(copy,{y:40,opacity:0,duration:1,ease:'power3.out',stagger:.1},.2);
  });

  // history: the line draws itself, entries settle in from both sides
  var tlist=document.querySelector('[data-tl]'),line=document.createElement('span');line.className='tl__line';line.setAttribute('aria-hidden','true');tlist.prepend(line);
  G.fromTo(line,{scaleY:0},{scaleY:1,ease:'none',scrollTrigger:{trigger:tlist,start:'top 75%',end:'bottom 60%',scrub:.5}});
  tlist.querySelectorAll('li').forEach(function(li){
    var t=G.timeline({scrollTrigger:{trigger:li,start:'top 88%',once:true}});
    t.from(li.querySelector('.tl__y'),{x:-50,opacity:0,duration:1,ease:'power3.out'})
     .from(li.querySelector('div'),{x:70,opacity:0,duration:1,ease:'power3.out'},.1);
  });
  G.from('.story__ghost',{opacity:0,x:60,duration:1.6,ease:'power3.out',scrollTrigger:{trigger:'.story',start:'top 70%',once:true}});

  // included: list assembles, the pricing card sweeps in
  G.from('.ticks li',{x:-40,opacity:0,duration:.8,ease:'power3.out',stagger:.07,scrollTrigger:{trigger:'.ticks',start:'top 85%',once:true}});
  G.from('.price',{x:90,opacity:0,duration:1.3,ease:'expo.out',scrollTrigger:{trigger:'.price',start:'top 90%',once:true}});

  // grounds: frames slide in from different sides, the photos drift inside their frames
  document.querySelectorAll('.mosaic .m').forEach(function(m){
    var d=FROM[m.dataset.from]||FROM.bottom,img=m.querySelector('img');
    G.fromTo(m,{x:d.x*.8,y:d.y,opacity:0},{x:0,y:0,opacity:1,duration:1.3,ease:'expo.out',scrollTrigger:{trigger:m,start:'top 90%',once:true}});
    if(img)G.fromTo(img,{yPercent:-3,scale:1.08},{yPercent:3,scale:1.08,ease:'none',scrollTrigger:{trigger:m,start:'top bottom',end:'bottom top',scrub:true}});
  });

  // faq + visit
  G.from('.acc details',{y:40,opacity:0,duration:.8,ease:'power3.out',stagger:.07,scrollTrigger:{trigger:'.acc',start:'top 88%',once:true}});
  G.from('.ct > div > *:not(h2), .ct address',{y:40,opacity:0,duration:1,ease:'power3.out',stagger:.08,scrollTrigger:{trigger:'.visit',start:'top 85%',once:true}});

  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){ST.refresh();});
  if(document.readyState==='complete')setTimeout(function(){ST.refresh();req();},0);else addEventListener('load',function(){ST.refresh();req();});
  req();
})();
