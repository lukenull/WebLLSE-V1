/*
WebLLSE - Web Low-Level Synthesizer Experiment
Designed and built by LP

*/



const container = document.getElementById("container");
const addBtn = document.getElementById("addBtn");
const playBtn = document.getElementById("playBtn");
const startBtn = document.getElementById("startbtn");
const addvarb = document.getElementById("addvar");
const timesttxt=document.getElementById("timestart");
const timeend=document.getElementById("timeend");
const blocksizetxt=document.getElementById("blocksize");
const keyboarddiv=document.getElementById("keyboardcont")
const voicentxt=document.getElementById("voicenparam")
const propinput1=document.getElementById("valinput1");
const propinput2=document.getElementById("valinput2");
const exportsel=document.getElementById("exportselect");
const exportdesc=document.getElementById("exportdesc");
const exportbtn=document.getElementById("exportbtn");
const importbtn=document.getElementById("importbtn");
const fileinp=document.getElementById("fileimport");
const prevpresetbtn=document.getElementById("prevpreset");
const nextpresetbtn=document.getElementById("nextpreset");
const currpresetdd=document.getElementById("currentpreset");
const modgraphc=document.getElementById("modgraphc");
const gcmin=document.getElementById("gcmin");
const gcmax=document.getElementById("gcmax");
const addeff=document.getElementById("addeff");
const addeffsel=document.getElementById("addeffsel");
const effinstance=document.getElementById("fxi1");
const effprop=document.getElementById("fxi1prop");
const effcont=document.getElementById("fxcontainer")
const mixtrackinst=document.getElementById("mixtrkpre");
const addmixb=document.getElementById("addmix");
const mixtrackcont=document.getElementById("mixtrackcontainer");
const wrprefab=document.getElementById("wr-prefab");
const varrprefab=document.getElementById("varr-prefab");
const exportpbarlabel=document.getElementById("pbarlabel");
const exportpbarfill=document.getElementById("pbarfill");
const wavexpfreq=document.getElementById("wavexpfreq");
const pwarnproceed=document.getElementById("pwproceed");
const pwb=document.getElementById("portraitwarn");
const filenamef=document.getElementById("filenamef");
const projnamef=document.getElementById("projnamef");
const whitekeyp=document.querySelector(".whitekeyp");
const welbl1=document.getElementById("welbl1");
if (window.innerHeight>window.innerWidth) {
  pwb.style.display="flex";
}
pwarnproceed.addEventListener("click",()=>{
  pwb.style.display="none";
})
mixtrackinst.style.display="none"
wrprefab.style.display="none"
varrprefab.style.display="none"


import { generateAudioBuffer} from '../audiorun.js';
import {module as emodule} from '../effect_modules.js';


const notenames=[]
for (let i=0;i<127;i++) {
  notenames.push(["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"][i%12]+`${Math.floor(i/12)-1}`)
}


function setuniqueid(elmt) {
  let elmts=[elmt,...elmt.querySelectorAll("*")];
  let counter=0
  for (let e of elmts) {
    e.id+=`${(++counter)}`+`${Date.now()}`
  }
}

function wait(sec) {
  return new Promise(resolve => setTimeout(resolve, sec*1000));
}

function qget(element,q) {
  return element.querySelector(q)
}
function cget(element,name) {
  return element.querySelector(`[data-name="${name}"]`);
}
function getavailablett(tab) {
  let varph="a"
      const varpp="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
      while (varph in tab) {
        if (varph.slice(-1)=="z") {
            varph=varph.slice(0,-1)+"aa"
        } else {
            varph=varph.slice(0,-1)+varpp[varpp.indexOf(varph.slice(-1))+1]
        }
        
        
      }
  return varph;
}
function setexportprogress(label,amt) {
  exportpbarlabel.innerText=label;
  exportpbarfill.style.width=`${amt*100}%`
}

let numvoices=1;

voicentxt.addEventListener('input',function() {
  numvoices=Number(voicentxt.value)
})


let audioContext;
let sourceNode;

const varcont=document.getElementById("variablecon");
let waveformdata=[


];


importbtn.addEventListener('click',function() {
  fileinp.click()
})
let preloadall=false //whether preload all keys when click load vs load on key press


let letterknotes=['Z','S','X','D','C','V','G','B','H','N','J','M','Q','2','W','3','E','R','5','T','6','Y','7','U','I','9','O','0','P']
let kboctave=4
export let keyfrequency=[0];
let currentnote=-1
let notedown=false

const localblackp=[37,108,223,291,360]

let voices={}

let cursnd;

let selectedwave=null
let selectedwrect=null


let presets={}
let currentmodvar=""

