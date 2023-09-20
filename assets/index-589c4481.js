import{q,r as i,j as e,y as h,ba as k,v as G,w as W,x as X,aK as H,b as o,z as K,K as V,a as Y,A as J,U as Q,g as Z,W as ee,u,m as r,H as D,n as g,X as P,i as b,k as _,I as E,Y as ne,ae as te,B as y}from"./index-c9e8d609.js";import{u as oe}from"./chunk-HPA3SDH4-73d5b6fb.js";var[xe,ae]=q({name:"CheckboxGroupContext",strict:!1});function se(t){const[s,c]=i.useState(t),[n,a]=i.useState(!1);return t!==s&&(a(!0),c(t)),n}function re(t){return e(h.svg,{width:"1.2em",viewBox:"0 0 12 10",style:{fill:"none",strokeWidth:2,stroke:"currentColor",strokeDasharray:16},...t,children:e("polyline",{points:"1.5 6 4.5 9 10.5 1"})})}function le(t){return e(h.svg,{width:"1.2em",viewBox:"0 0 24 24",style:{stroke:"currentColor",strokeWidth:4},...t,children:e("line",{x1:"21",x2:"3",y1:"12",y2:"12"})})}function ie(t){const{isIndeterminate:s,isChecked:c,...n}=t,a=s?le:re;return c||s?e(h.div,{style:{display:"flex",alignItems:"center",justifyContent:"center",height:"100%"},children:e(a,{...n})}):null}var ce={display:"inline-flex",alignItems:"center",justifyContent:"center",verticalAlign:"top",userSelect:"none",flexShrink:0},me={cursor:"pointer",display:"inline-flex",alignItems:"center",verticalAlign:"top",position:"relative"},de=k({from:{opacity:0,strokeDashoffset:16,transform:"scale(0.95)"},to:{opacity:1,strokeDashoffset:0,transform:"scale(1)"}}),ue=k({from:{opacity:0},to:{opacity:1}}),he=k({from:{transform:"scaleX(0.65)"},to:{transform:"scaleX(1)"}}),B=G(function(s,c){const n=ae(),a={...n,...s},d=W("Checkbox",a),m=X(s),{spacing:w="0.5rem",className:v,children:x,iconColor:f,iconSize:C,icon:l=e(ie,{}),isChecked:j,isDisabled:$=n==null?void 0:n.isDisabled,onChange:S,inputProps:z,...R}=m;let N=j;n!=null&&n.value&&m.value&&(N=n.value.includes(m.value));let I=S;n!=null&&n.onChange&&m.value&&(I=H(n.onChange,S));const{state:p,getInputProps:L,getCheckboxProps:M,getLabelProps:F,getRootProps:O}=oe({...R,isDisabled:$,isChecked:N,onChange:I}),A=se(p.isChecked),T=i.useMemo(()=>({animation:A?p.isIndeterminate?`${ue} 20ms linear, ${he} 200ms linear`:`${de} 200ms linear`:void 0,fontSize:C,color:f,...d.icon}),[f,C,A,p.isIndeterminate,d.icon]),U=i.cloneElement(l,{__css:T,isIndeterminate:p.isIndeterminate,isChecked:p.isChecked});return o(h.label,{__css:{...me,...d.container},className:K("chakra-checkbox",v),...O(),children:[e("input",{className:"chakra-checkbox__input",...L(z,c)}),e(h.span,{__css:{...ce,...d.control},className:"chakra-checkbox__control",...M(),children:U}),x&&e(h.span,{className:"chakra-checkbox__label",...F(),__css:{marginStart:w,...d.label},children:x})]})});B.displayName="Checkbox";const fe=async t=>{const s={component:"components/DonationCampaignDrawer/calls.getDonationCampaignById",params:{campaignId:t}};let c=null;try{console.log("Trying to find Donation Campaign Prices",{...s});const n=V("_auth"),a=await Y.get(`${J}/v1/donations/campaigns/${t}/prices`,{headers:{Authorization:`Bearer ${n}`}});if(a.status===200&&a.data.code.id===Q.SUCCESS_CODE)return{success:!0,data:a.data.content};c=Z(a)}catch(n){console.error("Unexpected error while trying to find Donation Campaign Prices",{...s,error:n})}return{success:!1,data:c}},Ce=({donationCampaignId:t})=>{const{setAppLoading:s}=i.useContext(ee),[c,n]=i.useState([]),[a,d]=i.useState({nameEn:"",amount:5}),[m,w]=i.useState(!1),[v,x]=i.useState(null),f=u("border-gray-300","border-gray-500"),C=async()=>{s(!0);try{const l=await fe(t);if(!l.success)throw new Error(l.data);n(l.data)}catch(l){console.error(`Error :: ${l.message}`),x({type:"error",message:l.message})}s(!1)};return i.useEffect(()=>{t&&C()},[]),o(r,{className:"w-full h-full",children:[e(r,{mt:"15px",children:e(D,{as:"h3",size:"lg",my:5,children:"Create a Donation Options"})}),o(g,{direction:{base:"column",md:"row"},className:"w-full h-full",children:[e(P,{initialScale:.9,in:!0,className:"md:w-6/12 w-full md:mr-3",children:o(r,{className:`${f} border w-full rounded-lg flex flex-col items-center my-6`,p:{base:"0px",md:"25px"},bg:u("gray.50","gray.700"),children:[o(r,{className:"w-full flex md:flex-row flex-col",children:[o(r,{className:"md:w-4/12 w-full p-3 flex flex-col",children:[e("span",{className:"text-md font-bold w-full",children:"Donation Name"}),e("span",{className:"mt-2 text-sm w-10/12",children:"This information will be used as the displayed name for Donation option."})]}),o(r,{className:"sm:w-10/12 w-full p-3",children:[e(g,{direction:{base:"column",md:"row"},justifyContent:"space-between",children:o(b,{mr:"5%",isRequired:!0,children:[e(_,{children:"Donation Name"}),e(E,{type:"text",name:"name",value:a.nameEn,onChange:()=>console.log("")})]})}),e(g,{direction:{base:"column",md:"row"},justifyContent:"space-between",mt:5,children:e(b,{mr:"5%",isRequired:!0,children:e(B,{value:m,onChange:()=>w(!m),children:"Let donors select the amount"})})}),e(g,{direction:{base:"column",md:"row"},justifyContent:"space-between",mt:5,children:o(b,{mr:"5%",isRequired:!0,children:[e(_,{children:"Donation Amount"}),o(ne,{children:[e(te,{pointerEvents:"none",color:"gray.300",fontSize:"1.2em",children:"$"}),e(E,{placeholder:"Enter amount",type:"text",name:"amount",value:a.amount,onChange:l=>d({...a,amount:l.target.value}),disabled:m})]})]})})]})]}),o(g,{my:10,className:"w-full flex p-5",justifyContent:"end",children:[e(y,{colorScheme:"red",mr:"2%",className:"sm:w-24 w-6/12",color:u("white","gray.100"),children:"Reset"}),e(y,{colorScheme:"blue",className:"sm:w-24 w-6/12",_hover:{bg:u("green.400","green.500")},color:u("white","gray.100"),bg:u("green.500","green.600"),children:"Save"})]})]})}),e(P,{initialScale:.9,in:!0,className:"md:w-6/12 w-full md:ml-3",children:o(r,{className:"w-full my-6 p-3 rounded-lg shadow",bg:u("gray.200","gray.700"),children:[e(D,{size:"md",children:"Donation Options"}),o(r,{className:`p-3 ${f} w-full border-2 rounded-lg mt-5 shadow-sm flex md:flex-row flex-col justify-between`,children:[o(r,{className:"flex flex-col md:w-8/12 w-full bg-red-100 p-3",children:[e(r,{children:"border"}),e(r,{children:"border"})]}),o(r,{className:"w-3/12 bg-blue-100 flex flex-col mx-auto",children:[e(y,{children:"Edit"}),e(y,{children:"Delete"})]})]})]})})]})]})};export{Ce as default};