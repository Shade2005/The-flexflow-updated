const { Button, Eyebrow, StatBlock, RuleBox, DisciplineStrip } = window.TheFlexFlowDesignSystem_9ef44c;

/* Home — outcome-first, founder-led, one booking widget.
   Section order: hero → problem/solution → services glimpse → founder →
   case glimpse → process → booking → FAQ → final CTA.
   One accent, one job: the nav CTA hides while a Signal-filled button is on screen. */

const RULE_INK='1px solid var(--rule-on-ink)';
const RULE_LIGHT='1px solid var(--rule-on-light)';

const PROBLEMS=[
  ['“Our site looks like it was built in 2016 — and loads like it.”','Web design',
   'Rebuilt from the content out: fast, static, readable by a person and parsable by a crawler. No template bloat, no plugin stack to maintain.',
   'Figma → build → live, 4 weeks'],
  ['“ChatGPT recommends our competitor when someone asks for us.”','AI visibility · GEO / AEO',
   'Entity markup, answer blocks and source-worthy pages, so ChatGPT, Gemini and AI Overviews pull the answer from your site instead of theirs. Citations tracked prompt by prompt.',
   'Audit in 5 days · 20 prompts tracked monthly'],
  ['“We rank on page two for the one thing we actually sell.”','SEO',
   'Technical debt first, content second. You get the ranking delta for the terms that convert — not a traffic graph that goes up while enquiries stay flat.',
   'Reported monthly, terms named'],
  ['“Every deck, invoice and post looks like a different company.”','Brand identity',
   'A mark, a type system and the written rules that keep it intact after the engagement ends. Built so your team can apply it without asking.',
   '2–3 week sprint']
];

const SERVICES=[
  ['01','Web design','Sites built to be read by people and parsed by machines.','Live in 4 weeks','services'],
  ['02','AI visibility','GEO and AEO. Getting cited by ChatGPT, Gemini and AI Overviews.','Audit in 5 days','ai'],
  ['03','SEO','Technical fixes, then content. Ranking movement you can name.','Reported monthly','services'],
  ['04','Brand identity','Marks, type systems, and rules that survive the handover.','2–3 week sprint','services'],
  ['05','Social media','Templates you can run yourself, plus the first month written for you.','30 posts, one handover','services']
];

const CASES=[
  ['Case 01 · Local services','3.4×','Organic sessions over six months, after a rebuild and a technical pass. Enquiries tracked, not just traffic.'],
  ['Case 02 · B2B services','9 / 20','Tracked buying-intent prompts now cite the client, up from zero, three weeks after the GEO pass.'],
  ['Case 03 · Retail','−62%','Time to first contentful paint after the template stack came out and the build went static.']
];

const PROCESS=[
  ['01','Audit','Your site, your rankings, and the twenty prompts your buyers actually type. What is broken gets named, in writing.','Week 1'],
  ['02','Plan','A scoped sequence with a figure attached to each move, so you know what changes and what it is expected to shift.','Week 1–2'],
  ['03','Execute','Built and shipped in the agreed order. One weekly note, no status meetings, nothing goes live without your sign-off.','Week 2–6'],
  ['04','Results','Rankings, citations and enquiries reported monthly against the baseline taken in week one. The same numbers every time.','Monthly, ongoing']
];

const FAQ=[
  ['What does this cost?','It depends on scope, and the honest answer needs your site in front of both of us. Projects are quoted as a fixed figure after the audit; ongoing work runs as a monthly retainer. You get the number in writing before anything starts, and there is no charge for the call or the audit conversation.'],
  ['What is AI visibility, and is it different from SEO?','SEO gets you ranked in a list of links. AI visibility — GEO and AEO — gets your site used as the source when ChatGPT, Gemini or Google’s AI Overviews write the answer directly. Different mechanics: entity markup, structured answer blocks, and pages worth citing. They overlap, but ranking first no longer guarantees you get quoted, which is why they are scoped separately.'],
  ['Do I have to take all five services?','No. Most engagements start with one — usually the site or the AI visibility audit — and add a second within a quarter. The sequencing matters more than the count, and that is what the first call is for.'],
  ['Who actually does the work?','One person: the same one you meet on the call, scoping, building and reporting. Nothing is passed to a junior or a subcontractor. Where a specialist is genuinely required — photography, video, legal copy — you are told before it is commissioned.'],
  ['How long until anything changes?','Technical fixes move within weeks. Ranking movement on competitive terms is a three-to-six month conversation. AI citations tend to move fastest — the tracked example above went from zero to nine of twenty prompts in three weeks — but that depends on the state of the site you start from.'],
  ['What happens if we stop working together?','You keep everything. Files, repository, hosting, analytics and search accounts are in your name from day one, and brand work ships with written rules so your team can apply it without calling. No lock-in, no licence to renew.']
];

