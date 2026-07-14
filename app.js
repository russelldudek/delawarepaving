const approvedRollerStyles=document.createElement('link');approvedRollerStyles.rel='stylesheet';approvedRollerStyles.href='approved-roller.css';document.head.appendChild(approvedRollerStyles);

const scenarios={handoff:{title:"Estimate-to-project handoff",status:"Estimate-to-project handoff",headline:"Assumptions must survive the handoff.",detail:"Carry scope, estimate logic, attachments, ownership, and exceptions into the project record without rekeying.",score:63,problem:"Estimate assumptions, attachments, scope boundaries, and customer commitments can lose fidelity when the project is created and handed to delivery.",mechanism:"Structured handoff record + project workspace creation + accountable exception review.",metrics:["Handoff completeness","Rekeying events","Time from award to ready-to-run project","Unresolved scope exceptions"],states:{truth:"ready",owner:"risk",data:"void",system:"void",decision:"risk"},active:["owner","data","system"]},change:{title:"Change-order control",status:"Change-order control",headline:"Field evidence must reach authority quickly.",detail:"Connect condition, photo, scope, cost implication, approval, and ERP record while the decision is still actionable.",score:48,problem:"Photos, conversations, scope interpretation, cost implications, and approval authority can fragment across field, email, documents, and financial records.",mechanism:"Mobile evidence capture + bounded approval path + synchronized change record.",metrics:["Approval latency","Evidence traceability","Change-order exception age","Unbilled approved work"],states:{truth:"risk",owner:"void",data:"void",system:"risk",decision:"void"},active:["truth","owner","decision"]},closeout:{title:"Daily work to closeout",status:"Daily work to closeout",headline:"Closeout should be assembled as work happens.",detail:"Turn field updates, photos, completion evidence, punch items, and customer records into a living closeout package.",score:71,problem:"Project status, daily production, photos, punch items, and completion documents can become a late manual assembly exercise instead of a continuous evidence stream.",mechanism:"Field capture + governed document hierarchy + readiness dashboard + closeout checklist.",metrics:["Closeout readiness","Missing-document rate","Time from physical completion to closeout","Customer follow-up touches"],states:{truth:"ready",owner:"ready",data:"risk",system:"void",decision:"risk"},active:["data","system","decision"]}};

function applyScenario(key){const s=scenarios[key]||scenarios.handoff;document.querySelectorAll('[data-scenario]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.scenario===key)));const set=(id,v)=>{const n=document.getElementById(id);if(n)n.textContent=v};set('rigStatus',s.status);set('rigHeadline',s.headline);set('rigDetail',s.detail);set('loadScore',s.score);set('scenarioTitle',s.title);set('scenarioProblem',s.problem);set('scenarioMechanism',s.mechanism);const metrics=document.getElementById('scenarioMetrics');if(metrics)metrics.innerHTML=s.metrics.map(x=>`<li>${x}</li>`).join('');document.querySelectorAll('.layer[data-layer]').forEach(el=>el.dataset.state=s.states[el.dataset.layer]||'risk');document.querySelectorAll('[data-layer-card]').forEach(el=>el.classList.toggle('active',s.active.includes(el.dataset.layerCard)));}

document.querySelectorAll('[data-scenario]').forEach(b=>b.addEventListener('click',()=>applyScenario(b.dataset.scenario)));
applyScenario('handoff');

(function initRollerMotion(){
  const roadWindow=document.querySelector('.road-window');
  const roller=document.getElementById('roller');
  const rearWheel=document.getElementById('rearWheel');
  const frontDrum=document.getElementById('frontDrum');
  if(!roadWindow||!roller||!rearWheel||!frontDrum)return;

  const reducedMotion=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let phase=0;
  let lastTime=performance.now();
  let lastX=0;
  let wheelAngle=0;
  const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;

  function travelWidth(){
    const leftOffset=parseFloat(getComputedStyle(roller).left)||0;
    return Math.max(0,roadWindow.clientWidth-leftOffset-roller.offsetWidth-12);
  }

  function setPosition(x,bob=0){
    roller.style.transform=`translate3d(${x}px,${bob}px,0)`;
    rearWheel.style.transform=`rotate(${wheelAngle}deg)`;
    frontDrum.style.transform=`rotate(${wheelAngle*.72}deg)`;
  }

  if(reducedMotion){
    requestAnimationFrame(()=>setPosition(travelWidth()*.5,0));
    return;
  }

  function frame(now){
    const dt=Math.min(40,now-lastTime);
    lastTime=now;
    phase=(phase+dt*.000125)%2;
    const outbound=phase<=1;
    const local=outbound?phase:2-phase;
    const x=ease(local)*travelWidth();
    const dx=x-lastX;
    lastX=x;

    wheelAngle+=dx*1.48;
    setPosition(x,Math.sin(now*.006)*.55);
    window.requestAnimationFrame(frame);
  }

  window.requestAnimationFrame(frame);
})();