let lwk;
let midckey;
for (let o=0;o<8;o++) { //Generate the piano keyboard
  let p=0;
  let p2=0;
  let zi=50;
  for (let i=0;i<12;i++) {
    const v=12*o+i
    const sv=String(v);
    let key;
    let isblack=false;
    let fil;
    zi-=1;
    if ([1,3,6,8,10].includes(i%12)) {
      key=document.createElement("div")
      key.className="black key";
      //key.style.left=`${434*o+localblackp[p]}px`
      isblack=true;
      p+=1;
    } else {
      key=whitekeyp.cloneNode(true);
      key.style.display="block";
      if (o==5) {
        key.className="white key midc";
        midckey=key;
      } else {
        key.className="white key";
      }
      fil=document.createElement("div");
      fil.className="wkfiller";
      
      lwk=fil;
      fil.style.zIndex=zi;
      p2+=1;
      key.querySelector(".whitekeyl1").innerText=notenames[12*o+i]
      key.querySelector(".whitekeyl2").innerText=`${12*o+i}`
    }
    
    const btn=document.createElement("button");
    
    btn.className="keybtn";
    
    if (fil) {
      fil.appendChild(key);
    }
    
    function keydown() {
      
      
      currentnote=12*o+i;
      keyfrequency[0]=440*2**((currentnote-33-36)/12)
      notedown=true;
      start2(true,sv);
    }
    function keyup() {
      
      
      if (voices[v]) {
        currentnote=-1;
      keyfrequency[0]=0;
      notedown=false;
        
        voices[sv].stop();
        delete voices[sv]
      }
    }
    if (isblack) {
      lwk.appendChild(key);
    } else {
      keyboarddiv.appendChild(fil);
      fil.appendChild(key)
    }
    
    key.appendChild(btn);
    if (o>=kboctave && v<12*kboctave+letterknotes.length) {
        document.addEventListener("keydown",function(event){
          const target=event.target
          const istyping=(target.tagName=='INPUT' || target.tagName=='TEXTAREA' || target.isContentEditable)
          
          if (event.key==letterknotes[v-12*kboctave].toLowerCase() && !istyping) {
            key.classList.add('active')
            keydown()
          }
        })
        document.addEventListener("keyup",function(event){
          const target=event.target
          const istyping=(target.tagName=='INPUT' || target.tagName=='TEXTAREA' || target.isContentEditable)
          if (event.key==letterknotes[v-12*kboctave].toLowerCase() && !istyping) {
            key.classList.remove('active')
            keyup()
          }
        })
      }
    key.addEventListener('mousedown',function(){
      keydown()
      
      
    
    });
    key.addEventListener('touchstart',function(e){
      e.stopPropagation()
      keydown()
    })
    key.addEventListener('mouseup',function(e){
      e.stopPropagation()
      keyup()
    });
    key.addEventListener('mouseleave',function(e){
      e.stopPropagation()
      keyup()
    })
    key.addEventListener('touchend',function(e){
      e.stopPropagation()
      keyup()
    })
  }
}


//midckey.scrollIntoView();
propinput1.addEventListener("input",function(){
  if (!selectedwave) return;
  selectedwave.frequency=propinput1.value;
  selectedwrect.querySelector(".freqinput").value=propinput1.value;

});
propinput2.addEventListener("input",function(){
  if (!selectedwave) return;
  selectedwave.amplitude=propinput2.value;
  selectedwrect.querySelector(".ampinput").value=propinput2.value;
});




fileinp.addEventListener("change",(event)=>{
  const file=event.target.files[0]
  const reader=new FileReader()
  reader.onload = function(e) {
    const fileContents = e.target.result;
    loadfromjson(fileContents);
  };
  
  reader.readAsText(file)
})




function stringtoprojectdata(stringd) {
  waveformdata=[]
  let parts=stringd.split("Ω")
  let waves=parts[0].split("∇")
  waves.forEach(wave =>{
    let waved=wave.split("∏")
    let waveform={waveform:waved[0],frequency:waved[1],amplitude:waved[2],phase:waved[3],modifiers:[]}
   
    if (waved.length>4 && waved[4]) {
      let mods=waved[4].split("∧")

    let modtab=[]
     mods.forEach(mod =>{
      let moddat=mod.split("∨")
      modtab.push({start:moddat[0],end:moddat[1],step:moddat[2],var:moddat[3]})
    })
    waveform.modifiers=modtab;
    }
    
    waveformdata.push(waveform);

  });
  variables={}
  let vars=parts[1].split("∏")
  if (vars.length>0 && vars[0]) {
    vars.forEach((svar)=>{
    let d=svar.split("∧")
    let k=d[0]
    let v=d[1]
    variables[k]=v
  })
  }
  
  return [waveformdata,variables]
}
function projectdatatostring() {
  let s=""
  waveformdata.forEach(wavei=>{
    let s2=`${wavei.waveform}∏${wavei.frequency}∏${wavei.amplitude}∏${wavei.phase}∏`
    wavei.modifiers.forEach(mod => {
      s2+=`${mod.start}∨${mod.end}∨${mod.step}∨${mod.var}∧`
    })
    if (s2.charAt(s2.length-1)=="∧") {
      s2=s2.slice(0,-1);
    }
    s+=s2+"∇";
    
  })
  if (s.charAt(s.length-1)=="∇" || s.charAt(s.length-1)=="∏") {
    s=s.slice(0,-1)

  }
 
  s+="Ω";
  for (const k in variables) {
    if (variables.hasOwnProperty(k)) {
      const v=variables[k]
      let s2=`${k}∧${v}`
      s+=s2+"∏"

    }
    
  }
  if (s.charAt(s.length-1)=="∏") {
    s=s.slice(0,-1);
  }
  s+=`Ω${timesttxt.value}Ω${timeend.value}Ω${blocksizetxt.value}Ω${voicentxt.value}`;
  
  return s
}
function downloadtosynthfile() {
  let sdata=projectdatatostring()

  const blob=new Blob([sdata],{type: 'text/plain'})
  const ourl=URL.createObjectURL(blob);
  const a=document.createElement("a")
  a.href=ourl
  a.download="sound.lls1"
  document.body.appendChild(a);
  a.click()
  URL.revokeObjectURL(url)
  document.body.removeChild(a)

}


