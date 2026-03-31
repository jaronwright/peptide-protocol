import { useState, useMemo } from "react";

const START = new Date(2026, 3, 1);
const CYCLE_ON = 56, CYCLE_OFF = 28;

const SUBJECTS = {
  a: { id:"a", label:"Subject A", tag:"24F · 5'8\" · 120 lbs", ghkVials:2, ghkDose:1, ghkUnits:10 },
  b: { id:"b", label:"Subject B", tag:"33M · 5'9\" · 160 lbs", ghkVials:8, ghkDose:2, ghkUnits:20 },
};

const makePeptides = (s) => [
  { key:"bpc", name:"BPC-157 / TB-500", short:"BPC/TB4", mg:5, dose:0.5, doseLabel:"500mcg", vials:5, shelf:28, bac:1, units:10, conc:"5mg/ml", color:"#4F8CF7", purpose:"Tissue repair · Gut healing · Neuroprotection", doesCycle:true },
  { key:"kpv", name:"KPV", short:"KPV", mg:10, dose:0.5, doseLabel:"500mcg", vials:5, shelf:28, bac:2, units:10, conc:"5mg/ml", color:"#A78BFA", purpose:"Anti-inflammatory · NF-κB suppression · Gut & skin", doesCycle:false },
  { key:"ghk", name:"GHK-Cu", short:"GHK-Cu", mg:50, dose:s.ghkDose, doseLabel:`${s.ghkDose}mg`, vials:s.ghkVials, shelf:28, bac:5, units:s.ghkUnits, conc:"10mg/ml", color:"#34D399", purpose:"Collagen synthesis · Anti-aging · Tissue remodeling", doesCycle:true },
];

function buildCycles(start, n=8) {
  const c=[]; let d=new Date(start);
  for(let i=1;i<=n;i++){
    const onS=new Date(d), onE=new Date(d); onE.setDate(onE.getDate()+CYCLE_ON-1);
    const offS=new Date(onE); offS.setDate(offS.getDate()+1);
    const offE=new Date(offS); offE.setDate(offE.getDate()+CYCLE_OFF-1);
    c.push({num:i,onStart:onS,onEnd:onE,offStart:offS,offEnd:offE});
    d=new Date(offE); d.setDate(d.getDate()+1);
  }
  return c;
}

function simulate(pep, start, cycles) {
  const daysPerVial = Math.floor(pep.mg / pep.dose);
  const isOnDay = (d) => !pep.doesCycle || cycles.some(c => d>=c.onStart && d<=c.onEnd);
  const onDaysRemaining = (d) => {
    if(!pep.doesCycle) return 999;
    const c = cycles.find(cy => d>=cy.onStart && d<=cy.onEnd);
    if(!c) return 0;
    return Math.round((c.onEnd - d)/864e5) + 1;
  };
  const minDaysToOpen = Math.ceil(Math.min(daysPerVial, pep.shelf) * 0.4);

  let vialsLeft=pep.vials, cur=null, vNum=0;
  const vLog=[], dLog=[];
  const simEnd = cycles[cycles.length-1].offEnd;
  let d = new Date(start);

  while(d <= simEnd) {
    const on = isOnDay(d);
    let action=null, dosed=false;

    if(cur && d > cur.expiry) {
      vLog.push({...cur, endDate:new Date(cur.expiry), disposeDate:new Date(d), reason:"expired", waste:parseFloat(cur.mgLeft.toFixed(1))});
      cur=null;
    }

    if(on) {
      if(!cur && vialsLeft>0) {
        const rem = onDaysRemaining(d);
        if(rem >= minDaysToOpen) {
          vNum++; vialsLeft--;
          const exp=new Date(d); exp.setDate(exp.getDate()+pep.shelf-1);
          cur={num:vNum, reconDate:new Date(d), mgLeft:pep.mg, expiry:exp};
          action="reconstitute";
        }
      }
      if(cur && cur.mgLeft >= pep.dose) {
        cur.mgLeft = parseFloat((cur.mgLeft - pep.dose).toFixed(4));
        dosed=true;
        if(cur.mgLeft < pep.dose*0.5) {
          const nd=new Date(d); nd.setDate(nd.getDate()+1);
          vLog.push({...cur, endDate:new Date(d), disposeDate:nd, reason:"empty", waste:parseFloat(cur.mgLeft.toFixed(1))});
          cur=null;
        }
      }
    }
    dLog.push({date:new Date(d), on, dosed, action, vialNum: dosed ? vNum : null});
    d=new Date(d); d.setDate(d.getDate()+1);
  }
  if(cur) vLog.push({...cur, endDate:new Date(d), disposeDate:new Date(d), reason:"end", waste:parseFloat(cur.mgLeft.toFixed(1))});

  return {
    vialLog:vLog, dayLog:dLog,
    totalDosed: dLog.filter(x=>x.dosed).length,
    totalWaste: parseFloat(vLog.reduce((s,v)=>s+v.waste,0).toFixed(1)),
    lastDoseDay: [...dLog].reverse().find(x=>x.dosed),
    vialsUsed: vNum,
  };
}

