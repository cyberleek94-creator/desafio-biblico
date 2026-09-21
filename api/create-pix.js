const BRAVOPAY_API="https://bravopay.club/api/v1";
const ALLOWED_ORIGIN=process.env.ALLOWED_ORIGIN||"*";

function cors(res){
  res.setHeader("Access-Control-Allow-Origin",ALLOWED_ORIGIN);
  res.setHeader("Access-Control-Allow-Methods","POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers","Content-Type");
}

module.exports=async function handler(req,res){
  cors(res);
  if(req.method==="OPTIONS") return res.status(204).end();
  if(req.method!=="POST") return res.status(405).json({error:"Method not allowed"});
  const key=process.env.BRAVOPAY_API_KEY;
  if(!key) return res.status(500).json({error:"BRAVOPAY_API_KEY não configurada no servidor."});
  try{
    const body=typeof req.body==="string"?JSON.parse(req.body):(req.body||{});
    const external=String(body.external_reference||"").slice(0,120);
    if(!external) return res.status(400).json({error:"external_reference obrigatório."});
    const payload={
      amount_cents:990,
      method:"pix",
      description:"Desafio Bíblico - 100 Perguntas",
      external_reference:external,
      expires_in:3600,
      metadata:{product:"desafio-biblico-100",access:"100"}
    };
    if(body.name) payload.customer={name:String(body.name).slice(0,80)};
    if(body.email) payload.customer={...(payload.customer||{}),email:String(body.email).slice(0,120)};
    const r=await fetch(BRAVOPAY_API+"/transactions",{
      method:"POST",
      headers:{"Authorization":"Bearer "+key,"Content-Type":"application/json","Idempotency-Key":external},
      body:JSON.stringify(payload)
    });
    const data=await r.json();
    if(!r.ok) return res.status(r.status).json({error:data?.error?.message||"BravoPay recusou a cobrança.",details:data?.error?.details});
    return res.status(200).json({
      transaction_id:data.id,
      status:data.status,
      amount_cents:data.amount_cents,
      copy_paste:data.pix?.copy_paste,
      expires_at:data.pix?.expires_at
    });
  }catch(e){
    return res.status(500).json({error:"Erro interno ao gerar PIX."});
  }
};