function loadfromjson(string) {
  const json=JSON.parse(string)
  // waveformdata=json.waveformdata;
  // variables=json.variables;
  // effects=json.effects;
  // mixtracks=json.mixtracks;
  waveformdata=[]
  variables={}
  effects={}
  mixtracks={}
  timesttxt.value=json.timestart
  timeend.value=json.timeend
  voicentxt.value=json.voices
  blocksizetxt.value=json.blocksize
  container.replaceChildren()
  varcont.replaceChildren()
  effcont.replaceChildren()
  mixtrackcont.replaceChildren()
  projnamef.value=json._name;
  
  for (let wave of json.waveformdata) {
    const e=createWaveElement(wave)
    const nm=structuredClone(wave.modifiers)
    e[1].modifiers=[]
    for (let m of nm) {
      
      
      createModifier(e[0],e[1],"multiply",m)
      
    }
    container.appendChild(e[0])
  }
  for (let variable in json.variables) {
    if (!json.variables.hasOwnProperty(variable)) {continue}
    varcont.appendChild(addvariable(variable,json.variables[variable]))
  }
  for (let eff in json.effects) {
    if (!json.effects.hasOwnProperty(eff)) {continue}
    effcont.appendChild(addeffectobj(json.effects[eff].type,eff,json.effects[eff].params))
  }
  for (let mt in json.mixtracks) {
    if (!json.mixtracks.hasOwnProperty(mt)) {continue}
    mixtrackcont.appendChild(createmixertrack(mt,json.mixtracks[mt]))
  }
}
function sendfiletodownload(blob,filename) {
  const a=document.createElement("a")
  a.href=URL.createObjectURL(blob)
  a.download=filename;
  a.click()
}

async function generatewav(noteval,usetype=0) {

  switch(usetype) {
    case 0:
      keyfrequency[0]=440*2**((noteval-33-24)/12)
      break;
    case 1:
      keyfrequency[0]=440*2**(((notenames.indexOf(noteval)+1)-33-37)/12);
      break;
    case 2:
      keyfrequency[0]=noteval;
      break;
  }

  
  let buffer=await generatebuffer(false);
  buffer=buffer[0]

  const nchannels=buffer.numberOfChannels;
  const samplerate=buffer.sampleRate;
  const len=buffer.getChannelData(0).length*nchannels*2+44
  const wavdata=new ArrayBuffer(len)
  const view=new DataView(wavdata)
  function writesd(view,offset,str) {
    for (let i=0;i<str.length;i++) {
      view.setUint8(offset+i,str.charCodeAt(i))
    }
  }
  function nto16bpcm(out,offset,inp) {
    
      const s=mclamp(inp,-1,1)
      let h=s*0x7FFF
      if (s<0) {
        h=s*0x8000
      }
      out.setInt16(offset,h,true)
      offset+=2;
      return offset
  }
  writesd(view,0,"RIFF")
  view.setUint32(4,len-8,true)
  writesd(view,8,"WAVE")
  writesd(view,12,"fmt ")
  view.setUint32(16,16,true)
  view.setUint16(20,1,true)
  view.setUint16(22,nchannels,true)
  view.setUint32(24,samplerate,true)
  view.setUint32(28,samplerate*nchannels*2,true)
  view.setUint32(32,nchannels*2,true)
  view.setUint32(34,16,true)
  writesd(view,36,"data")
  view.setUint32(40,len-44,true)
  let offset=44

  
  
  for (let i=0;i<buffer.length;i++) {
    for (let j=0;j<nchannels;j++) {
      const cdat=buffer.getChannelData(j)
      offset=nto16bpcm(view,offset,cdat[i])

    }
   
  }
  return new Blob([view],{type:'audio/wav'})
}

async function downloadtosfz(low,high) {
  let stdat=`<group>\n`; 
  setexportprogress("Generating sample set...",0)
  for (let i=low;i<=high;i++) {
    const filename=`note${i}.wav`
    stdat+=`<region> sample=${filename} key=${i} lokey=${i} hikey=${i} lovel=0 hivel=127\n`
  }
  await wait(0.1)
  const zip=new JSZip()
  zip.file(`${projnamef.value}.sfz`,stdat)
  for (let i=low;i<=high;i++) {
    setexportprogress(`Generating sample ${i-low+1} of ${high-low}`,(i-low)/(high-low));
    const blob=await generatewav(i)
    const filename=`note${i}.wav`
    zip.file(filename,blob)
    await wait(0.1)
  }

  
  setexportprogress("Downloading to ZIP...",1);
  await wait(0.1)
  zip.generateAsync({type:'blob'}).then(content=>{
    const a=document.createElement("a")
    a.href=URL.createObjectURL(content)
    a.download=`${filenamef.value}.zip`
    a.click()
  })
  setexportprogress("Completed",0)
}
function downloadjson() {
  const data={
    waveformdata:waveformdata,
    variables:variables,
    effects:effects,
    mixtracks:mixtracks,
    timestart:timesttxt.value,
    timeend:timeend.value,
    voices:voicentxt.value,
    blocksize:blocksizetxt.value,
    _name:projnamef.value,
  }
  const sdata=JSON.stringify(data)
  
  sendfiletodownload(new Blob([sdata],{type:'application/json'}),`${filenamef.value}.json`)
  
}
async function downloadwav(wfinput) {
  setexportprogress("Generating file...",0.4);
  await wait(0.1);
  const wavdat=await generatewav(wfinput,notenames.includes(wfinput)?1:2);
  sendfiletodownload(wavdat,`${filenamef.value}.wav`);
  setexportprogress("Completed",0)

}
{
  const options=[["wav","WAV audio"],["sfz","SFZ sampler file"],["json","JSON data file"]];
  const optdesc={"lls1":"Export as synth project data for this site. Can be imported later and edited.","wav":"Render to wave file. Good for exporting individual samples.","sfz":"Generate all note samples with an sfz instrument file, to be used in a DAW.","json":"Export synth data to JSON. File can be edited manually or loaded into WebLLSE for editing."}
  options.forEach(o => {
      const op=document.createElement("option");
      op.value=o[0]
      op.text=o[1]
      exportsel.appendChild(op)
  })
  exportsel.addEventListener("change",function() {
      const val=exportsel.value;
      exportdesc.innerText=optdesc[val];
      if (exportsel.value=="wav") {
      welbl1.style.display="flex";
      wavexpfreq.style.display="flex";
      } else {
        welbl1.style.display="none";
        wavexpfreq.style.display="none";
      }
      
  });
  exportbtn.onclick=()=>{
    
    switch(exportsel.value){
      case "lls1":
        downloadtosynthfile();
        break;
      case "sfz":
        downloadtosfz(1,127).catch(console.error);
        break;
      case "json":
        downloadjson();
        break;
      case "wav":
        downloadwav(wavexpfreq.value);
    }
  }
}