const fmt = d => d.toLocaleDateString("en-US",{month:"short",day:"numeric"});
const fmtF = d => d.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});
const fmtMY = d => d.toLocaleDateString("en-US",{month:"long",year:"numeric"});
const same = (a,b) => a.getFullYear()===b.getFullYear()&&a.getMonth()===b.getMonth()&&a.getDate()===b.getDate();
const diffD = (a,b) => Math.round((b-a)/864e5);

const SUPPS = [
  {name:"Creatine Monohydrate",dose:"5g/day",timing:"Any time, with water",why:"ATP regeneration for cycling power, lifting strength, and swim sprints. Also supports cognitive function and recovery between sessions.",tier:1},
  {name:"Vitamin C",dose:"1,000mg",timing:"Morning w/ food",why:"Essential cofactor for collagen synthesis — directly amplifies GHK-Cu's tissue rebuilding effects.",tier:1},
  {name:"Omega-3 Fish Oil",dose:"2–3g EPA/DHA",timing:"Split AM/PM w/ meals",why:"Anti-inflammatory via COX/LOX pathway — complements KPV and supports joint health for high-volume training.",tier:1},
  {name:"Vitamin D3 + K2",dose:"5,000 IU + 100mcg",timing:"Morning w/ fat",why:"Immune modulation, bone density for impact activities, muscle function. Most people are deficient.",tier:1},
  {name:"Magnesium Glycinate",dose:"400mg",timing:"Before bed",why:"Muscle recovery from training, sleep quality, cramping prevention. Glycinate form is gut-friendly alongside BPC-157.",tier:1},
  {name:"Collagen Peptides",dose:"10–15g",timing:"Morning in coffee/smoothie",why:"Raw amino acids (glycine, proline) that GHK-Cu needs to build new collagen in tendons, skin, and connective tissue.",tier:2},
  {name:"Zinc",dose:"25–30mg",timing:"With food",why:"Wound healing, immune support, testosterone maintenance during heavy training loads.",tier:2},
  {name:"NAC",dose:"600mg 2×/day",timing:"Empty stomach AM/PM",why:"Glutathione precursor — antioxidant defense during accelerated tissue remodeling and heavy training.",tier:2},
  {name:"Probiotics",dose:"50B+ CFU",timing:"Morning empty stomach",why:"Gut microbiome support alongside BPC-157 and KPV's gut healing effects.",tier:2},
  {name:"Glycine",dose:"3–5g",timing:"Evening",why:"Additional collagen precursor, sleep quality support, anti-inflammatory properties.",tier:3},
];

const TABS = [
  {id:"overview",label:"Overview"},
  {id:"recon",label:"Reconstitution"},
  {id:"timeline",label:"Timeline"},
  {id:"calendar",label:"Calendar"},
  {id:"supplements",label:"Supplements"},
];

