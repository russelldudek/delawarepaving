const scenarios={handoff:{title:"Estimate-to-project handoff",status:"Estimate-to-project handoff",headline:"Assumptions must survive the handoff.",detail:"Carry scope, estimate logic, attachments, ownership, and exceptions into the project record without rekeying.",score:63,problem:"Estimate assumptions, attachments, scope boundaries, and customer commitments can lose fidelity when the project is created and handed to delivery.",mechanism:"Structured handoff record + project workspace creation + accountable exception review.",metrics:["Handoff completeness","Rekeying events","Time from award to ready-to-run project","Unresolved scope exceptions"],states:{truth:"ready",owner:"risk",data:"void",system:"void",decision:"risk"},active:["owner","data","system"]},change:{title:"Change-order control",status:"Change-order control",headline:"Field evidence must reach authority quickly.",detail:"Connect condition, photo, scope, cost implication, approval, and ERP record while the decision is still actionable.",score:48,problem:"Photos, conversations, scope interpretation, cost implications, and approval authority can fragment across field, email, documents, and financial records.",mechanism:"Mobile evidence capture + bounded approval path + synchronized change record.",metrics:["Approval latency","Evidence traceability","Change-order exception age","Unbilled approved work"],states:{truth:"risk",owner:"void",data:"void",system:"risk",decision:"void"},active:["truth","owner","decision"]},closeout:{title:"Daily work to closeout",status:"Daily work to closeout",headline:"Closeout should be assembled as work happens.",detail:"Turn field updates, photos, completion evidence, punch items, and customer records into a living closeout package.",score:71,problem:"Project status, daily production, photos, punch items, and completion documents can become a late manual assembly exercise instead of a continuous evidence stream.",mechanism:"Field capture + governed document hierarchy + readiness dashboard + closeout checklist.",metrics:["Closeout readiness","Missing-document rate","Time from physical completion to closeout","Customer follow-up touches"],states:{truth:"ready",owner:"ready",data:"risk",system:"void",decision:"risk"},active:["data","system","decision"]}};
function applyScenario(key){const s=scenarios[key]||scenarios.handoff;document.querySelectorAll('[data-scenario]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.scenario===key)));const set=(id,v)=>{const n=document.getElementById(id);if(n)n.textContent=v};set('rigStatus',s.status);set('rigHeadline',s.headline);set('rigDetail',s.detail);set('loadScore',s.score);set('scenarioTitle',s.title);set('scenarioProblem',s.problem);set('scenarioMechanism',s.mechanism);const metrics=document.getElementById('scenarioMetrics');if(metrics)metrics.innerHTML=s.metrics.map(x=>`<li>${x}</li>`).join('');document.querySelectorAll('.layer[data-layer]').forEach(el=>el.dataset.state=s.states[el.dataset.layer]||'risk');document.querySelectorAll('[data-layer-card]').forEach(el=>el.classList.toggle('active',s.active.includes(el.dataset.layerCard)));}
document.querySelectorAll('[data-scenario]').forEach(b=>b.addEventListener('click',()=>applyScenario(b.dataset.scenario)));applyScenario('handoff');

(function initRollerMotion(){
  const roadWindow=document.querySelector('.road-window');
  const roller=document.querySelector('.roller');
  if(!roadWindow||!roller)return;

  const drum=roller.querySelector('.roller-drum');
  const wheel=roller.querySelector('.roller-wheel');
  const reducedMotion=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  roller.style.animation='none';
  roller.style.transformOrigin='left bottom';
  roller.style.willChange='transform';

  function addRotor(element,type){
    if(!element)return null;
    element.style.overflow='hidden';
    const rotor=document.createElement('span');
    rotor.setAttribute('aria-hidden','true');
    Object.assign(rotor.style,{
      position:'absolute',
      inset:type==='drum'?'3px':'2px',
      borderRadius:'50%',
      background:type==='drum'
        ?'repeating-conic-gradient(from 0deg,rgba(45,56,65,.95) 0deg 7deg,transparent 7deg 45deg)'
        :'repeating-conic-gradient(from 0deg,rgba(76,87,96,.95) 0deg 6deg,transparent 6deg 45deg)',
      transformOrigin:'50% 50%',
      willChange:'transform',
      pointerEvents:'none'
    });
    const hub=document.createElement('span');
    hub.setAttribute('aria-hidden','true');
    Object.assign(hub.style,{
      position:'absolute',
      left:'50%',
      top:'50%',
      width:type==='drum'?'9px':'7px',
      height:type==='drum'?'9px':'7px',
      borderRadius:'50%',
      background:'#8b959d',
      transform:'translate(-50%,-50%)',
      boxShadow:'0 0 0 2px rgba(24,31,38,.38)',
      pointerEvents:'none'
    });
    element.append(rotor,hub);
    return rotor;
  }

  const drumRotor=addRotor(drum,'drum');
  const wheelRotor=addRotor(wheel,'wheel');

  function scaleForViewport(){return window.matchMedia('(max-width:640px)').matches?.8:1;}

  if(reducedMotion){
    const scale=scaleForViewport();
    roller.style.left='55%';
    roller.style.transform=`translate3d(0,0,0) scale(${scale})`;
    return;
  }

  let phase=0;
  let lastTime=performance.now();
  let lastX=0;
  let wheelAngle=0;
  const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;

  function frame(now){
    const dt=Math.min(40,now-lastTime);
    lastTime=now;
    phase=(phase+dt*.000125)%2;
    const outbound=phase<=1;
    const local=outbound?phase:2-phase;
    const progress=ease(local);
    const scale=scaleForViewport();
    const leftOffset=parseFloat(getComputedStyle(roller).left)||0;
    const maxTravel=Math.max(0,roadWindow.clientWidth-leftOffset-(roller.offsetWidth*scale)-12);
    const x=progress*maxTravel;
    const dx=x-lastX;
    lastX=x;

    wheelAngle+=dx*1.35;
    const bob=Math.sin(now*.006)*.55;
    roller.style.transform=`translate3d(${x}px,${bob}px,0) scale(${scale})`;
    if(wheelRotor)wheelRotor.style.transform=`rotate(${wheelAngle}deg)`;
    if(drumRotor)drumRotor.style.transform=`rotate(${wheelAngle*.72}deg)`;
    window.requestAnimationFrame(frame);
  }

  window.requestAnimationFrame(frame);
})();