function g_loadinpresets() {
  fetch('/files')
  .then(res => res.json())
  .then(files => {

    files.forEach(file => {
  
      presets[file.name]=file.content;
      
    });
 
  let k="empty.json"
     const o1=document.createElement("option")
      o1.value=k
      o1.text=JSON.parse(presets[k])._name;
      
      currpresetdd.appendChild(o1);
  for (let k in presets){
    if (presets.hasOwnProperty(k)) {
      if (k==="empty.json") {continue;}
      const o=document.createElement("option")
      o.value=k
      o.text=JSON.parse(presets[k])._name || k;
  
      currpresetdd.appendChild(o);
    }
  }

currpresetdd.addEventListener("change",function() {
  loadfromjson(presets[currpresetdd.value])
})

  })
  .catch(err => console.error('Error fetching files:', err));

  
}
g_loadinpresets()



function addeffectobj(objid,id="",preparams={}) {
  
  addeffsel.style.display="none"
  addeff.style.display="block";

  const cl=effinstance.cloneNode(true)
  qget(cl,"#fxit1").innerText=emodule.effectparams[objid].label;
  const ppref=cl.querySelector(".fxpropc")
  let idn=id || getavailablett(effects);
  const effectdat={"id":idn,"type":objid,"params":preparams || {}}

  for (let param of emodule.effectparams[objid].params) {

    const pp=ppref.cloneNode(true)
    const valfield=pp.querySelector("#fxi1pvalue")
    pp.querySelector("#fxi1plabel").innerText=param.name;
    valfield.placeholder=param.placeholder || ""
    pp.style.display="flex"
    if (param.id==="id") {
      valfield.value=idn
      valfield.addEventListener("input",()=>{
        delete effects[idn]
        idn=valfield.value;
        effects[idn]=effectdat;
        effectdat.id=idn;
      })
    } else {
      effectdat.params[param.id]=preparams[param.id] || param.default || "0"
      valfield.value=effectdat.params[param.id]
      valfield.addEventListener("input",()=>{

        effectdat.params[param.id]=valfield.value;
        
      })
    }
    cl.appendChild(pp)
    
  }
  effects[idn]=effectdat;
  
  cl.style.display="flex"
  cl.querySelector(".fxiremvbtn").addEventListener("click",()=>{
    effcont.removeChild(cl)
    delete effects[idn]
  })
  return cl
}
//add eff
addeff.addEventListener("click",()=>{
  addeff.style.display="none";
  addeffsel.value="SELECT EFFECT TYPE"
  addeffsel.style.display="block";

})
addeffsel.addEventListener("change",()=>{
  const cl=addeffectobj(addeffsel.value)
  effcont.appendChild(cl);

})
for (let tk in emodule.effectparams) {
  if (emodule.effectparams.hasOwnProperty(tk)) {
    const et=emodule.effectparams[tk]
    const s=document.createElement("option");
    s.text=et.label
    s.value=tk;
    addeffsel.appendChild(s)
  }
  

}




function remvdictfromarray(arr, match) {
  const index = arr.findIndex(obj =>
    Object.keys(match).every(
      key => obj[key] === match[key]
    )
  );
  if (index > -1) arr.splice(index, 1);
}



let mgcanvash;
let mgcanvasw;

function setupCanvas(canvas) {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  canvas.style.width = `${rect.width}px`;
  canvas.style.height = `${rect.height}px`;

  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  return ctx;
}

const gctx = setupCanvas(modgraphc);

function datanormal(dat,width,height) {
  function a(p) {
    return {x:p.x/width,y:1-(p.y/height)}
  }

  return {mainpoints:dat.mainpoints.map(a),segments:dat.segments.map(s=>({p0:a(s.p0),p1:a(s.p1),c0:a(s.c0),c1:a(s.c1)})),min:dat.min,max:dat.max}
}
function datadenormal(dat,width,height) {
 
  function a(p) {
    return {x:p.x*width,y:(1-p.y)*height}
  }

  return {mainpoints:dat.mainpoints.map(a),segments:dat.segments.map(s=>({p0:a(s.p0),p1:a(s.p1),c0:a(s.c0),c1:a(s.c1)})),min:dat.min,max:dat.max}
}


