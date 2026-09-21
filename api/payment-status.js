const BRAVOPAY_API="https://bravopay.club/api/v1";
const ALLOWED_ORIGIN=process.env.ALLOWED_ORIGIN||"*";

module.exports=async function handler(req,res){
  res.setHeader("Access-Control-Allow-Origin",ALLOWED_ORIGIN);
  res.setHeader("Access-Control-Allow-Methods","GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers","Content-Type");
  if(req.method==="OPTIONS") return res.status(204).end();
  if(req.method!=="GET") return res.status(405).json({error:"Method not allowed"});
  const key=process.env.BRAVOPAY_API_KEY;
  const tx=String(req.query?.tx||"");
  if(!key||!tx) return res.status(400).json({error:"Parâmetro tx inválido."});
  try{
    const r=await fetch(BRAVOPAY_API+"/transactions?external_reference="+encodeURIComponent(tx)+"&limit=1",{
      headers:{"Authorization":"Bearer "+key}
    });
    const data=await r.json();
    if(!r.ok) return res.status(r.status).json({error:"Não foi possível consultar a cobrança."});
    const item=(data.data||[])[0];
    if(!item) return res.status(404).json({error:"Transação não encontrada."});
    return res.status(200).json({status:item.status,paid_at:item.paid_at||null});
  }catch(e){
    return res.status(500).json({error:"Erro interno ao consultar pagamento."});
  }
};
