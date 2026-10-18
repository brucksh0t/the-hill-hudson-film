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
      if(ready&&motion&&sun&&f.querySelector('.is-in'))G.fromTo(sun,{scale:.6,transformOrigin:'60px 60px'},{scale:1,duration:.9,ease:'elastic.out(1,.5)'});}
    var nmv=f.elements.name.value.trim(),ph=f.elements.phone.value.trim(),sign='Thank you,';
    if(nmv)sign+='\nName: '+nmv;if(ph)sign+='\nPhone: '+ph;
    var body='Hi Lisa,\n\nWe’re looking at The Hill for our 2027 wedding. Our dates:\n'+(lines.join('\n')||'- (dates)')+'\n- Guests: about '+g+'\n\nAre any of these open? We’d also love to schedule a tour.\n\n'+sign+'\n';
    send.href='mailto:lisacoon231@gmail.com?subject='+encodeURIComponent('2027 date request')+'&body='+encodeURIComponent(body);
  }
  f.addEventListener('input',update);f.addEventListener('change',update);update();ready=true;

  /* ---------- mobile bar: one filled primary per screen ---------- */
  var bar=document.querySelector('[data-mbar]'),date=document.getElementById('date');
  var ctas=[].slice.call(document.querySelectorAll('.cap--intro .btns,.cap--end .btns'));
  function onScreen(el){var r=el.getBoundingClientRect();return r.bottom>0&&r.top<innerHeight&&r.width>0;}
  function shown(el){if(!onScreen(el))return false;var c=el.closest('.cap');return !c||parseFloat(getComputedStyle(c).opacity)>.05&&getComputedStyle(c).visibility!=='hidden';}
  var tick=false;
  function setBar(){tick=false;var on=!onScreen(date)&&!ctas.some(shown);bar.classList.toggle('is-on',on);}
  function req(){if(!tick){tick=true;requestAnimationFrame(setBar);}}
  addEventListener('scroll',req,{passive:true});addEventListener('resize',req);setBar();

  window.__hill={check:check,motion:function(){return motion;}};
  if(!motion)return;

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

  /* ---------- frame-sequence player: streamed WebP frames drawn to canvas ---------- */
  function Seq(sec){
    var n=+sec.dataset.frames,name=sec.dataset.film,set=small?'m':'d';
    var cv=sec.querySelector('canvas'),ctx=cv.getContext('2d'),imgs=new Array(n),ok=new Uint8Array(n);
    var want=0,drawn=-1,started=false,queue=[],active=0;
    function src(i){return 'film/'+name+'/'+set+'/'+('00'+i).slice(-3)+'.webp';}
    // coarse to fine, so scrubbing works before everything has arrived
    var seen={};[0,n-1].concat(range(16),range(8),range(4),range(2),range(1)).forEach(function(i){if(!seen[i]){seen[i]=1;queue.push(i);}});
    function range(s){var a=[];for(var i=0;i<n;i+=s)a.push(i);return a;}
    function pump(){while(active<6&&queue.length){(function(i){active++;var im=new Image();im.decoding='async';
      im.onload=function(){ok[i]=1;imgs[i]=im;active--;if(Math.abs(i-want)<Math.abs(drawn-want)||drawn<0)paint();pump();};
      im.onerror=function(){active--;pump();};im.src=src(i);})(queue.shift());}}
    function start(){if(started)return;started=true;pump();}
    function nearest(i){for(var d=0;d<n;d++){if(i-d>=0&&ok[i-d])return i-d;if(i+d<n&&ok[i+d])return i+d;}return -1;}
    var W=0,H=0;
    function size(){var dpr=Math.min(devicePixelRatio||1,2);W=cv.width=Math.round(cv.clientWidth*dpr);H=cv.height=Math.round(cv.clientHeight*dpr);drawn=-1;paint();}
    function paint(){var k=nearest(want);if(k<0||(k===drawn))return;var im=imgs[k],s=Math.max(W/im.naturalWidth,H/im.naturalHeight),w=im.naturalWidth*s,h=im.naturalHeight*s;
      ctx.drawImage(im,(W-w)/2,(H-h)/2,w,h);drawn=k;}
    var raf=0;
    function go(p){want=Math.max(0,Math.min(n-1,Math.round(p*(n-1))));if(!raf)raf=requestAnimationFrame(function(){raf=0;paint();});}
    addEventListener('resize',size);size();
    return {go:go,start:start,state:function(){return {want:want,drawn:drawn,loaded:ok.reduce(function(a,b){return a+b;},0),n:n,set:set};}};
  }

  /* ---------- the films: pinned, scroll drives frames, captions dissolve over the footage ---------- */
  var body=document.body,seqs=[];
  document.querySelectorAll('.film').forEach(function(sec,idx){
    var seq=Seq(sec);seqs.push(seq);
    var len=+sec.dataset.len*(small?.85:1);
    if(!idx)seq.start();
    else new IntersectionObserver(function(e,o){if(e[0].isIntersecting){seq.start();o.disconnect();}},{rootMargin:'250% 0px'}).observe(sec);
    var inTone=sec.dataset['in']||sec.dataset.tone,out=outTone(sec);
    var tl=G.timeline({defaults:{ease:'none'},onUpdate:req,scrollTrigger:{trigger:sec,start:'top top',end:'+='+len+'%',pin:true,scrub:.7,anticipatePin:1,
      onUpdate:req,onToggle:req}});
    var pr={p:0};
    tl.to(pr,{p:1,duration:1,onUpdate:function(){seq.go(pr.p);}},0);
    tl.fromTo(sec.querySelector('.film__meter span'),{scaleY:0},{scaleY:1,duration:1},0);
    tl.fromTo(sec.querySelector('.film__stage'),{scale:1},{scale:1.04,duration:1},0);
    var vin=sec.querySelector('.film__veil--in'),vout=sec.querySelector('.film__veil--out');
    if(vin)tl.fromTo(vin,{opacity:1},{opacity:0,duration:.06},0);
    if(vout)tl.fromTo(vout,{opacity:0},{opacity:1,duration:.07},.93);
    var hint=sec.querySelector('.film__hint');if(hint)tl.to(hint,{opacity:0,duration:.04},.02);
    sec.querySelectorAll('.cap').forEach(function(c){
      var at=c.dataset.at.split(',').map(Number),a=at[0],b=at[1],kids=[].slice.call(c.children).filter(function(k){return !k.classList.contains('split');}),words=c.querySelectorAll('.wi'),big=c.querySelector('.cap__big');
      if(a>0){
        tl.fromTo(c,{autoAlpha:0},{autoAlpha:1,duration:.035},a);
        tl.fromTo(words,{yPercent:110},{yPercent:0,duration:.06,stagger:.006,ease:'power2.out'},a);
        tl.fromTo(kids,{y:28,opacity:0},{y:0,opacity:1,duration:.05,stagger:.012,ease:'power2.out'},a+.015);
        if(big)tl.fromTo(big,{yPercent:30,opacity:0},{yPercent:0,opacity:1,duration:b-a,ease:'none'},a);
      }else G.set(c,{autoAlpha:1});
      tl.fromTo(c,{y:0},{y:-18,duration:b-a},a);
      if(b<1)tl.to(c,{autoAlpha:0,filter:'blur(6px)',duration:.04,ease:'power1.in'},b-.04);
    });
  });

  /* ---------- tones: page colour dissolves between sections, computed from scroll position ---------- */
  var blocks=[].slice.call(document.querySelectorAll('main > section')),zones=[];
  function outTone(s){return s.dataset.out||s.dataset.tone;}
  blocks.forEach(function(s,i){
    var from=i?outTone(blocks[i-1]):s.dataset.tone;
    if(s.classList.contains('film'))zones.push({st:ST.getAll().filter(function(t){return t.pin===s;})[0],film:1,to:outTone(s),from:s.dataset['in']||from});
    else if(from!==s.dataset.tone)zones.push({st:ST.create({trigger:s,start:'top 85%',end:'top 35%'}),to:s.dataset.tone,from:from,mix:G.utils.interpolate(from,s.dataset.tone)});
  });
  var first=blocks[0].dataset.tone,lastTone='';
  function paintTone(){var y=scrollY,c=first;
    for(var i=0;i<zones.length;i++){var z=zones[i],st=z.st;if(!st)continue;
      if(y<st.start)break;
      if(z.film){c=z.to;continue;}
      c=y>=st.end?z.to:z.mix((y-st.start)/(st.end-st.start));}
    if(c!==lastTone){body.style.backgroundColor=c;lastTone=c;}}
  addEventListener('scroll',paintTone,{passive:true});ST.addEventListener('refresh',paintTone);paintTone();

  window.__hill.films=function(){return seqs.map(function(s){return s.state();});};
  /* ---------- hero entrance ---------- */
  var intro=document.querySelector('.cap--intro');
  G.from(intro.querySelectorAll('h1 .wi'),{yPercent:110,duration:1.2,ease:'power4.out',stagger:.07,delay:.15});
  G.from(intro.querySelectorAll('.kicker,.lede,.btns,.facts-bar li'),{y:30,opacity:0,duration:1.1,ease:'power3.out',stagger:.09,delay:.35});

  /* ---------- section motion: line reveals, cards from every side, timelines drawing ---------- */
  function reveal(sel){document.querySelectorAll(sel).forEach(function(h){
    G.fromTo(h.querySelectorAll('.wi'),{yPercent:110},{yPercent:0,duration:1,ease:'power4.out',stagger:.05,scrollTrigger:{trigger:h,start:'top 88%',once:true}});});}
  reveal('main > section:not(.film) .split');
  var X=small?40:110,FROM={left:{x:-X,y:30,rotation:-2},right:{x:X,y:30,rotation:2},bottom:{x:0,y:120,rotation:0}};

  // date
  G.from('.date__intro > *:not(h2)',{y:40,opacity:0,duration:1,ease:'power3.out',stagger:.08,scrollTrigger:{trigger:'.date',start:'top 75%',once:true}});
  G.from('.checker',{y:80,opacity:0,duration:1.2,ease:'power3.out',scrollTrigger:{trigger:'.checker',start:'top 90%',once:true}});
  G.from('.dcard',{opacity:0,duration:.9,ease:'power3.out',stagger:.12,x:function(i){return [-60,0,60][i];},y:function(i){return i===1?60:20;},clearProps:'transform',scrollTrigger:{trigger:'.dates',start:'top 92%',once:true}});

  // day: the sun crosses the sky as you read
  var arc=document.querySelector('[data-arcsun]'),o={a:0};
  G.to(o,{a:1,ease:'none',scrollTrigger:{trigger:'.scenes',start:'top 70%',end:'bottom 40%',scrub:.6},onUpdate:function(){var t=Math.PI*(1-o.a);arc.setAttribute('cx',100+90*Math.cos(t));arc.setAttribute('cy',100-90*Math.sin(t));}});
  document.querySelectorAll('.scene').forEach(function(s){
    var d=FROM[s.dataset.from]||FROM.bottom,fig=s.querySelector('.scene__img'),img=fig.querySelector('img'),copy=s.querySelector('.scene__copy').children;
    var t=G.timeline({scrollTrigger:{trigger:s,start:'top 82%',once:true}});
    t.fromTo(fig,{x:d.x,y:d.y,rotation:d.rotation,opacity:0,clipPath:'inset(12% 12% 12% 12% round 3px)'},{x:0,y:0,rotation:0,opacity:1,clipPath:'inset(0% 0% 0% 0% round 3px)',duration:1.4,ease:'expo.out'})
     .fromTo(img,{scale:1.25},{scale:1,duration:1.8,ease:'expo.out'},0)
     .from(copy,{y:40,opacity:0,duration:1,ease:'power3.out',stagger:.1},.2);
    G.fromTo(img,{yPercent:-4},{yPercent:4,ease:'none',scrollTrigger:{trigger:s,start:'top bottom',end:'bottom top',scrub:true}});
  });

  // history: the line draws itself, entries settle in from both sides
  var tlist=document.querySelector('[data-tl]'),line=document.createElement('span');line.className='tl__line';line.setAttribute('aria-hidden','true');tlist.prepend(line);
  G.fromTo(line,{scaleY:0},{scaleY:1,ease:'none',scrollTrigger:{trigger:tlist,start:'top 75%',end:'bottom 60%',scrub:.5}});
  tlist.querySelectorAll('li').forEach(function(li){
    var t=G.timeline({scrollTrigger:{trigger:li,start:'top 85%',once:true}});
    t.from(li.querySelector('.tl__y'),{x:-50,opacity:0,duration:1,ease:'power3.out'})
     .from(li.querySelector('div'),{x:70,opacity:0,duration:1,ease:'power3.out'},.1);
  });
  G.fromTo('.story__ghost',{yPercent:30},{yPercent:-30,ease:'none',scrollTrigger:{trigger:'.story',start:'top bottom',end:'bottom top',scrub:true}});

  // included: list assembles, the pricing card sweeps in
  G.from('.ticks li',{x:-40,opacity:0,duration:.8,ease:'power3.out',stagger:.07,scrollTrigger:{trigger:'.ticks',start:'top 85%',once:true}});
  G.from('.price',{x:90,rotation:3,opacity:0,duration:1.3,ease:'expo.out',scrollTrigger:{trigger:'.price',start:'top 90%',once:true}});

  // grounds: frames fly in from different sides, then drift in parallax
  document.querySelectorAll('.mosaic .m').forEach(function(m){
    var d=FROM[m.dataset.from]||FROM.bottom,img=m.querySelector('img');
    G.fromTo(m,{x:d.x*.8,y:d.y,rotation:d.rotation,opacity:0},{x:0,y:0,rotation:0,opacity:1,duration:1.3,ease:'expo.out',scrollTrigger:{trigger:m,start:'top 90%',once:true}});
    if(img)G.fromTo(img,{yPercent:-3,scale:1.08},{yPercent:3,scale:1.08,ease:'none',scrollTrigger:{trigger:m,start:'top bottom',end:'bottom top',scrub:true}});
  });

  // faq + visit
  G.from('.acc details',{y:40,opacity:0,duration:.8,ease:'power3.out',stagger:.07,scrollTrigger:{trigger:'.acc',start:'top 88%',once:true}});
  G.from('.ct > div > *:not(h2), .ct address',{y:40,opacity:0,duration:1,ease:'power3.out',stagger:.08,scrollTrigger:{trigger:'.visit',start:'top 80%',once:true}});

  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){ST.refresh();});
  addEventListener('load',function(){ST.refresh();req();});
  req();
})();