let playing=false
let gtime=0
let ltime=0
let variables={}
let effects={}
let mixtracks={}

let mselectedpt=null;
let mgdragtype=null
let currentmvtab={}
let currentvvalfield=null

function findnearbypt(x,y,l) {
  return l.find(p=>Math.hypot(p.x-x,p.y-y)<12);
}
function loadmodcanvas(key,dataw) {

  const pdat=JSON.parse(dataw || '{"mainpoints":[{"x":0,"y":0},{"x":1,"y":1}],"segments":[],"min":0,"max":10}')
  const dat=datadenormal(pdat,modgraphc.width / (window.devicePixelRatio || 1), modgraphc.height / (window.devicePixelRatio || 1))
  currentmodvar=key
  mselectedpt=null
  mgdragtype=null
  currentmvtab=dat;
  gcmin.value=dat.min;
  gcmax.value=dat.max;


  updsegments()
  drawmodcanvas(dat)

}






function getmousepos(e) {
  const rect = modgraphc.getBoundingClientRect();
  const sc = window.devicePixelRatio || 1;
  return {
    x: (e.clientX - rect.left) * sc,
    y: (e.clientY - rect.top) * sc
  };
}



function mclamp(a,l,h) {
  return Math.min(Math.max(a,l),h)
}
modgraphc.addEventListener("mouseup",() =>{
  mselectedpt=null;
  mgdragtype=null;
})
modgraphc.addEventListener("mousedown",(e)=>{
  if (!currentmvtab) {
    return
  }
  const {x,y}=getmousepos(e)
  mselectedpt=findnearbypt(x,y,currentmvtab.mainpoints)
  mgdragtype="main"
  if (!mselectedpt) {
    for (let s of currentmvtab.segments) {
      mselectedpt=findnearbypt(x,y,[s.c0,s.c1])
      if (mselectedpt) {
        mgdragtype="ctrl"
        break
      }
    }
  }

  if (!mselectedpt) {
    currentmvtab.mainpoints.push({x,y})
    currentmvtab.mainpoints.sort((a,b)=>a.x-b.x)
    updsegments()
    drawmodcanvas(currentmvtab)

  }

})
modgraphc.addEventListener("contextmenu",(e)=>{
  e.preventDefault()
  if (!currentmvtab) {
    return
  }
  const {x,y}=getmousepos(e)
  mselectedpt=findnearbypt(x,y,currentmvtab.mainpoints)
  mgdragtype="main"
  
  if (mselectedpt) {
    const width=modgraphc.width / (window.devicePixelRatio || 1)
    if (![0,1*width].includes(mselectedpt.x)) {
      remvdictfromarray(currentmvtab.mainpoints,mselectedpt)
    currentmvtab.mainpoints.sort((a,b)=>a.x-b.x)
    updsegments()
    drawmodcanvas(currentmvtab)
    }
    

  }
})
modgraphc.addEventListener("mousemove", (e)=>{
  const {x,y}=getmousepos(e)
  const width=modgraphc.width / (window.devicePixelRatio || 1)
      
  if (mselectedpt) {
    if (![0,1*width].includes(mselectedpt.x)) {
      const width=modgraphc.width / (window.devicePixelRatio || 1)
      const height=modgraphc.height / (window.devicePixelRatio || 1)
      mselectedpt.x=mclamp(x,0.01*width,0.99*width);
    }
    
    mselectedpt.y=y;
    if (mgdragtype=="main") {
      currentmvtab.mainpoints.sort((a,b)=>a.x-b.x)
      updsegments()
    } else {
      for (let s of currentmvtab.segments) {
        if (s.c0==mselectedpt || s.c1==mselectedpt) {
          mselectedpt.x=mclamp(x,s.p0.x,s.p1.x)
        
        }
      }
      
    }
    drawmodcanvas(currentmvtab)
  }
  

})
function updsegments() {
  currentmvtab.segments=[]
  for (let i=0;i<currentmvtab.mainpoints.length-1;i++) {
    const p0=currentmvtab.mainpoints[i]
    const p1=currentmvtab.mainpoints[i+1]
    const d=(p1.x-p0.x)/2.5
    currentmvtab.segments.push({p0,p1,c0:{"x":mclamp(p0.x+d,p0.x,p1.x),"y":p0.y},c1:{"x":mclamp(p1.x-d,p0.x,p1.x),"y":p1.y}})
  }
}

