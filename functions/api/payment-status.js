const BRAVOPAY_BASE="https://bravopay.club/api/v1";
function json(data,status=200){return new Response(JSON.stringify(data),{status,headers:{"content-type":"application/json; charset=utf-8","cache-control":"no-store"}})}
export async function onRequestGet({request,env}){
  const tx=new URL(request.url).searchParams.get("tx");
  if(!tx)return json({error:"tx é obrigatório."},400);
  if(!env.BRAVOPAY_API_KEY)return json({error:"Pagamento não configurado no servidor."},500);
  try{
    const r=await fetch(BRAVOPAY_BASE+"/transactions/"+encodeURIComponent(tx),{headers:{Authorization:"Bearer "+env.BRAVOPAY_API_KEY}});
    let data=await r.json().catch(()=>({}));
    if(!r.ok){
      const q=await fetch(BRAVOPAY_BASE+"/transactions?external_reference="+encodeURIComponent(tx)+"&limit=1",{headers:{Authorization:"Bearer "+env.BRAVOPAY_API_KEY}});
      data=await q.json().catch(()=>({}));
      const item=Array.isArray(data.data)?data.data[0]:(Array.isArray(data.transactions)?data.transactions[0]:data);
      if(!q.ok||!item)return json({status:"NOT_FOUND"},404);
      data=item;
    }
    return json({status:data.status||data.payment_status||"UNKNOWN",paid_at:data.paid_at||data.paidAt||null});
  }catch(e){return json({error:"Não foi possível consultar o pagamento."},502)}
}