function KeyValue({k,v,onInk}){
  return <div style={{display:'grid',gap:6}}>
    <span style={{fontFamily:'var(--font-body)',fontWeight:'var(--weight-body-bold)',fontSize:'var(--size-eyebrow)',letterSpacing:'var(--track-mono-eyebrow)',textTransform:'uppercase',color:onInk?'var(--text-accent-on-ink)':'var(--text-accent)'}}>{k}</span>
    <span style={{fontSize:'var(--size-body)',lineHeight:1.5,color:onInk?'var(--ink-050)':'var(--text-body)'}}>{v}</span>
  </div>;
}

function ServiceRow({n,name,line,meta,onClick}){
  const [hover,setHover]=React.useState(false);
  return <button onClick={onClick} onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
    style={{display:'grid',gridTemplateColumns:'56px 1.1fr 1.6fr auto',gap:'var(--space-6)',alignItems:'center',width:'100%',
      textAlign:'left',cursor:'pointer',background:hover?'rgba(255,255,255,.04)':'transparent',
      border:'none',borderBottom:RULE_INK,borderRadius:0,padding:'var(--space-6) 0',transition:'var(--transition-control)'}}>
    <span style={{fontFamily:'var(--font-display)',fontWeight:'var(--weight-display-semi)',fontSize:'var(--size-eyebrow)',letterSpacing:'.08em',color:hover?'var(--signal-300)':'var(--ink-500)'}}>{n}</span>
    <span style={{fontFamily:'var(--font-display)',fontWeight:'var(--weight-display-semi)',letterSpacing:'var(--track-display)',fontSize:28,lineHeight:1.15,color:'var(--ink-050)'}}>{name}</span>
    <span style={{fontSize:'var(--size-body)',lineHeight:'var(--lh-body)',color:'var(--ink-300)'}}>{line}</span>
    <span style={{fontFamily:'var(--font-body)',fontSize:'var(--size-caption)',whiteSpace:'nowrap',textAlign:'right',color:hover?'var(--ink-050)':'var(--ink-500)'}}>{meta} →</span>
  </button>;
}

function ProblemRow({said,service,fix,proof}){
  const [hover,setHover]=React.useState(false);
  return <div onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
    style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'var(--space-7)',alignItems:'start',
      padding:'var(--space-6) 0',borderBottom:RULE_LIGHT,background:hover?'var(--ink-100)':'transparent',transition:'var(--transition-control)'}}>
    <p style={{margin:0,maxWidth:'24ch',fontFamily:'var(--font-display)',fontWeight:'var(--weight-display-semi)',letterSpacing:'var(--track-display)',fontSize:26,lineHeight:1.2,color:'var(--text-strong)'}}>{said}</p>
    <div style={{display:'grid',gap:'var(--space-3)',alignContent:'start'}}>
      <span style={{justifySelf:'start',fontFamily:'var(--font-body)',fontWeight:'var(--weight-body-bold)',fontSize:'var(--size-eyebrow)',letterSpacing:'var(--track-mono-eyebrow)',textTransform:'uppercase',color:'var(--ink-950)',border:'1px solid '+(hover?'var(--ink-950)':'var(--ink-200)'),padding:'5px 10px',transition:'var(--transition-control)'}}>{service}</span>
      <p style={{margin:0,maxWidth:'46ch',fontSize:'var(--size-body)',lineHeight:'var(--lh-body)',color:'var(--text-body)'}}>{fix}</p>
      <span style={{fontFamily:'var(--font-body)',fontWeight:'var(--weight-body-semi)',fontSize:'var(--size-caption)',color:'var(--text-accent)'}}>{proof}</span>
    </div>
  </div>;
}

function FaqItem({q,a,defaultOpen}){
  const [open,setOpen]=React.useState(!!defaultOpen);
  const [hover,setHover]=React.useState(false);
  return <div style={{borderBottom:RULE_LIGHT}}>
    <button onClick={()=>setOpen(o=>!o)} onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
      aria-expanded={open}
      style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:'var(--space-5)',width:'100%',
        background:'transparent',border:'none',borderRadius:0,cursor:'pointer',padding:'var(--space-5) 0',textAlign:'left',
        fontFamily:'var(--font-display)',fontWeight:'var(--weight-display-semi)',letterSpacing:'var(--track-display)',
        fontSize:'var(--size-h3)',lineHeight:1.25,color:hover?'var(--signal-600)':'var(--text-strong)',transition:'var(--transition-control)'}}>
      <span>{q}</span>
      <span style={{fontFamily:'var(--font-body)',fontSize:22,lineHeight:1,color:'var(--text-muted)',flex:'none'}}>{open?'–':'+'}</span>
    </button>
    {open&&<p style={{margin:'0 0 var(--space-5)',maxWidth:'60ch',color:'var(--text-body)'}}>{a}</p>}
  </div>;
}

