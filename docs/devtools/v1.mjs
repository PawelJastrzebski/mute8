var y="https://paweljastrzebski.github.io/mute8-devtools/",g="MUTE-8-DEVTOOLS",c=o=>localStorage.setItem(g,o),D=()=>localStorage.getItem(g);var p=()=>{},m=JSON.stringify,C=JSON.parse,P=o=>{try{return C(o)}catch{return null}},l=window,I=document,j=(o,t)=>{let e=t??{width:600,height:400},s=l.screenLeft!=null?l.screenLeft:screen.left,n=l.screenTop!=null?l.screenTop:screen.top,r=l.innerWidth,h=l.innerHeight,i=I.documentElement,a=r||(i.clientWidth?i.clientWidth:screen.width),w=h||(i.clientHeight?i.clientHeight:screen.height),f=s+(e.xMove??0),T=n+(e.yMove??0);(e.centered??!0)&&(f+=a/2-e.width/2,T+=w/2-e.height/2);let x=e.target??"_blank",d=l.open(o,x,`width=${e.width}, height=${e.height} top=${T}, left=${f}, ${e.options??"resize=yes"}`);return d!=null&&d.focus&&d.focus(),d},H=o=>new URL(o).origin,L=(o,t)=>{if(o.origin!=t)throw new Error(`Invalid message origin: ${o.origin}, allowed: ${t}`)},M=(o,t,e)=>{l.addEventListener("message",s=>{let n=P(s.data);n&&n.type&&n.i===o&&(L(s,t),e(s.source,n));},!1);},O=(o,t,e,s,n)=>{let r={i:e,j:n,type:s};o?.postMessage(m(r),t);},S=class{constructor(o,t="1",e){this.id=t,this.origin=H(o),setTimeout(()=>{this.child||(this.child=j(o,e));},250),M(this.id,this.origin,(s,n)=>{var r,h,i;n.type==="msg"&&((r=this.onMessage)==null||r.call(this,C(n.j))),n.type==="child-open"&&((h=this.onChildOpen)==null||h.call(this)),s&&this.child==null&&n.type==="ping"&&(this.child=s,(i=this.onChildAttach)==null||i.call(this),O(this.child,this.origin,t,"host-attach",""));}),setInterval(()=>{var s;if(this.child&&this.child.closed){(s=this.onChildClose)==null||s.call(this),this.child=null;return}},100);}origin;child;onMessage=p;onChildOpen=p;onChildAttach=p;onChildClose=p;isOpen(){return !!this.child&&this.child.closed==!1}post(o){O(this.child,this.origin,this.id,"msg",m(o));}};var v=o=>{for(let t of Object.keys(o)){let e=o[t];e&&typeof e=="object"&&v(e);}return Object.freeze(o)},R={logger:{logChange:!1,logInit:!0},deepFreaze:!0},b=()=>new Date().getTime(),u=class{import=async()=>{};sotrageRegistry=new Map;dialogHost;payloadBuffer=[];stateOverrides={};constructor(){let t=this;document.addEventListener("keydown",function(e){e.ctrlKey&&e.shiftKey&&e.code==="Digit8"&&(t.openDevTools(),e.preventDefault());});}register(t,e=R){let s=this;return n=>{let r=i=>s.setStateInit(t,i),h=(i,a)=>{s.setStateChanged(t,i,a);};return this.sotrageRegistry.set(t,{label:t,proxy:n,onInit:r,onChange:h}),{BInit:i=>(r(i),e.logger.logInit&&console.table({[`${t}-init`]:i}),e.deepFreaze?v(i):i),BUpdate:i=>{let a=s.stateOverrides[t];return a&&(i=a.state),e.deepFreaze&&(i=v(i)),i},AChange:(i,a)=>{h(i,a),e.logger.logChange&&console.table({[`${t}-old`]:i,[`${t}-new`]:a});}}}}openDevTools(){if(this.dialogHost&&this.dialogHost.isOpen()){this.dialogHost.child?.focus();return}this.dialogHost=new S(y,"devtools",{height:550,width:1e3}),this.dialogHost.onMessage=this.handleMessage.bind(this),this.dialogHost.onChildOpen=this.onDevToolsDialogsOpen.bind(this),this.dialogHost.onChildAttach=this.onDevToolsDialogsOpen.bind(this),this.dialogHost.onChildClose=this.onDevToolsDialogClose.bind(this);}postPayload(t){this.dialogHost?.post(t),this.payloadBuffer=this.payloadBuffer.concat(...t);}setStateInit(t,e){this.stateOverrides[t]||this.postPayload([{stateInit:{storageLabel:t,state:e,time:b()}}]);}setStateChanged(t,e,s){this.stateOverrides[t]||this.postPayload([{stateChanged:{storageLabel:t,oldState:e,newState:s,time:b()}}]);}onDevToolsDialogClose(){c("closed"),this.handleMessage([{stateOverrides:{}}]);}onDevToolsDialogsOpen(){c("open");let t=Array.from(this.sotrageRegistry.entries());this.dialogHost.post([{init:{definitions:t.map(([e,s])=>({label:e})),overrides:this.stateOverrides}},...this.payloadBuffer]);}handleMessage(t){for(let e of t)if(e.hostCommand==="refresh-host"&&window.location.reload(),e.stateOverrides){this.stateOverrides=e.stateOverrides??{};for(let[s,n]of this.sotrageRegistry.entries()){let r=this.stateOverrides[s];r&&(n.proxy.mut=r);}}}};(()=>{let o=window[g]=new u;D()=="open"&&o.openDevTools();})();
