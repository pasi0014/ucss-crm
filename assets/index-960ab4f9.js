import{x as g,a as f,A as C,U as m,g as h,J as I,r,b as d,e as x,j as l,H as S}from"./index-82733b58.js";const p=async s=>{const c={component:"components/ClientsTable/calls.getClientInfo"};let n=null;try{console.log("Trying to get Client Info",{...c});const a=g("_auth"),e=await f.get(`${C}/v1/clients/${s}`,{headers:{Authorization:`Bearer ${a}`}});if(e.status===200&&e.data.code.id===m.SUCCESS_CODE)return{success:!0,data:e.data.content};n=h(e)}catch(a){console.error("Unexpected error while trying to get Client Info",a)}return{success:!1,data:n}},E=()=>{const{clientId:s}=I(),[c,n]=r.useState(!1),[a,e]=r.useState(null),[y,i]=r.useState(null),u=async o=>{n(!0),i(null);try{const t=await p(o);if(!t.success)throw new Error(t.data);e(t.data)}catch(t){console.log(`Error :: ${t.message}`),i({type:"error",message:t.message})}n(!1)};return r.useEffect(()=>{let o=!0;return o&&s&&u(s),()=>{o=!1}},[s]),d(x,{textAlign:"left",my:5,p:3,children:[l(S,{children:"Client Info"}),d("div",{className:"flex  bg-red-100 my-5",children:[l("div",{children:"123 123"}),l("div",{children:"Client Info column"})]})]})};export{E as default};
