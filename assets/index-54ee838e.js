import{V as m,_ as u,r as n,u as r,a$ as f,a_ as w,j as e,m as s,b as a,D as y,M,c as I,d as B,e as A,H as P,f as k,n as c,b0 as z,b1 as E,b2 as L,b3 as R,b4 as N,b5 as d,b6 as O,b7 as T,B as p,b8 as V,b9 as j}from"./index-6291f3e9.js";const F=m.lazy(()=>u(()=>import("./index-0c8cd8a2.js"),["assets/index-0c8cd8a2.js","assets/index-6291f3e9.js","assets/index-8224a8ad.css","assets/browser-image-compression-78ff6def.js","assets/chunk-YGVX4ESO-b82b0c22.js"])),H=m.lazy(()=>u(()=>import("./index-4a733333.js"),["assets/index-4a733333.js","assets/index-6291f3e9.js","assets/index-8224a8ad.css","assets/chunk-HPA3SDH4-54e1390d.js"])),h=[{description:"Campaign Info"},{description:"Add Donation Options"},{description:"Change Stauts of Campaign"}],Q=({donationCampaign:$,donationCampaignId:i,onClose:g,isOpen:x,statuses:q})=>{const[G,b]=n.useState(null),S=r("gray.100","gray.700"),t=f(),{activeStep:o,goToNext:l,goToPrevious:C,setActiveStep:D}=w({index:1,count:h.length});return e(s,{children:a(y,{isOpen:x,onClose:()=>{b(null),D(1),g()},size:"full",children:[e(M,{}),a(I,{bg:S,children:[e(B,{}),e(A,{children:e(P,{size:"xl",children:"Donation Campaign Form"})}),e(k,{children:e(s,{border:"1px",borderColor:r("gray.100","gray.400"),p:{base:"0px",sm:"25px"},borderRadius:"15px",shadow:"md",bg:r("gray.50","gray.600"),children:a(c,{flexDirection:"column",children:[e(z,{index:o,orientation:t?"vertical":"horizontal",children:h.map((_,v)=>a(E,{children:[e(L,{children:e(R,{complete:e(N,{}),incomplete:e(d,{}),active:e(d,{})})}),e(s,{flexShrink:"0",children:e(O,{children:_.description})}),!t&&e(T,{})]},v))}),o===1&&e(n.Suspense,{fallback:e("div",{children:"Loading..."}),children:e(F,{campaignId:i,onNext:()=>l()})}),o===2&&e(n.Suspense,{fallback:e("div",{children:"Loading..."}),children:e(H,{donationCampaignId:i})}),a(c,{mt:"15px",children:[o!==1&&a(p,{onClick:C,children:["Previuos",e(V,{ml:"15px",width:"15px"})]}),o!==3&&a(p,{ml:o!==1?"15px":"0px",onClick:l,children:["Next",e(j,{ml:"15px",width:"15px"})]})]})]})})})]})]})})};export{Q as default};
