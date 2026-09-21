async function sign(secret,message){const key=await crypto.subtle.importKey("raw",new TextEncoder().encode(secret),{name:"HMAC",hash:"SHA-256"},false,["sign"]);const b=await crypto.subtle.sign("HMAC",key,new TextEncoder().encode(message));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,"0")).join("")}
function safeEqual(a,b){if(!a||!b||a.length!==b.length)return false;let n=0;for(let i=0;i<a.length;i++)n|=a.charCodeAt(i)^b.charCodeAt(i);return n===0}
export async function onRequestPost({request,env}){
  const secret=env.BRAVOPAY_WEBHOOK_SECRET;
  if(!secret)return new Response("Webhook não configurado",{status:500});
  const raw=await request.text();
  const sig=request.headers.get("bravopay-signature")||request.headers.get("x-bravopay-signature")||"";
  const parts=Object.fromEntries(sig.split(",").map(x=>x.trim().split("=",2)));
  const t=parts.t,v1=parts.v1;
  if(!t||!v1)return new Response("Assinatura ausente",{status:401});
  const ts=Number(t);if(!Number.isFinite(ts)||Math.abs(Date.now()/1000-ts)>300)return new Response("Timestamp inválido",{status:401});
  const expected=await sign(secret,t+"."+raw);
  if(!safeEqual(expected,v1))return new Response("Assinatura inválida",{status:401});
  let event={};try{event=JSON.parse(raw)}catch{return new Response("JSON inválido",{status:400})}
  return new Response(JSON.stringify({received:true,event_id:event.id||event.event_id||null,type:event.type||event.event||null}),{status:200,headers:{"content-type":"application/json"}});
}