function HomeScreen({onNavigate}){
  return <>
    {/* 1 — Hero. Problem first: the reader's situation before the service name. */}
    <GridField style={{background:'var(--surface-ink)'}}>
      <div style={{maxWidth:'var(--container-max)',margin:'0 auto',padding:'var(--space-9) var(--space-6) var(--space-8)',display:'grid',gridTemplateColumns:'1.4fr .6fr',gap:'var(--space-8)',alignItems:'end'}}>
        <div style={{display:'grid',gap:'var(--space-6)'}}>
          <Eyebrow onInk>Founder-led · 5 disciplines · 1 point of contact</Eyebrow>
          <h1 style={{margin:0,fontFamily:'var(--font-display)',fontWeight:'var(--weight-display-bold)',letterSpacing:'var(--track-display)',fontSize:'clamp(40px,5.4vw,80px)',lineHeight:'var(--lh-display)',color:'var(--ink-050)'}}>
            Someone asked AI who to hire.<br/>It didn’t say <span style={{color:'var(--signal-500)'}}>you</span>.
          </h1>
          <p style={{margin:0,maxWidth:'56ch',fontSize:'var(--size-body-lg)',lineHeight:'var(--lh-body-lg)',color:'var(--ink-300)'}}>
            Search stopped being ten blue links, and most sites were built for the old one. The FlexFlow rebuilds yours so people find it, Google ranks it and the answer engines quote it — then keeps it that way.
          </p>
          <div style={{display:'flex',gap:'var(--space-3)',flexWrap:'wrap'}}>
            <Button size="lg" onClick={()=>onNavigate('contact')}>Book a call</Button>
            <Button size="lg" variant="tertiary" onInk onClick={()=>onNavigate('contact')}>Contact us</Button>
          </div>
          <span style={{fontFamily:'var(--font-body)',fontSize:'var(--size-caption)',letterSpacing:'.06em',color:'var(--ink-500)'}}>30 minutes · No deck · Bring the site you already have</span>
        </div>
        <RuleBox onInk divided>
          <StatBlock onInk figure="3.4×" label="Median organic lift, 6 months"/>
          <StatBlock onInk figure="9 / 20" label="Tracked AI prompts citing a client, from 0"/>
          <StatBlock onInk figure="27" label="Businesses shipped since 2021"/>
        </RuleBox>
      </div>
      <div style={{maxWidth:'var(--container-max)',margin:'0 auto',padding:'0 var(--space-6)'}}>
        <DisciplineStrip items={DISCIPLINES} onSelect={id=>onNavigate(id==='ai'?'ai':'services')}/>
      </div>
    </GridField>

    {/* 2 — Problem / solution. Four pain points, each mapped to the discipline that fixes it. */}
    <Section>
      <SectionHead num="01" eyebrow="Where it breaks" title="Four sentences clients say before they call. Each one has a fix."
        lede="Nobody books a marketing studio because they want marketing. They book because something specific is losing them work."/>
      <div style={{borderTop:RULE_LIGHT}}>
        {PROBLEMS.map(([said,service,fix,proof])=><ProblemRow key={service} said={said} service={service} fix={fix} proof={proof}/>)}
      </div>
    </Section>

    {/* 3 — Services glimpse. All five, one line each, linking out. */}
    <GridField style={{background:'var(--surface-ink)'}}>
      <Section onInk>
        <SectionHead num="02" eyebrow="What that looks like" title="Five disciplines. Most people start with one." onInk
          lede="They connect: a rebuild that ignores how answers get cited is a rebuild you pay for twice. Take them in any order — the sequencing is part of the first call."/>
        <div style={{borderTop:RULE_INK}}>
          {SERVICES.map(([n,name,line,meta,dest])=><ServiceRow key={n} n={n} name={name} line={line} meta={meta} onClick={()=>onNavigate(dest)}/>)}
        </div>
      </Section>
    </GridField>

    {/* 4 — Founder trust. One contact, no team roster. */}
    <Section>
      <SectionHead num="03" eyebrow="Who you actually work with" title="The person who scopes the work is the person who builds it."/>
      <div style={{display:'grid',gridTemplateColumns:'1fr .8fr',gap:'var(--space-9)',alignItems:'start'}}>
        <div>
          <p style={{fontSize:'var(--size-body-lg)',lineHeight:'var(--lh-body-lg)',maxWidth:'54ch'}}>
            The FlexFlow is one practitioner across five disciplines. There is no account manager translating your brief into a ticket, no junior learning on your budget, and no handoff between a design agency and an SEO agency who blame each other in month three.
          </p>
          <p style={{fontSize:'var(--size-body-lg)',lineHeight:'var(--lh-body-lg)',maxWidth:'54ch'}}>
            That has a cost: capacity is finite, and some months are full. It also has a point — the reply to your email comes from the person who wrote the code, and the answer to “why did you do it that way” arrives the same day.
          </p>
          <div style={{display:'flex',alignItems:'center',gap:'var(--space-4)',paddingTop:'var(--space-5)',borderTop:RULE_LIGHT}}>
            <img src="../../assets/logo-mark-signal.png" alt="" style={{height:34}}/>
            <div style={{fontFamily:'var(--font-body)',fontSize:'var(--size-caption)',letterSpacing:'.06em',color:'var(--text-muted)'}}>
              <strong style={{display:'block',fontFamily:'var(--font-display)',fontWeight:'var(--weight-display-semi)',letterSpacing:'var(--track-display)',fontSize:'var(--size-h3)',color:'var(--text-strong)'}}>Founder</strong>
              The FlexFlow · Working with clients since 2021
            </div>
          </div>
        </div>
        <RuleBox divided>
          <KeyValue k="Your point of contact" v="One person, from the first call to the monthly report."/>
          <KeyValue k="Reply window" v="48 hours on scoped changes. Same day during an active build."/>
          <KeyValue k="What you own" v="Every file, repo and account is in your name from day one."/>
          <KeyValue k="Capacity" v="Three active builds at a time. The call tells you which slot is open."/>
        </RuleBox>
      </div>
    </Section>

    {/* 5 — Case glimpse. Placeholders, labelled as such; the figures are real reporting. */}
    <GridField style={{background:'var(--surface-ink)'}}>
      <Section onInk>
        <SectionHead num="04" eyebrow="Selected work" title="Every case ends in a number." onInk
          lede="Three write-ups are being prepared with client approval. The figures below are already in the reporting; the full method follows."/>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',borderTop:RULE_INK,borderLeft:RULE_INK}}>
          {CASES.map(([tag,figure,line])=>
            <div key={tag} style={{display:'grid',gridTemplateRows:'auto auto 1fr auto',gap:'var(--space-4)',minHeight:280,padding:'var(--space-6)',borderRight:RULE_INK,borderBottom:RULE_INK}}>
              <span style={{fontFamily:'var(--font-body)',fontWeight:'var(--weight-body-bold)',fontSize:'var(--size-eyebrow)',letterSpacing:'var(--track-mono-eyebrow)',textTransform:'uppercase',color:'var(--ink-500)'}}>{tag}</span>
              <span style={{fontFamily:'var(--font-display)',fontWeight:'var(--weight-display-bold)',letterSpacing:'var(--track-display)',fontSize:56,lineHeight:.9,color:'var(--signal-300)'}}>{figure}</span>
              <span style={{fontSize:'var(--size-body)',lineHeight:'var(--lh-body)',color:'var(--ink-300)'}}>{line}</span>
              <span style={{alignSelf:'end',fontFamily:'var(--font-body)',fontSize:'var(--size-caption)',color:'var(--ink-500)',paddingTop:'var(--space-4)',borderTop:RULE_INK}}>Write-up in preparation</span>
            </div>)}
        </div>
        <div style={{marginTop:'var(--space-7)'}}>
          <Button variant="tertiary" onInk onClick={()=>onNavigate('work')}>See the work</Button>
        </div>
      </Section>
    </GridField>

    {/* 6 — Process snapshot. */}
    <Section>
      <SectionHead num="05" eyebrow="How it runs" title="Audit, plan, execute, results. You see the plan before anything is built."/>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',borderTop:RULE_LIGHT}}>
        {PROCESS.map(([n,title,body,when],i)=>
          <div key={n} style={{display:'grid',gridTemplateRows:'auto auto 1fr auto',gap:'var(--space-3)',padding:'var(--space-6) var(--space-5)',borderLeft:i?RULE_LIGHT:'none'}}>
            <span style={{fontFamily:'var(--font-display)',fontWeight:'var(--weight-display-semi)',fontSize:'var(--size-eyebrow)',letterSpacing:'.08em',color:'var(--text-accent)'}}>{n}</span>
            <h3 style={{margin:0}}>{title}</h3>
            <p style={{margin:0,fontSize:'var(--size-body-sm)',lineHeight:1.55,color:'var(--text-muted)'}}>{body}</p>
            <span style={{fontFamily:'var(--font-body)',fontSize:'var(--size-caption)',color:'var(--ink-950)',paddingTop:'var(--space-3)',borderTop:RULE_LIGHT}}>{when}</span>
          </div>)}
      </div>
    </Section>

    {/* 7 — Booking. The only widget on the site; every other CTA points here or to contact. */}
    <GridField style={{background:'var(--surface-ink)'}}>
      <Section onInk>
        <div style={{display:'grid',gridTemplateColumns:'.85fr 1.15fr',gap:'var(--space-8)',alignItems:'start'}}>
          <div>
            <SectionHead num="06" eyebrow="Book it" title="Pick a time. Thirty minutes, no deck." onInk/>
            <RuleBox onInk divided>
              <KeyValue onInk k="Before the call" v="Send the URL. A short read of the site and its rankings happens beforehand."/>
              <KeyValue onInk k="On the call" v="The two or three things costing you the most, and whether they are worth paying to fix."/>
              <KeyValue onInk k="After" v="A written scope with figures, or an honest “this isn’t the right fit”. No follow-up sequence."/>
            </RuleBox>
            <p style={{marginTop:'var(--space-6)',paddingTop:'var(--space-5)',borderTop:RULE_INK,fontSize:'var(--size-body-sm)',color:'var(--ink-300)'}}>
              Rather write it down first? <a href="#" onClick={e=>{e.preventDefault();onNavigate('contact');}}>Send the details instead</a> — same inbox, same person.
            </p>
          </div>
          {/* Scheduler iframe drops in here. */}
          <div style={{border:RULE_INK,minHeight:520,display:'grid',placeContent:'center',justifyItems:'center',gap:'var(--space-4)',textAlign:'center',padding:'var(--space-8) var(--space-6)'}}>
            <span style={{fontFamily:'var(--font-body)',fontWeight:'var(--weight-body-bold)',fontSize:'var(--size-eyebrow)',letterSpacing:'var(--track-mono-eyebrow)',textTransform:'uppercase',color:'var(--ink-500)'}}>Booking widget</span>
            <p style={{margin:0,maxWidth:'40ch',fontSize:'var(--size-body-sm)',lineHeight:1.55,color:'var(--ink-300)'}}>
              The scheduler embeds here — the single booking widget on the site. Every other call-to-action points to this section or to the contact form.
            </p>
            <Button onClick={()=>onNavigate('contact')}>Book a call</Button>
          </div>
        </div>
      </Section>
    </GridField>

    {/* 8 — FAQ. */}
    <Section>
      <SectionHead num="07" eyebrow="Before you book" title="The questions that come up on every first call."/>
      <div style={{borderTop:RULE_LIGHT,maxWidth:'56rem'}}>
        {FAQ.map(([q,a],i)=><FaqItem key={q} q={q} a={a} defaultOpen={i===0}/>)}
      </div>
    </Section>

    {/* 9 — Final CTA. */}
    <GridField style={{background:'var(--surface-ink)'}}>
      <Section onInk>
        <div style={{display:'grid',gap:'var(--space-7)',justifyItems:'start'}}>
          <Eyebrow onInk>One call, one person, one honest answer</Eyebrow>
          <h2 style={{margin:0,maxWidth:'16ch',fontFamily:'var(--font-display)',fontWeight:'var(--weight-display-bold)',letterSpacing:'var(--track-display)',fontSize:'var(--size-display)',lineHeight:'var(--lh-display)',color:'var(--ink-050)'}}>
            You already know<br/>the site needs to <span style={{color:'var(--signal-500)'}}>change</span>.
          </h2>
          <p style={{margin:0,maxWidth:'56ch',fontSize:'var(--size-body-lg)',lineHeight:'var(--lh-body-lg)',color:'var(--ink-300)'}}>
            Thirty minutes tells you whether it is worth paying anyone to change it — including us.
          </p>
          <div style={{display:'flex',gap:'var(--space-3)',flexWrap:'wrap'}}>
            <Button size="lg" onClick={()=>onNavigate('contact')}>Book a call</Button>
            <Button size="lg" variant="tertiary" onInk onClick={()=>onNavigate('contact')}>Contact us</Button>
          </div>
        </div>
      </Section>
    </GridField>
  </>;
}
Object.assign(window,{HomeScreen});