export default function Protocol() {
  const [sid,setSid] = useState("a");
  const [tab,setTab] = useState("overview");
  const [calM,setCalM] = useState(new Date(2026,3,1));

  const subj = SUBJECTS[sid];
  const peps = useMemo(() => makePeptides(subj),[sid]);
  const cycles = useMemo(() => buildCycles(START,8),[]);
  const sims = useMemo(() => {
    const o={}; for(const p of peps) o[p.key]=simulate(p,START,cycles); return o;
  },[sid]);

  const allLast = peps.map(p=>sims[p.key].lastDoseDay?.date).filter(Boolean);
  const protEnd = allLast.length ? new Date(Math.max(...allLast)) : START;
  const protDays = diffD(START,protEnd)+1;
  const activeCyc = cycles.filter(c=>peps.some(p=>sims[p.key].dayLog.some(d=>d.dosed&&d.date>=c.onStart&&d.date<=c.onEnd)));
  const totalBac = peps.reduce((s,p)=>s+p.bac*p.vials,0);
  const bacV = Math.ceil(totalBac/30);

  // Calendar
  const mStart = new Date(calM.getFullYear(),calM.getMonth(),1);
  const mEnd = new Date(calM.getFullYear(),calM.getMonth()+1,0);
  const cells=[];
  for(let i=0;i<mStart.getDay();i++) cells.push(null);
  for(let d=1;d<=mEnd.getDate();d++){
    const dt=new Date(calM.getFullYear(),calM.getMonth(),d);
    const isOn=cycles.some(c=>dt>=c.onStart&&dt<=c.onEnd);
    const dp={}, ev=[];
    for(const p of peps){
      const dl=sims[p.key].dayLog.find(x=>same(x.date,dt));
      if(dl?.dosed) dp[p.key]=p;
      if(dl?.action==="reconstitute") ev.push({t:"mix",p,v:dl.vialNum});
      const vl=sims[p.key].vialLog.find(v=>same(v.disposeDate,dt));
      if(vl) ev.push({t:"toss",p,v:vl.num,w:vl.waste,r:vl.reason});
    }
    cells.push({dt,isOn,dp,ev});
  }

  const bg = "#141720";
  const bg2 = "#1B1F2E";
  const bg3 = "#232838";
  const bdr = "1px solid rgba(255,255,255,0.08)";
  const card = {background:bg2, border:bdr, borderRadius:14, padding:"18px 22px", marginBottom:12};

  return (
    <div style={{fontFamily:"'Inter',-apple-system,sans-serif",background:bg,color:"#C9CDD8",minHeight:"100vh"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}body{background:${bg}}
        .gb{cursor:pointer;transition:all .15s}.gb:hover{filter:brightness(1.12)}
        select{appearance:none;-webkit-appearance:none}
        .sn{width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;flex-shrink:0}
      `}</style>

      {/* HEADER */}
      <div style={{background:`linear-gradient(180deg,${bg2},${bg})`,borderBottom:bdr,padding:"32px 24px 24px"}}>
        <div style={{maxWidth:860,margin:"0 auto"}}>
          <div style={{fontSize:10,fontWeight:700,letterSpacing:2.5,textTransform:"uppercase",color:"#34D399",marginBottom:10,display:"flex",alignItems:"center",gap:8}}>
            <span style={{width:7,height:7,borderRadius:"50%",background:"#34D399",boxShadow:"0 0 8px #34D399"}}/>Active Protocol
          </div>
          <h1 style={{fontSize:28,fontWeight:800,color:"#F0F2F5",letterSpacing:-0.5,marginBottom:5}}>Peptide Research Protocol</h1>
          <p style={{fontSize:13,color:"#6B7280"}}>BPC-157/TB-500 · KPV · GHK-Cu — with structured cycling</p>
          <div style={{marginTop:18,display:"flex",gap:10}}>
            {Object.values(SUBJECTS).map(s=>(
              <button key={s.id} className="gb" onClick={()=>{setSid(s.id);setTab("overview")}} style={{
                padding:"10px 20px",borderRadius:12,
                border:sid===s.id?"2px solid #4F8CF7":"1px solid rgba(255,255,255,0.1)",
                background:sid===s.id?"rgba(79,140,247,0.1)":"rgba(255,255,255,0.03)",
                color:sid===s.id?"#93C5FD":"#6B7280",fontFamily:"'Inter',sans-serif",fontSize:13,fontWeight:600
              }}>
                <div>{s.label}</div>
                <div style={{fontSize:11,fontWeight:400,marginTop:2,opacity:0.7}}>{s.tag}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={{borderBottom:bdr,background:"#171B28",position:"sticky",top:0,zIndex:20}}>
        <div style={{maxWidth:860,margin:"0 auto",display:"flex",overflowX:"auto"}}>
          {TABS.map(t=>(
            <button key={t.id} className="gb" onClick={()=>setTab(t.id)} style={{
              padding:"13px 18px",fontSize:12,fontWeight:tab===t.id?600:400,
              fontFamily:"'Inter',sans-serif",color:tab===t.id?"#F0F2F5":"#52525B",
              background:"none",border:"none",
              borderBottom:tab===t.id?"2px solid #4F8CF7":"2px solid transparent",whiteSpace:"nowrap"
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      <div style={{maxWidth:860,margin:"0 auto",padding:"24px 24px 80px"}}>

        {/* ═══ OVERVIEW ═══ */}
        {tab==="overview"&&(<div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:22}}>
            {[
              {l:"Duration",v:`${protDays} days`,s:`${fmt(START)} → ${fmt(protEnd)}`},
              {l:"ON Cycles",v:activeCyc.length,s:"8wk on / 4wk off"},
              {l:"BAC Water",v:`${totalBac}ml`,s:`${bacV}×30ml vial${bacV>1?"s":""}`},
              {l:"Daily Shots",v:"3",s:"separate syringes"},
            ].map((x,i)=>(
              <div key={i} style={{...card,textAlign:"center",padding:14}}>
                <div style={{fontSize:10,fontWeight:600,letterSpacing:1,textTransform:"uppercase",color:"#52525B",marginBottom:5}}>{x.l}</div>
                <div style={{fontSize:20,fontWeight:800,color:"#F0F2F5"}}>{x.v}</div>
                <div style={{fontSize:11,color:"#52525B",marginTop:2}}>{x.s}</div>
              </div>
            ))}
          </div>

          {peps.map(p=>{
            const sim=sims[p.key];
            return(
              <div key={p.key} style={{...card,borderLeft:`3px solid ${p.color}`,display:"flex",gap:20,alignItems:"flex-start",flexWrap:"wrap"}}>
                <div style={{flex:"1 1 280px"}}>
                  <div style={{fontSize:16,fontWeight:700,color:"#F0F2F5",marginBottom:5}}>{p.name}</div>
                  <div style={{fontSize:13,color:"#7B8194",marginBottom:8}}>{p.purpose}</div>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                    <span style={{padding:"3px 10px",borderRadius:20,background:`${p.color}18`,color:p.color,fontSize:11,fontWeight:600}}>{p.doseLabel}/day</span>
                    <span style={{padding:"3px 10px",borderRadius:20,background:"rgba(255,255,255,0.05)",color:"#8B8FA3",fontSize:11}}>{p.vials} vials · {p.mg}mg each</span>
                    <span style={{padding:"3px 10px",borderRadius:20,background:p.doesCycle?"rgba(245,158,11,0.1)":"rgba(52,211,153,0.1)",color:p.doesCycle?"#FBBF24":"#34D399",fontSize:10,fontWeight:600}}>
                      {p.doesCycle?"Cycles 8/4":"Runs continuous"}
                    </span>
                  </div>
                </div>
                <div style={{display:"flex",gap:20,flexWrap:"wrap"}}>
                  {[
                    {l:"Active Days",v:sim.totalDosed,c:"#F0F2F5"},
                    {l:"Vials Used",v:`${sim.vialsUsed}/${p.vials}`,c:"#F0F2F5"},
                    {l:"Last Dose",v:sim.lastDoseDay?fmt(sim.lastDoseDay.date):"—",c:"#F0F2F5"},
                    {l:"Waste",v:sim.totalWaste>0?`${sim.totalWaste}mg`:"None",c:sim.totalWaste>0?"#FBBF24":"#34D399"},
                  ].map((x,i)=>(
                    <div key={i} style={{textAlign:"center"}}>
                      <div style={{fontSize:9,color:"#52525B",textTransform:"uppercase",letterSpacing:0.5,marginBottom:3}}>{x.l}</div>
                      <div style={{fontSize:15,fontWeight:700,color:x.c}}>{x.v}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          <div style={{...card,background:"linear-gradient(135deg,rgba(79,140,247,0.05),rgba(52,211,153,0.05))"}}>
            <div style={{fontSize:14,fontWeight:700,color:"#F0F2F5",marginBottom:8}}>How They Work Together</div>
            <div style={{fontSize:13,color:"#8B8FA3",lineHeight:1.7}}>
              <strong style={{color:"#4F8CF7"}}>BPC-157 + TB-500</strong> coordinate repair — BPC-157 organizes healing and upregulates growth factors while TB-500 reduces inflammation and mobilizes stem cells. <strong style={{color:"#34D399"}}>GHK-Cu</strong> drives rebuild quality — collagen, elastin, and younger gene expression. <strong style={{color:"#A78BFA"}}>KPV</strong> suppresses NF-κB inflammation so repair proceeds without immune interference. KPV runs continuously since it's a simple anti-inflammatory tripeptide — no receptor desensitization concern.
            </div>
          </div>

          <div style={{...card,borderLeft:"3px solid #FBBF24"}}>
            <div style={{fontSize:14,fontWeight:700,color:"#FBBF24",marginBottom:5}}>Cycling Logic</div>
            <div style={{fontSize:13,color:"#8B8FA3",lineHeight:1.7}}>
              <strong style={{color:"#F0F2F5"}}>BPC-157/TB-500 and GHK-Cu</strong> cycle 8 weeks on, 4 weeks off to prevent receptor desensitization. <strong style={{color:"#F0F2F5"}}>KPV</strong> runs continuously — as a tripeptide fragment it doesn't carry the same desensitization risk. Not all compounds need to start and stop together. A vial won't be opened if there isn't enough time left in the cycle to use a meaningful portion of it.
            </div>
          </div>
        </div>)}

        {/* ═══ RECONSTITUTION ═══ */}
        {tab==="recon"&&(<div>
          <div style={{fontSize:22,fontWeight:800,color:"#F0F2F5",marginBottom:4}}>Reconstitution Guide</div>
          <p style={{fontSize:13,color:"#6B7280",marginBottom:24}}>How to prepare and dose each compound. Same process, different volumes.</p>

          {/* Shopping */}
          <div style={{...card}}>
            <div style={{fontSize:14,fontWeight:700,color:"#F0F2F5",marginBottom:12}}>What You Need</div>
            {[
              {i:"Bacteriostatic Water (BAC)",d:`${bacV} × 30ml vials (${totalBac}ml total needed)`},
              {i:"Insulin Syringes",d:`U-100, 1ml, 29-31 gauge, ½ inch`},
              {i:"Alcohol Swabs",d:"1 box — wipe every vial top before drawing"},
              {i:"Sharps Container",d:"For used syringes — never trash or reuse"},
            ].map((r,i)=>(
              <div key={i} style={{display:"flex",gap:12,padding:"10px 14px",background:"rgba(255,255,255,0.02)",borderRadius:10,marginBottom:6,alignItems:"center"}}>
                <span style={{color:"#34D399",fontSize:15,flexShrink:0}}>✓</span>
                <div><span style={{fontSize:13,fontWeight:600,color:"#F0F2F5"}}>{r.i}</span> — <span style={{fontSize:12,color:"#7B8194"}}>{r.d}</span></div>
              </div>
            ))}
          </div>

          {/* Per-peptide reconstitution detail */}
          <div style={{fontSize:16,fontWeight:800,color:"#F0F2F5",margin:"24px 0 14px"}}>Mixing Each Compound</div>

          {peps.map(p=>(
            <div key={p.key} style={{...card,borderLeft:`3px solid ${p.color}`,marginBottom:16}}>
              <div style={{fontSize:15,fontWeight:700,color:p.color,marginBottom:14}}>{p.name}</div>

              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:10,marginBottom:16}}>
                {[
                  {l:"Vial Size",v:`${p.mg}mg`,s:"lyophilized powder"},
                  {l:"Add BAC Water",v:`${p.bac}ml`,s:`= ${p.bac*100} units on syringe`},
                  {l:"Concentration",v:p.conc,s:"after mixing"},
                  {l:"Your Dose",v:p.doseLabel,s:`draw ${p.units} units (${(p.units/100).toFixed(1)}ml)`},
                  {l:"Doses Per Vial",v:`${Math.floor(p.mg/p.dose)}`,s:`${Math.floor(p.mg/p.dose)} days if daily`},
                  {l:"Shelf Life",v:"28 days",s:"refrigerated after mixing"},
                ].map((x,i)=>(
                  <div key={i} style={{background:"rgba(0,0,0,0.2)",borderRadius:10,padding:"10px 14px"}}>
                    <div style={{fontSize:9,color:"#6B7280",textTransform:"uppercase",letterSpacing:0.5,marginBottom:3}}>{x.l}</div>
                    <div style={{fontSize:16,fontWeight:700,color:"#F0F2F5"}}>{x.v}</div>
                    <div style={{fontSize:11,color:"#6B7280"}}>{x.s}</div>
                  </div>
                ))}
              </div>

              {/* Syringe visual */}
              <div style={{background:"rgba(0,0,0,0.25)",borderRadius:10,padding:"14px 18px",marginBottom:0}}>
                <div style={{fontSize:12,fontWeight:600,color:"#F0F2F5",marginBottom:8}}>Syringe Reference</div>
                <div style={{display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
                  {/* Syringe diagram */}
                  <div style={{position:"relative",width:200,height:28,background:"rgba(255,255,255,0.06)",borderRadius:14,overflow:"hidden",border:"1px solid rgba(255,255,255,0.1)"}}>
                    <div style={{position:"absolute",left:0,top:0,height:"100%",width:`${p.units}%`,background:`${p.color}30`,borderRadius:14}}/>
                    {[10,20,30,40,50,60,70,80,90].map(u=>(
                      <div key={u} style={{position:"absolute",left:`${u}%`,top:0,height:"100%",width:1,background:u===p.units?"#F0F2F5":"rgba(255,255,255,0.06)"}}/>
                    ))}
                    <div style={{position:"absolute",left:`${p.units}%`,top:-2,transform:"translateX(-50%)",fontSize:10,fontWeight:700,color:p.color}}>▼</div>
                  </div>
                  <div style={{fontSize:13,color:"#8B8FA3"}}>
                    Fill to the <strong style={{color:p.color}}>{p.units} unit</strong> mark = <strong style={{color:"#F0F2F5"}}>{p.doseLabel}</strong>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* How to Mix */}
          <div style={{fontSize:16,fontWeight:800,color:"#F0F2F5",margin:"28px 0 14px"}}>Step-by-Step: Mixing a New Vial</div>
          {[
            {n:1,t:"Wipe the vial",d:"Clean the rubber stopper with an alcohol swab. Let it air dry for a few seconds.",c:"#4F8CF7"},
            {n:2,t:"Draw bacteriostatic water",d:"With a fresh syringe, slowly draw the correct amount of BAC water (see amounts above). Pull steadily to avoid air bubbles.",c:"#4F8CF7"},
            {n:3,t:"Inject into the vial slowly",d:"Insert the needle through the stopper at a slight angle. Release the water SLOWLY down the inside glass wall — never spray directly onto the powder. This protects the peptide structure.",c:"#4F8CF7"},
            {n:4,t:"Let it dissolve",d:"Wait 2–3 minutes. Then gently swirl the vial — never shake. The solution should be completely clear with no particles or cloudiness.",c:"#4F8CF7"},
            {n:5,t:"Label and refrigerate",d:"Write today's date on the vial. Store upright in the fridge at 36–46°F (2–8°C). Good for exactly 28 days from this date — then discard regardless of how much is left.",c:"#4F8CF7"},
          ].map(s=>(
            <div key={s.n} style={{...card,display:"flex",gap:16,alignItems:"flex-start",padding:"16px 20px",marginBottom:8}}>
              <div className="sn" style={{background:`${s.c}22`,color:s.c}}>{s.n}</div>
              <div><div style={{fontSize:14,fontWeight:700,color:"#F0F2F5",marginBottom:3}}>{s.t}</div><div style={{fontSize:13,color:"#8B8FA3",lineHeight:1.6}}>{s.d}</div></div>
            </div>
          ))}

          {/* How to Inject */}
          <div style={{fontSize:16,fontWeight:800,color:"#F0F2F5",margin:"28px 0 14px"}}>Step-by-Step: Daily Injection</div>
          <p style={{fontSize:13,color:"#6B7280",marginBottom:14}}>Repeat for each compound. Always use a fresh syringe — never combine peptides in one syringe.</p>
          {[
            {n:1,t:"Draw your dose",d:"Swab the vial top. Insert syringe needle, flip vial upside down, and slowly pull the plunger to your dose mark.",c:"#34D399"},
            {n:2,t:"Remove air bubbles",d:"Hold syringe needle-up. Flick the barrel gently — bubbles float to the top. Push the plunger slightly until a tiny drop appears at the needle tip.",c:"#34D399"},
            {n:3,t:"Choose injection site",d:"Pinch a fold of skin on your abdomen (2 inches from navel), upper thigh, or upper arm. Rotate sites daily to avoid irritation.",c:"#34D399"},
            {n:4,t:"Inject subcutaneously",d:"Insert needle at a 45° angle into the pinched skin fold. Push the plunger slowly and steadily. Withdraw, apply light pressure with a clean swab.",c:"#34D399"},
          ].map(s=>(
            <div key={s.n} style={{...card,display:"flex",gap:16,alignItems:"flex-start",padding:"16px 20px",marginBottom:8}}>
              <div className="sn" style={{background:`${s.c}22`,color:s.c}}>{s.n}</div>
              <div><div style={{fontSize:14,fontWeight:700,color:"#F0F2F5",marginBottom:3}}>{s.t}</div><div style={{fontSize:13,color:"#8B8FA3",lineHeight:1.6}}>{s.d}</div></div>
            </div>
          ))}

          {sid==="b"&&(
            <div style={{...card,borderLeft:"3px solid #4F8CF7",background:"rgba(79,140,247,0.04)"}}>
              <div style={{fontSize:13,fontWeight:700,color:"#93C5FD",marginBottom:4}}>Subject B — Targeted Injection</div>
              <div style={{fontSize:13,color:"#8B8FA3",lineHeight:1.6}}>For BPC-157/TB-500, consider rotating injection sites near the right knee and lower back/QL region to enhance local tissue repair where you need it most.</div>
            </div>
          )}

          <div style={{...card,borderLeft:"3px solid #EF4444",background:"rgba(239,68,68,0.04)"}}>
            <div style={{fontSize:14,fontWeight:700,color:"#FCA5A5",marginBottom:8}}>Rules</div>
            <div style={{fontSize:13,color:"#FDA4AF",lineHeight:1.8}}>
              • <strong>One syringe, one compound.</strong> Never mix peptides in the same syringe.<br/>
              • Never reuse a syringe — into the sharps container immediately.<br/>
              • Discard any reconstituted vial after 28 days, even with liquid remaining.<br/>
              • If solution looks cloudy, has particles, or changed color — throw it out.<br/>
              • Keep all reconstituted vials refrigerated. Never freeze.
            </div>
          </div>
        </div>)}

        {/* ═══ TIMELINE ═══ */}
        {tab==="timeline"&&(<div>
          <div style={{fontSize:22,fontWeight:800,color:"#F0F2F5",marginBottom:4}}>Cycle Timeline</div>
          <p style={{fontSize:13,color:"#6B7280",marginBottom:8}}>BPC/TB4 and GHK-Cu cycle 8 weeks on, 4 weeks off. KPV runs continuously through everything.</p>

          {/* KPV continuous bar */}
          <div style={{...card,borderLeft:"3px solid #A78BFA",marginBottom:20}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
              <span style={{padding:"3px 10px",borderRadius:20,background:"rgba(167,139,250,0.15)",color:"#A78BFA",fontSize:11,fontWeight:700}}>CONTINUOUS</span>
              <span style={{fontSize:14,fontWeight:600,color:"#F0F2F5"}}>KPV</span>
              <span style={{fontSize:12,color:"#6B7280"}}>{fmt(START)} → {sims.kpv.lastDoseDay?fmt(sims.kpv.lastDoseDay.date):"—"} ({sims.kpv.totalDosed} days straight, no breaks)</span>
            </div>
            <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
              {sims.kpv.vialLog.map(v=>(
                <div key={v.num} style={{padding:"4px 10px",background:"rgba(167,139,250,0.08)",borderRadius:6,fontSize:11,color:"#A78BFA"}}>
                  #{v.num} {fmt(v.reconDate)} → {fmt(v.endDate)}
                </div>
              ))}
            </div>
          </div>

          {activeCyc.map(c=>{
            const cycVials={};
            for(const p of peps.filter(p=>p.doesCycle)) cycVials[p.key]=sims[p.key].vialLog.filter(v=>v.reconDate>=c.onStart&&v.reconDate<=c.onEnd);
            const hasNext = peps.some(p=>p.doesCycle&&sims[p.key].dayLog.some(d=>d.dosed&&d.date>c.offEnd));
            const cycActive = peps.filter(p=>p.doesCycle&&sims[p.key].dayLog.some(d=>d.dosed&&d.date>=c.onStart&&d.date<=c.onEnd));

            return(
              <div key={c.num} style={{marginBottom:24}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                  <span style={{fontSize:13,fontWeight:800,color:"#F0F2F5",background:bg3,padding:"5px 14px",borderRadius:20}}>Cycle {c.num}</span>
                  <div style={{display:"flex",gap:4}}>{cycActive.map(p=><div key={p.key} style={{width:10,height:10,borderRadius:3,background:p.color}}/>)}</div>
                </div>

                <div style={{...card,borderLeft:"3px solid #34D399",marginBottom:8}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12,flexWrap:"wrap"}}>
                    <span style={{padding:"4px 12px",borderRadius:20,background:"rgba(52,211,153,0.12)",color:"#34D399",fontSize:11,fontWeight:700}}>ON — DOSING</span>
                    <span style={{fontSize:14,fontWeight:600,color:"#F0F2F5"}}>{fmt(c.onStart)} → {fmt(c.onEnd)}</span>
                    <span style={{fontSize:12,color:"#52525B"}}>8 weeks</span>
                  </div>

                  {peps.filter(p=>p.doesCycle).map(p=>{
                    const vials=cycVials[p.key]; if(!vials||!vials.length) return null;
                    return(
                      <div key={p.key} style={{marginBottom:8}}>
                        <div style={{fontSize:12,fontWeight:700,color:p.color,marginBottom:5,display:"flex",alignItems:"center",gap:6}}>
                          <div style={{width:8,height:8,borderRadius:2,background:p.color}}/>{p.short}
                        </div>
                        {vials.map(v=>(
                          <div key={v.num} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 12px",background:"rgba(0,0,0,0.15)",borderRadius:8,marginBottom:3,fontSize:12,flexWrap:"wrap"}}>
                            <span style={{fontWeight:700,color:"#F0F2F5",minWidth:22}}>#{v.num}</span>
                            <span style={{color:"#34D399"}}>Mix {fmt(v.reconDate)}</span>
                            <span style={{color:"#3F3F46"}}>→</span>
                            <span style={{color:v.reason==="empty"?"#8B8FA3":"#FBBF24"}}>
                              {v.reason==="empty"?`Empty ${fmt(v.endDate)}`:`Expires ${fmt(v.endDate)}`}
                            </span>
                            {v.waste>0.01&&<span style={{color:"#FBBF24",marginLeft:"auto",fontWeight:600}}>⚠ {v.waste}mg waste</span>}
                          </div>
                        ))}
                      </div>
                    );
                  })}

                  {peps.filter(p=>p.doesCycle).filter(p=>{const l=sims[p.key].lastDoseDay;return l&&l.date>=c.onStart&&l.date<c.onEnd}).map(p=>(
                    <div key={p.key} style={{marginTop:6,padding:"8px 12px",borderRadius:8,background:"rgba(251,191,36,0.06)",border:"1px solid rgba(251,191,36,0.15)",fontSize:12,color:"#FBBF24"}}>
                      {p.short} supply exhausted {fmt(sims[p.key].lastDoseDay.date)} — {diffD(sims[p.key].lastDoseDay.date,c.onEnd)} days left in cycle without it
                    </div>
                  ))}
                </div>

                {hasNext&&(
                  <div style={{...card,borderLeft:"3px solid #3F3F46",background:"rgba(255,255,255,0.01)",marginBottom:0}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <span style={{padding:"4px 12px",borderRadius:20,background:"rgba(255,255,255,0.04)",color:"#6B7280",fontSize:11,fontWeight:700}}>OFF — REST</span>
                      <span style={{fontSize:14,fontWeight:600,color:"#6B7280"}}>{fmt(c.offStart)} → {fmt(c.offEnd)}</span>
                      <span style={{fontSize:12,color:"#3F3F46"}}>4 weeks · BPC/TB4 & GHK-Cu paused · KPV continues</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          <div style={{textAlign:"center",padding:24,color:"#3F3F46"}}>
            <div style={{fontSize:20,marginBottom:6}}>🏁</div>
            <div style={{fontSize:14,fontWeight:600}}>All supply exhausted</div>
            <div style={{fontSize:12,marginTop:4}}>{fmtF(protEnd)}</div>
          </div>
        </div>)}

        {/* ═══ CALENDAR ═══ */}
        {tab==="calendar"&&(<div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <button className="gb" onClick={()=>setCalM(new Date(calM.getFullYear(),calM.getMonth()-1,1))} style={{background:bg3,border:bdr,color:"#F0F2F5",borderRadius:10,padding:"8px 16px",fontFamily:"'Inter',sans-serif",fontSize:12}}>←</button>
            <div style={{fontSize:17,fontWeight:700,color:"#F0F2F5"}}>{fmtMY(calM)}</div>
            <button className="gb" onClick={()=>setCalM(new Date(calM.getFullYear(),calM.getMonth()+1,1))} style={{background:bg3,border:bdr,color:"#F0F2F5",borderRadius:10,padding:"8px 16px",fontFamily:"'Inter',sans-serif",fontSize:12}}>→</button>
          </div>

          <div style={{display:"flex",gap:14,marginBottom:12,flexWrap:"wrap"}}>
            {peps.map(p=>(<div key={p.key} style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:"#7B8194"}}><div style={{width:10,height:10,borderRadius:3,background:p.color}}/>{p.short}</div>))}
            <div style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:"#7B8194"}}><div style={{width:10,height:10,borderRadius:3,background:"#34D399"}}/>Mix</div>
            <div style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:"#7B8194"}}><div style={{width:10,height:10,borderRadius:3,background:"#EF4444"}}/>Toss</div>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2}}>
            {["S","M","T","W","T","F","S"].map((d,i)=>(<div key={i} style={{textAlign:"center",padding:"8px 0",fontSize:10,fontWeight:600,color:"#52525B",letterSpacing:1}}>{d}</div>))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2}}>
            {cells.map((cell,i)=>{
              if(!cell) return <div key={`e${i}`} style={{minHeight:72,background:bg2,borderRadius:6}}/>;
              const {dt,isOn,dp,ev}=cell;
              const hasDose=Object.keys(dp).length>0;
              const isOff=!isOn&&dt>=START&&dt<=protEnd&&!hasDose;
              return(
                <div key={i} style={{
                  minHeight:72,padding:"5px 5px 3px",borderRadius:6,
                  background:isOff?`repeating-linear-gradient(135deg,${bg2},${bg2} 3px,${bg} 3px,${bg} 6px)`:hasDose?bg3:bg2,
                  border:same(dt,new Date())?`1px solid #4F8CF7`:"1px solid transparent",
                }}>
                  <div style={{fontSize:11,fontWeight:same(dt,new Date())?700:400,color:hasDose?"#F0F2F5":isOff?"#3F3F46":"#2A2E3D",marginBottom:3}}>{dt.getDate()}</div>
                  {hasDose&&<div style={{display:"flex",gap:2,marginBottom:2}}>{Object.entries(dp).map(([k,p])=><div key={k} style={{width:7,height:7,borderRadius:2,background:p.color}}/>)}</div>}
                  {ev.map((e,j)=>(
                    <div key={j} style={{fontSize:7,fontWeight:700,letterSpacing:.3,textTransform:"uppercase",lineHeight:1.5,color:e.t==="mix"?"#34D399":"#EF4444"}}>
                      {e.t==="mix"?"MIX":"TOSS"} {e.p.short}
                    </div>
                  ))}
                  {isOff&&!ev.length&&<div style={{fontSize:7,color:"#2A2E3D",marginTop:2}}>OFF</div>}
                </div>
              );
            })}
          </div>
        </div>)}

        {/* ═══ SUPPLEMENTS ═══ */}
        {tab==="supplements"&&(<div>
          <div style={{fontSize:22,fontWeight:800,color:"#F0F2F5",marginBottom:4}}>Supplements</div>
          <p style={{fontSize:13,color:"#6B7280",marginBottom:24}}>Cofactors and performance support for a protocol that includes cycling, weight training, and swimming.</p>

          {[
            {tier:1,label:"Essential",color:"#34D399",desc:"Start day one"},
            {tier:2,label:"Recommended",color:"#4F8CF7",desc:"Add if budget allows"},
            {tier:3,label:"Optional",color:"#6B7280",desc:"Nice to have"},
          ].map(t=>(
            <div key={t.tier} style={{marginBottom:24}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                <span style={{padding:"3px 12px",borderRadius:20,background:`${t.color}18`,color:t.color,fontSize:11,fontWeight:700}}>{t.label}</span>
                <span style={{fontSize:12,color:"#52525B"}}>{t.desc}</span>
              </div>
              {SUPPS.filter(s=>s.tier===t.tier).map((sup,i)=>(
                <div key={i} style={{...card,borderLeft:`3px solid ${t.color}`,marginBottom:8,padding:"14px 18px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:6,marginBottom:4}}>
                    <span style={{fontSize:14,fontWeight:700,color:"#F0F2F5"}}>{sup.name}</span>
                    <div style={{display:"flex",gap:12}}>
                      <span style={{fontSize:12,fontWeight:600,color:t.color}}>{sup.dose}</span>
                      <span style={{fontSize:12,color:"#52525B"}}>{sup.timing}</span>
                    </div>
                  </div>
                  <div style={{fontSize:13,color:"#8B8FA3",lineHeight:1.5}}>{sup.why}</div>
                </div>
              ))}
            </div>
          ))}

          <div style={{...card,borderLeft:"3px solid #A78BFA"}}>
            <div style={{fontSize:14,fontWeight:700,color:"#C4B5FD",marginBottom:12}}>Daily Timing</div>
            {[
              {time:"Morning · empty stomach",items:"Peptide injections (all 3) → Probiotics → wait 20 min"},
              {time:"Morning · with breakfast",items:"Creatine · Vitamin D3+K2 · Vitamin C · Omega-3 (half) · Collagen"},
              {time:"Midday · with food",items:"NAC (1st dose) · Zinc"},
              {time:"Evening · with dinner",items:"Omega-3 (half) · NAC (2nd dose)"},
              {time:"Before bed",items:"Magnesium Glycinate · Glycine"},
            ].map((s,i)=>(
              <div key={i} style={{display:"flex",gap:16,padding:"8px 0",borderBottom:i<4?"1px solid rgba(255,255,255,0.04)":"none"}}>
                <div style={{fontSize:12,fontWeight:600,color:"#A78BFA",minWidth:180,flexShrink:0}}>{s.time}</div>
                <div style={{fontSize:13,color:"#8B8FA3"}}>{s.items}</div>
              </div>
            ))}
          </div>

          <div style={{...card,borderLeft:"3px solid #FBBF24",background:"rgba(251,191,36,0.03)"}}>
            <div style={{fontSize:14,fontWeight:700,color:"#FBBF24",marginBottom:6}}>Training Note</div>
            <div style={{fontSize:13,color:"#8B8FA3",lineHeight:1.7}}>
              <strong style={{color:"#F0F2F5"}}>Injection timing around workouts:</strong> Inject peptides in the morning before training or at least 30 minutes before a workout. BPC-157/TB-500 may enhance recovery when injected post-workout as well. Creatine timing doesn't matter — just take it daily with water. On heavy training days (long rides, heavy lifts), the recovery benefits of this stack will be most noticeable.
            </div>
          </div>
        </div>)}
      </div>

      <div style={{borderTop:bdr,padding:"20px 24px",textAlign:"center"}}>
        <div style={{fontSize:11,color:"#2A2E3D"}}>Research protocol · For investigational purposes only · {fmtF(new Date())}</div>
      </div>
    </div>
  );
}
