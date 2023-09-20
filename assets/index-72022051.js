import{L as b,a as N,A as v,U as A,g as B,r as n,u as i,W as T,b as r,m as d,j as e,T as E,Z as I,I as M,$ as k,a0 as z,a1 as u,B as g,a2 as _,a3 as j,o as R,N as U,V as $,H as D}from"./index-6291f3e9.js";const H=async()=>{const a={component:"components/ClientsTable/calls.getClients"};let c=null;try{console.log("Trying to get Clients",{...a});const o=b("_auth"),t=await N.get(`${v}/v1/clients`,{headers:{Authorization:`Bearer ${o}`}});if(t.status===200&&t.data.code.id===A.SUCCESS_CODE)return{success:!0,data:t.data.content};c=B(t)}catch(o){console.error("Unexpected error while trying to get Clients",o)}return{success:!1,data:c}},L=[{header:"First Name",accessor:"firstName",render:a=>e("span",{children:a})},{header:"Last Name",accessor:"lastName",render:a=>e("span",{children:a})},{header:"Phone",accessor:"phone"},{header:"Email",accessor:"email"},{header:"Created At",accessor:"createdAt",render:a=>U(a).tz("America/Toronto").format("DD MMM, YYYY [at] HH:mma")},{header:"Created By",accessor:"createdBy"}],Y=()=>{const[a,c]=n.useState([]),[o,t]=n.useState(!0),[F,m]=n.useState(null),[f,x]=n.useState("");i("white","gray.600");const h=i("white","gray.700"),p=i("gray.500","gray.400"),C=T(),S=async({isMounted:s})=>{t(!0),m(null);try{const l=await H();if(!l.success)throw new Error(l.data);c(l.data)}catch(l){console.error(`Error :: ${l.message}`),m({type:"error",message:l.message})}t(!1)},w=s=>{console.log({term:s})},y=s=>{C(`/clients/${s.id}`)};return n.useEffect(()=>{let s=!0;return s&&S({isMounted:s}),()=>{s=!1}},[]),r(d,{children:[e(d,{bg:h,p:3,borderRadius:"10px",boxShadow:"sm",mb:5,children:r("div",{className:"w-full flex lg:flex-row flex-col items-center",children:[r("div",{className:"flex lg:flex-row flex-col lg:space-x-4 w-full",children:[r(d,{className:"lg:w-8/12 w-full mb-3 flex flex-col",children:[e(E,{className:"text-relaxed font-medium ml-1 mb-2",color:p,children:"Search Client"}),r(I,{children:[e(M,{bg:h,shadow:"md",placeholder:"Search",value:f,onChange:s=>x(s.target.value)}),e(k,{children:e(z,{color:i("gray.600","gray.50"),"aria-label":"Search",icon:e(u,{}),onClick:w})})]})]}),e("div",{className:"w-full flex sm:flex-row flex-col"})]}),r("div",{className:"lg:w-4/12 justify-end w-full mt-3 flex sm:flex-row flex-col",children:[r(g,{variant:"solid",colorScheme:"blue",size:"md",mr:4,onClick:()=>console.log("open"),my:{base:5,sm:15},children:[e(u,{boxSize:3,mr:3}),"Search"]}),r(g,{variant:"solid",colorScheme:"teal",size:"md",mr:4,onClick:()=>console.log("hey"),my:{base:5,sm:15},children:[e(_,{boxSize:3,mr:3}),"Create Client"]})]})]})}),o&&e("div",{className:"flex justify-center",children:e(j,{})}),!!a.length&&e(R,{items:a,columns:L,onOpenRecord:y})]})},P=a=>r($.Fragment,{children:[e(d,{textAlign:"left",my:5,p:3,children:e(D,{children:"Clients"})}),e(Y,{})]});export{P as default};
