import{bc as ye,p as M,r as a,ag as B,aA as ve,a3 as o,s as i,t as Z}from"./index-d5b22a3d.js";var me={border:"0",clip:"rect(0, 0, 0, 0)",height:"1px",width:"1px",margin:"-1px",padding:"0",overflow:"hidden",whiteSpace:"nowrap",position:"absolute"},$=!1,p=null,y=!1,I=!1,K=new Set;function R(e,s){K.forEach(n=>n(e,s))}var he=typeof window<"u"&&window.navigator!=null?/^Mac/.test(window.navigator.platform):!1;function pe(e){return!(e.metaKey||!he&&e.altKey||e.ctrlKey||e.key==="Control"||e.key==="Shift"||e.key==="Meta")}function ee(e){y=!0,pe(e)&&(p="keyboard",R("keyboard",e))}function m(e){if(p="pointer",e.type==="mousedown"||e.type==="pointerdown"){y=!0;const s=e.composedPath?e.composedPath()[0]:e.target;let n=!1;try{n=s.matches(":focus-visible")}catch{}if(n)return;R("pointer",e)}}function ke(e){return e.mozInputSource===0&&e.isTrusted?!0:e.detail===0&&!e.pointerType}function we(e){ke(e)&&(y=!0,p="virtual")}function Ee(e){e.target===window||e.target===document||(!y&&!I&&(p="virtual",R("virtual",e)),y=!1,I=!1)}function ge(){y=!1,I=!0}function te(){return p!=="pointer"}function Ce(){if(typeof window>"u"||$)return;const{focus:e}=HTMLElement.prototype;HTMLElement.prototype.focus=function(...n){y=!0,e.apply(this,n)},document.addEventListener("keydown",ee,!0),document.addEventListener("keyup",ee,!0),document.addEventListener("click",we,!0),window.addEventListener("focus",Ee,!0),window.addEventListener("blur",ge,!1),typeof PointerEvent<"u"?(document.addEventListener("pointerdown",m,!0),document.addEventListener("pointermove",m,!0),document.addEventListener("pointerup",m,!0)):(document.addEventListener("mousedown",m,!0),document.addEventListener("mousemove",m,!0),document.addEventListener("mouseup",m,!0)),$=!0}function Le(e){Ce(),e(te());const s=()=>e(te());return K.add(s),()=>{K.delete(s)}}function Se(e,s=[]){const n=Object.assign({},e);for(const u of s)u in n&&delete n[u];return n}function Me(e={}){const s=ye(e),{isDisabled:n,isReadOnly:u,isRequired:g,isInvalid:c,id:x,onBlur:ne,onFocus:ae,"aria-describedby":A}=s,{defaultChecked:H,isChecked:U,isFocusable:oe,onChange:re,isIndeterminate:d,name:V,value:q,tabIndex:O=void 0,"aria-label":T,"aria-labelledby":W,"aria-invalid":C,...se}=e,L=Se(se,["isDisabled","isReadOnly","isRequired","isInvalid","id","onBlur","onFocus","aria-describedby"]),S=M(re),_=M(ne),j=M(ae),[z,ie]=a.useState(!1),[h,k]=a.useState(!1),[F,G]=a.useState(!1),[P,v]=a.useState(!1);a.useEffect(()=>Le(ie),[]);const l=a.useRef(null),[N,ue]=a.useState(!0),[le,w]=a.useState(!!H),D=U!==void 0,r=D?U:le,J=a.useCallback(t=>{if(u||n){t.preventDefault();return}D||w(r?t.target.checked:d?!0:t.target.checked),S==null||S(t)},[u,n,r,D,d,S]);B(()=>{l.current&&(l.current.indeterminate=!!d)},[d]),ve(()=>{n&&k(!1)},[n,k]),B(()=>{const t=l.current;t!=null&&t.form&&(t.form.onreset=()=>{w(!!H)})},[]);const Q=n&&!oe,X=a.useCallback(t=>{t.key===" "&&v(!0)},[v]),Y=a.useCallback(t=>{t.key===" "&&v(!1)},[v]);B(()=>{if(!l.current)return;l.current.checked!==r&&w(l.current.checked)},[l.current]);const ce=a.useCallback((t={},f=null)=>{const b=E=>{h&&E.preventDefault(),v(!0)};return{...t,ref:f,"data-active":o(P),"data-hover":o(F),"data-checked":o(r),"data-focus":o(h),"data-focus-visible":o(h&&z),"data-indeterminate":o(d),"data-disabled":o(n),"data-invalid":o(c),"data-readonly":o(u),"aria-hidden":!0,onMouseDown:i(t.onMouseDown,b),onMouseUp:i(t.onMouseUp,()=>v(!1)),onMouseEnter:i(t.onMouseEnter,()=>G(!0)),onMouseLeave:i(t.onMouseLeave,()=>G(!1))}},[P,r,n,h,z,F,d,c,u]),de=a.useCallback((t={},f=null)=>({...L,...t,ref:Z(f,b=>{b&&ue(b.tagName==="LABEL")}),onClick:i(t.onClick,()=>{var b;N||((b=l.current)==null||b.click(),requestAnimationFrame(()=>{var E;(E=l.current)==null||E.focus({preventScroll:!0})}))}),"data-disabled":o(n),"data-checked":o(r),"data-invalid":o(c)}),[L,n,r,c,N]),fe=a.useCallback((t={},f=null)=>({...t,ref:Z(l,f),type:"checkbox",name:V,value:q,id:x,tabIndex:O,onChange:i(t.onChange,J),onBlur:i(t.onBlur,_,()=>k(!1)),onFocus:i(t.onFocus,j,()=>k(!0)),onKeyDown:i(t.onKeyDown,X),onKeyUp:i(t.onKeyUp,Y),required:g,checked:r,disabled:Q,readOnly:u,"aria-label":T,"aria-labelledby":W,"aria-invalid":C?!!C:c,"aria-describedby":A,"aria-disabled":n,style:me}),[V,q,x,J,_,j,X,Y,g,r,Q,u,T,W,C,c,A,n,O]),be=a.useCallback((t={},f=null)=>({...t,ref:f,onMouseDown:i(t.onMouseDown,Fe),"data-disabled":o(n),"data-checked":o(r),"data-invalid":o(c)}),[r,n,c]);return{state:{isInvalid:c,isFocused:h,isChecked:r,isActive:P,isHovered:F,isIndeterminate:d,isDisabled:n,isReadOnly:u,isRequired:g},getRootProps:de,getCheckboxProps:ce,getInputProps:fe,getLabelProps:be,htmlProps:L}}function Fe(e){e.preventDefault(),e.stopPropagation()}export{Me as u};