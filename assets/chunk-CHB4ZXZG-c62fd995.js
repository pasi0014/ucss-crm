import{r as o,aq as b}from"./index-82733b58.js";function P(){return!!(typeof window<"u"&&window.document&&window.document.createElement)}var w=P(),m=w?o.useLayoutEffect:o.useEffect;function k(e,s=[]){const n=o.useRef(e);return m(()=>{n.current=e}),o.useCallback((...c)=>{var u;return(u=n.current)==null?void 0:u.call(n,...c)},s)}function E(e,s){const n=o.useId();return o.useMemo(()=>e||[s,n].filter(Boolean).join("-"),[e,s,n])}function g(e,s){const n=e!==void 0;return[n,n&&typeof e<"u"?e:s]}function I(e={}){const{onClose:s,onOpen:n,isOpen:c,id:u}=e,r=k(n),i=k(s),[v,p]=o.useState(e.defaultIsOpen||!1),[t,l]=g(c,v),C=E(u,"disclosure"),d=o.useCallback(()=>{t||p(!1),i==null||i()},[t,i]),f=o.useCallback(()=>{t||p(!0),r==null||r()},[t,r]),O=o.useCallback(()=>{(l?d:f)()},[l,f,d]);return{isOpen:!!l,onOpen:f,onClose:d,onToggle:O,isControlled:t,getButtonProps:(a={})=>({...a,"aria-expanded":l,"aria-controls":C,onClick:b(a.onClick,O)}),getDisclosureProps:(a={})=>({...a,hidden:!l,id:C})}}export{I as u};