function drawmodcanvas(datas) {
  gctx.clearRect(0, 0, modgraphc.width, modgraphc.height);
  const segments=datas.segments;
  const ncmt=datanormal(currentmvtab,modgraphc.width / (window.devicePixelRatio || 1), modgraphc.height / (window.devicePixelRatio || 1));
  const jss=JSON.stringify(ncmt)
  variables[currentmodvar]="g!"+jss
  currentvvalfield.value="g!"+jss

  // Draw curves
  for (let seg of segments) {
    gctx.beginPath();
    gctx.moveTo(seg.p0.x, seg.p0.y);
    gctx.bezierCurveTo(
      seg.c0.x, seg.c0.y,
      seg.c1.x, seg.c1.y,
      seg.p1.x, seg.p1.y);
    gctx.strokeStyle = 'white';
    gctx.lineWidth = 2;
    gctx.stroke();
  }

  // Draw control handles
  gctx.strokeStyle = 'gray';
  for (let seg of segments) {
    gctx.beginPath();
    gctx.moveTo(seg.p0.x, seg.p0.y);
    gctx.lineTo(seg.c0.x, seg.c0.y);
    gctx.moveTo(seg.p1.x, seg.p1.y);
    gctx.lineTo(seg.c1.x, seg.c1.y);
    gctx.stroke();
  }

  // Draw control points
  for (let seg of segments) {
    [seg.c0, seg.c1].forEach(cp => {
      gctx.beginPath();
      gctx.arc(cp.x, cp.y, 5, 0, Math.PI * 2);
      gctx.fillStyle = 'white';
      gctx.fill();
    });
  }

  // Draw main points
  for (let p of currentmvtab.mainpoints) {
   
    gctx.beginPath();
    gctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
    const width=modgraphc.width / (window.devicePixelRatio || 1)
      
    if ([0,width].includes(p.x)) {
      gctx.fillStyle = 'yellow';
    } else {
      gctx.fillStyle = 'blue';
    }
    
    gctx.fill();
  }
}



gcmin.addEventListener("input",()=>{
  if (currentmvtab) {
    currentmvtab.min=Number(gcmin.value)
    const ncmt=datanormal(currentmvtab,modgraphc.width / (window.devicePixelRatio || 1), modgraphc.height / (window.devicePixelRatio || 1));
  const jss=JSON.stringify(ncmt)
  variables[currentmodvar]="g!"+jss
  currentvvalfield.value="g!"+jss
  }
})
gcmax.addEventListener("input",()=>{
  if (currentmvtab) {
    currentmvtab.max=Number(gcmax.value)
    const ncmt=datanormal(currentmvtab,modgraphc.width / (window.devicePixelRatio || 1), modgraphc.height / (window.devicePixelRatio || 1));
  const jss=JSON.stringify(ncmt)
  variables[currentmodvar]="g!"+jss
  currentvvalfield.value="g!"+jss
  }
})

function createmixertrack(id="",chain="") {
  let idn=id || getavailablett(mixtracks)
  const inst=mixtrackinst.cloneNode(true)
  const idf=inst.querySelector("#mixtkpn");
  const vaf=inst.querySelector("#mixtkpe");
  const rem=inst.querySelector("#remv");
  idf.value=idn;
  mixtracks[idn]="";
  vaf.value=chain;
  idf.addEventListener("input",( ) =>{
    delete mixtracks[idn];
    idn=idf.value;
    mixtracks[idn]=vaf.value;
  })
  vaf.addEventListener("input",()=>{
    mixtracks[idn]=vaf.value;
  })
  rem.addEventListener("click",()=>{
    mixtrackcont.removeChild(inst);
    delete mixtracks[idn];
  })
  inst.style.display="flex"
  return inst
}

addmixb.addEventListener("click",()=>{
  const inst=createmixertrack()
  mixtrackcont.appendChild(inst);

})








