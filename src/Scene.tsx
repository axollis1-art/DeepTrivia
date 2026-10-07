export function Scene({depth=0,quiet=false}:{depth?:number;quiet?:boolean}){
 const band=depth<500?'surface':depth<1500?'twilight':depth<3500?'midnight':depth<5500?'abyss':'trench';
 return <div className={`scene ${band} ${quiet?'still':''}`} aria-hidden="true">
  <div className="sky"><div className="sun"/><svg className="cloud cloud-one" viewBox="0 0 150 35"><path d="M0 20h20V10h20V0h50v10h30v10h30v15H0z" fill="currentColor"/></svg><svg className="cloud cloud-two" viewBox="0 0 150 35"><path d="M0 20h20V10h20V0h50v10h30v10h30v15H0z" fill="currentColor"/></svg><svg className="boat" viewBox="0 0 140 90"><path d="M20 60h115l-20 25H35z" fill="#10273c"/><path d="M60 55V12h4v43z" fill="#10273c"/><path d="M68 15v38h42z" fill="#eff8fc"/><path d="M58 28v25H35z" fill="#f15c91"/><path d="M18 60h117v6H18z" fill="#f5bd69"/></svg></div>
  <div className="waterline"/><div className="water-glow"/>
  <svg className="reef" viewBox="0 0 1440 220" preserveAspectRatio="none"><path d="M0 130h80v-35h35v60h70v-45h35v-65h20v65h40v75h90v-45h30v-25h25v45h30v40h80v-15h90v-20h75v25h120v20h80v-35h50v-40h30v-25h20v70h70v-100h20v-30h20v70h30v65h55v-25h50v-60h20v-35h25v95h50v-40h40v-65h25v60h30v45h70v-30h70v110H0z" fill="currentColor"/></svg>
  {[0,1,2,3,4,5,6,7].map(i=><span key={i} className="bubble" style={{left:`${9+i*12}%`,animationDelay:`${i*-1.7}s`,width:6+(i%3)*4,height:6+(i%3)*4}}/>)}
  {[0,1,2].map(i=><svg key={i} className={`fish fish-${i}`} viewBox="0 0 90 34"><path d="M4 17l18-12v8h10V7h30v5h10v10H62v5H32v-6H22v8z" fill="currentColor"/><rect x="60" y="14" width="4" height="4" fill="#152f48"/></svg>)}
  <svg className="diver" viewBox="0 0 70 90" style={{top:`${depth===0?37:42+Math.min(depth/7000,1)*28}%`}}><path d="M22 5h27v6h6v27h-6v6H22v-6h-6V11h6z" fill="#f3bf75"/><path d="M18 17h36v15H18z" fill="#10273c"/><path d="M23 20h25v8H23z" fill="#59e1f4"/><path d="M25 44h20v25H25z" fill="#f15c91"/><path d="M14 48h9v18h-9zm32 0h9v18h-9z" fill="#f3bf75"/><path d="M23 68h9v14H14v-7h9zm15 0h9v7h9v7H38z" fill="#59e1f4"/><path d="M55 27h5v22h-6v-5h2V31h-1z" fill="#59e1f4"/></svg>
  <div className="ruler">{[0,1000,2000,3000,4000,5000,6000,7000].map(n=><div key={n}><span>{n.toLocaleString('en-GB')} m</span><i/></div>)}</div>
 </div>;
}
