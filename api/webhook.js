const crypto=require("crypto");
const SECRET=process.env.BRAVOPAY_WEBHOOK_SECRET||"";
const ALLOWED_ORIGIN=process.env.ALLOWED_ORIGIN||"*";

module.exports.config={api:{bodyParser:false}};

function rawBody(req){
  return new Promise((resolve,reject)=>{
    const chunks=[];
    req.on("data",c=>chunks.push(Buffer.from(c)));
    req.on("end",()=>resolve(Buffer.concat(chunks)));
    req.on("error",reject);
  });
}

function validSignature(raw,header){
  if(!SECRET||!header)return false;
  const parts=Object.fromEntries(header.split(",").map(x=>x.split("=")));
  const t=parts.t,v1=parts.v1;
  if(!t||!v1)return false;
  const age=Math.abs(Math.floor(Date.now()/1000)-Number(t));
  if(!Number.isFinite(age)||age>300)return false;
  const expected=crypto.createHmac("sha256",SECRET).update(t+"."+raw.toString("utf8")).digest("hex");
  const a=Buffer.from(expected,"hex"),b=Buffer.from(v1,"hex");
  return a.length===b.length&&crypto.timingSafeEqual(a,b);
}

module.exports=async function handler(req,res){
  res.setHeader("Access-Control-Allow-Origin",ALLOWED_ORIGIN);
  if(req.method!=="POST") return res.status(405).end();
  const raw=await rawBody(req);
  const sig=req.headers["bravopay-signature"]||req.headers["x-bravopay-signature"];
  if(!validSignature(raw,sig)) return res.status(401).json({error:"Assinatura inválida."});
  let event;
  try{event=JSON.parse(raw.toString("utf8"));}catch(e){return res.status(400).json({error:"JSON inválido."});}
  if(event.type==="transaction.paid"){
    // A confirmação é mantida na BravoPay; o frontend consulta /api/payment-status.
    // Este webhook serve para auditoria/integrações futuras e recebe eventos assinados.
  }
  return res.status(200).json({received:true,event_id:event.id||null});
};
