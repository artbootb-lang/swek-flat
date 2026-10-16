/* Мини-рантайм для интерактивных блоков: {{поле}} в тексте и атрибутах, обработчики onInput/onClick */
(function(){
class DCLogic{
  constructor(props){this.props=props||{};this.state={};}
  setState(p){Object.assign(this.state,p);if(this._u)this._u();}
}
window.DCLogic=DCLogic;
const RE=/\{\{\s*([\w.$]+)\s*\}\}/g;
function get(o,path){return path.split('.').reduce((a,k)=>a==null?a:a[k],o);}
window.dcMount=function(Cls,root){
  const inst=new Cls({});
  const binds=[];let vals=inst.renderVals();
  const walk=(el)=>{
    if(el.nodeType===1){
      if(el.tagName==='SCRIPT')return;
      for(const a of Array.from(el.attributes)){
        if(a.value.indexOf('{{')<0)continue;
        const m=a.value.match(/^\s*\{\{\s*([\w.$]+)\s*\}\}\s*$/);
        if(/^on/i.test(a.name)&&m){
          const ev=a.name.slice(2).toLowerCase(),key=m[1];
          el.removeAttribute(a.name);
          el.addEventListener(ev==='input'?'input':ev,e=>{const f=get(vals,key);if(typeof f==='function')f(e);});
          continue;
        }
        binds.push({el,attr:a.name,tpl:a.value});
      }
      Array.from(el.childNodes).forEach(walk);
    }else if(el.nodeType===3&&el.nodeValue.indexOf('{{')>=0){
      binds.push({el,text:true,tpl:el.nodeValue});
    }
  };
  const apply=()=>{
    for(const b of binds){
      const out=b.tpl.replace(RE,(_,k)=>{const v=get(vals,k);return v==null?'':String(v);});
      if(b.text){if(b.el.nodeValue!==out)b.el.nodeValue=out;}
      else if(b.attr==='value'){if(b.el.value!==out)b.el.value=out;b.el.setAttribute('value',out);}
      else if(b.el.getAttribute(b.attr)!==out)b.el.setAttribute(b.attr,out);
    }
  };
  inst._u=()=>{vals=inst.renderVals();apply();};
  walk(root);apply();
};
})();