function parsemath(exp, localvars, lvarstack = [], returnfloat) {
    if (typeof exp !== 'string') exp = String(exp);
    const matches = [...exp.matchAll(/\$([^#]+)#/g)];
    const qvars = matches.map(m => m[1]);

    qvars.forEach(qvar => {
        if (lvarstack.includes(qvar)) {
            console.warn(`Circular reference detected: ${lvarstack.join(" -> ")} -> ${qvar}`);
            exp = "0"; // Optional: neutral fallback
        } else if (qvar in localvars) {
            const newStack = [...lvarstack, qvar]; // create a new stack for recursion
            const reg = new RegExp(`\\$${qvar}#`, 'g');
            const subexp = parsemath(localvars[qvar], localvars, newStack);
            exp = exp.replace(reg, subexp);
        }
    });

    if (exp.includes("#")) {
        console.warn("ERROR DETECTED: unresolved variable");
        return "0";
    }

    let returnv = "eval.toString()";
    if (returnfloat === true) {
        returnv = "parseFloat(eval.toString())";
    }
    const res = new Function(`const eval=${exp}; return ${returnv};`)();
    return res;
}

function cartesarrays(arrays) {
  return arrays.reduce((acc, curr) => {
    return acc.flatMap(a => curr.map(b => [...a, b]));
  }, [[]]);
}
function getrawwaves(t) {
    const newvars={...variables,...{"t":`${String(t)}`,"F":`${String(keyfrequency[0])}`}}

   
    newdata=[];

    waveformdata.forEach((item)=>{
      
        
        let m=false
        if (item.modifiers.length>0) {
            modvars=[]
            modvariter=[]
            item.modifiers.forEach((mod)=>{
                const start=parsemath(mod.start,variables,[],true);
                const end=parsemath(mod.end,variables,[],true);
                const step=parsemath(mod.step,variables,[],true);
                mv=[]
                for (let i=start;i<end;i+=step) {
                    mv.push(i);
                }
                modvariter.push(mv);
                modvars.push(mod.var)
             });
            allpossvarvals=cartesarrays(modvariter)
            
            allpossvarvals.forEach((varps)=>{
                varvalmap={}
                const wavetab={}
                for (let i=0;i<modvars.length;i++) {
                    varvalmap[modvars[i]]=String(varps[i])
                }
                finvars={...newvars,...varvalmap};
                
                wavetab.waveform=item.waveform;
                wavetab.frequency=Number(parsemath(item.frequency,finvars,[]));
                wavetab.amplitude=Number(parsemath(item.amplitude,finvars,[]));
                wavetab.phase=Number(parsemath(item.phase,finvars,[]));
                newdata.push(wavetab)

            });
        } else {
          const wavetab={}
          wavetab.waveform=item.waveform;
          wavetab.frequency=Number(parsemath(item.frequency,newvars,[]));
          wavetab.amplitude=Number(parsemath(item.amplitude,newvars,[]));
          wavetab.phase=Number(parsemath(item.phase,newvars,[]));
          newdata.push(wavetab)
        }
      
    });
 
    return newdata
}

setInterval(() => {
    gtime+=0.01;
},10);

    let audioCtx = null;
    let activeNodes = [];



    function createWaveElement(prewavepoint={waveform:"sine",frequency: "440", amplitude: "0.1", pan:"0",phase:"0",fxchain:"",mixtrack:"",modifiers: []}) {

      const wavepoint=structuredClone(prewavepoint)
        waveformdata.push(wavepoint)
      const div = wrprefab.cloneNode(true);
      div.className = "wave-rect";

      const freqInput = qget(div,".freqinput")
      freqInput.value = wavepoint.frequency;
      const paninput=qget(div,".paninput")
      paninput.value=wavepoint.pan
      const fxcinput=qget(div,".fxcinput")
      fxcinput.value=wavepoint.mixtrack
    freqInput.addEventListener("input", function () {
        wavepoint.frequency=freqInput.value;
        if (selectedwrect===div) {
          propinput1.value=freqInput.value;
        }
    });
        
      const ampInput = qget(div,".ampinput")
      // ampInput.min = "0";
      // ampInput.max = "1";
      // ampInput.step = "0.01";
      ampInput.value = wavepoint.amplitude;
         ampInput.addEventListener("input", function () {
        wavepoint.amplitude=ampInput.value;
        if (selectedwrect===div) {
          propinput2.value=ampInput.value;
        }
    });
    paninput.addEventListener("input",()=>{
      wavepoint.pan=paninput.value;
    })
    fxcinput.addEventListener("input",()=>{
      wavepoint.mixtrack=fxcinput.value;

    })
      const removeBtn = qget(div,".remove-btn")
      const utilbtn = qget(div,".util-btn")
      const addmod=qget(div,".addmodbtn")
        const waveform=qget(div,".waveformselect")   
        waveform.className="wformselect"
        
        const options=[["sine","Sine"],["sawtooth","Sawtooth"],["square","Square"],["triangle","Triangle"],["whitenoise","White noise"]];
        options.forEach(o => {
            const op=document.createElement("option");
            op.value=o[0]
            op.text=o[1]
            waveform.appendChild(op)
        })
        waveform.value=wavepoint.waveform
        waveform.addEventListener("change",function() {
            const val=this.value;
            wavepoint.waveform=val;
            
        });

      removeBtn.onclick = () => {
        container.removeChild(div);
        waveformdata.splice(waveformdata.indexOf(wavepoint),1);
      }
        
      addmod.onclick=() => {
        createModifier(div,wavepoint,"multiply");
      }
      utilbtn.onclick=()=>{
        selectedwave=wavepoint;
        selectedwrect=div;
        for (let c of container.children) {
          c.classList.remove("selectedWE")
        }
        div.classList.add("selectedWE");

        propinput1.value=wavepoint.frequency;
        propinput2.value=wavepoint.amplitude;
      }
      div.style.display="flex"
      
      return [div,wavepoint];
    }

    function addvariable(preid=getavailablett(variables),preval="") {
      const varph=preid;
          const div = varrprefab.cloneNode(true)
      
      const remove = qget(div,".remove-btn")
        const vname=qget(div,".var-name-input")
        vname.value=varph

        const vvalue=qget(div,".var-value-input")
        vvalue.value=preval
        const editbtn = qget(div,".util-btn")
      editbtn.style.display="none"
        const vtype=qget(div,".vartypeselect")
        const vo1=document.createElement("option");
        vo1.value="expression"
        vo1.text="Expression"
        const vo2=document.createElement("option");
        vo2.value="modulator"
        vo2.text="Graphed Mod"
        const vo3=document.createElement("option");
        vo3.value="fxchain"
        vo3.text="Effect Chain"
        
        vtype.value="expression"
        div.dataset.info=""
        vtype.addEventListener("change",()=>{ 
          const inf=div.dataset.info;
            div.dataset.info=vvalue.value;
            vvalue.value=inf;
          if (vtype.value!="modulator") {
            editbtn.style.display="none"
            
          } else {
            editbtn.style.display="inline-block"
            if (!inf || inf.slice(0,2)!="g!") {
              vvalue.value="g!"+vvalue.value;
            }
            
          }
          if (vtype.value=="fxchain") {
            if (!inf || inf.slice(0,2)!="e!") {
              vvalue.value="e!"+vvalue.value;
            }
          }

        })
        

        variables[varph]=preval
        
        vtype.appendChild(vo1);
        vtype.appendChild(vo2);
        vtype.appendChild(vo3);
       
        vname.dataset.originalvalue=varph
        vname.addEventListener("input",function() {
            delete variables[vname.dataset.originalvalue];
            vname.dataset.originalvalue=vname.value;
            variables[vname.value]=vvalue.value;
        });
        let tempv=""
        vvalue.addEventListener("input",function() {
            const tv=tempv;
            variables[vname.value]=vvalue.value;
           
            const inf=vvalue.value;
            const b1=inf && inf.slice(0,2)=="g!"
            const b2=vtype.value=="modulator"

            const b3=inf && inf.slice(0,2)=="e!"
            const b4=vtype.value=="fxchain"
            if (b1!=b2 || b3!=b4) {
              vvalue.value=tv;
            }
            tempv=vvalue.value;
        });
        editbtn.addEventListener("mousedown",()=>{
          currentvvalfield=vvalue;
          currentmodvar=vname.value;
          loadmodcanvas(vname.value,vvalue.value.slice(2))
          for (let c of varcont.children) {
          c.classList.remove("selectedWE")
         }
         div.classList.add("selectedWE");
        })


        remove.onclick=function () {
            varcont.removeChild(div);
            delete variables[varph];
        }
        div.style.display="flex"
        return div
        
    }


    function createModifier(element,wave,typeo,preprops={type: typeo,start: "0", end: "10", step: "1", var: getavailablett(variables)}) {

      const div = document.createElement("div");
      div.className = "wr-modifier";
      const varp=preprops.var;
      const mod=structuredClone(preprops)
        wave.modifiers.push(mod)
      const fromtx = document.createElement("input");
      fromtx.type = "text";
      fromtx.placeholder = "From";
      fromtx.className="mfromtx"
      fromtx.value = mod.start;

      const totx = document.createElement("input");
      totx.type = "text";
      totx.placeholder = "To";
      totx.className="mtotx"
      
      totx.value = mod.end;
         const steptx = document.createElement("input");
      steptx.type = "text";
      steptx.placeholder = "Step";
      steptx.className="msteptx"
      const vartx=document.createElement("input");
      vartx.type="text";
      vartx.placeholder="Var";
      vartx.value=varp;
      vartx.className="mvartx"
      steptx.value = mod.step;
      const removeBtn = document.createElement("button");
      removeBtn.className = "remove-btn";
      removeBtn.innerText = "X";
      removeBtn.onclick = () => {
        element.removeChild(div);
        
        wave.modifiers = wave.modifiers.filter(m => m.var !== mod.var);
      }
        div.appendChild(removeBtn);
      div.appendChild(fromtx);
      div.appendChild(totx);
      div.appendChild(steptx);
      div.appendChild(vartx);

        fromtx.addEventListener("input",function() {
            mod.start=fromtx.value;
        });
        totx.addEventListener("input",function() {
            mod.end=totx.value;

        })
        steptx.addEventListener("input",function() {
            mod.step=steptx.value;
        })
        vartx.addEventListener("input",function() {
            mod.var=vartx.value;
           
        })
     





      element.appendChild(div);
      
      return div;
    }
    addBtn.onclick = () => {
      container.appendChild(createWaveElement()[0]);
    };
    addvarb.onclick=()=>{
        varcont.appendChild(addvariable())
    }

    
    let node;

    async function start() {
        
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        await audioCtx.audioWorklet.addModule("/static/audiorun.js");

        node = new AudioWorkletNode(audioCtx, "waveprocessor");
        node.connect(audioCtx.destination);

        // Send initial data
        const evaluated = getrawwaves(gtime);
     
        node.port.postMessage({ waves: evaluated ,playing:playing});

        // Start updating t every second
        setInterval(() => {
            gtime += 0.1;
            const evaluated = getrawwaves(gtime);
            node.port.postMessage({ waves: evaluated ,playing:playing});

////

           

        }, 100);
    }



let buffercache=null
let bufferstart=0
let bufferend=0
let pphases=[]

export async function generatebuffer(play=false,idx=0) {
  if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    const startTime = Number(timesttxt.value);
    const endTime = Number(timeend.value);

   
  const effects2 = structuredClone(effects);


   let buffer=generateAudioBuffer(audioContext, startTime, endTime,waveformdata,variables,Number(blocksizetxt.value),pphases,effects2,mixtracks)
   return buffer
}

export async function start2(play=false,idx=0) {
    if (Object.keys(voices).length>=numvoices || voices[idx]) {return;}
    let buffer=await generatebuffer(play,idx)
    buffercache = buffer[0];
const startTime = Number(timesttxt.value);
    const endTime = Number(timeend.value);
    bufferstart=startTime;
    bufferend=endTime;
    pphases=buffer[1]
  
    if (play==true) {
       sourceNode = audioContext.createBufferSource();
    sourceNode.buffer = buffer[0];
    sourceNode.connect(audioContext.destination);
    sourceNode;
    voices[idx]=sourceNode;
    sourceNode.start()
    
    }
  
    
}
startBtn.onclick=()=>{

  start2(true);
}





playBtn.onmousedown = playBtn.ontouchstart = () => {

if (buffercache) {
  sourceNode = audioContext.createBufferSource();
    sourceNode.buffer = buffercache;
    sourceNode.connect(audioContext.destination);
    sourceNode;
    sourceNode.start()
}

    // if (srcnode) {
    //   srcnode.start();
    // }

};

playBtn.onmouseup = playBtn.onmouseleave = playBtn.ontouchend = () => {
  if (audioCtx) {
    //const stopTime = audioCtx.currentTime;

  playing=false
  }
  
  
};
export {variables}