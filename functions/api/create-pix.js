const BRAVOPAY_BASE="https://bravopay.club/api/v1";

function json(data,status=200){
  return new Response(JSON.stringify(data),{
    status,
    headers:{
      "content-type":"application/json; charset=utf-8",
      "cache-control":"no-store"
    }
  });
}

export async function onRequestPost({request,env}){
  if(!env.BRAVOPAY_API_KEY){
    return json({error:"Pagamento não configurado no servidor."},500);
  }

  try{
    const body=await request.json().catch(()=>({}));
    const external_reference=body.external_reference||("quiz_"+Date.now()+"_"+crypto.randomUUID().slice(0,8));

    const customer={};
    if(body.name) customer.name=String(body.name).slice(0,80);
    if(body.email) customer.email=String(body.email).slice(0,120);

    const payload={
      amount_cents:990,
      method:"pix",
      description:"Desafio Bíblico - 100 Perguntas",
      external_reference,
      expires_in:3600,
      metadata:{
        product:"desafio-biblico-100",
        access:"100"
      }
    };

    if(Object.keys(customer).length) payload.customer=customer;

    const r=await fetch(BRAVOPAY_BASE+"/transactions",{
      method:"POST",
      headers:{
        "Authorization":"Bearer "+env.BRAVOPAY_API_KEY,
        "Content-Type":"application/json",
        "Idempotency-Key":external_reference
      },
      body:JSON.stringify(payload)
    });

    const data=await r.json().catch(()=>({}));

    if(!r.ok){
      const apiError=data?.error;
      const message=apiError?.message||data?.message||data?.error||"BravoPay recusou a cobrança.";
      return json({
        error:message,
        code:apiError?.code||null,
        details:apiError?.details||data?.details||null
      },r.status);
    }

    let transactionDetails=null;
    try{
      const txId=data.id||data.transaction_id;
      if(txId){
        const detail=await fetch(BRAVOPAY_BASE+"/transactions/"+encodeURIComponent(txId),{
          headers:{"Authorization":"Bearer "+env.BRAVOPAY_API_KEY}
        });
        transactionDetails=await detail.json().catch(()=>null);
      }
    }catch(_e){}

    let account=null;
    try{
      const me=await fetch(BRAVOPAY_BASE+"/me",{
        headers:{"Authorization":"Bearer "+env.BRAVOPAY_API_KEY}
      });
      const meData=await me.json().catch(()=>null);
      if(me.ok && meData){
        account={id:meData.id||null,name:meData.name||null};
      }
    }catch(_e){}

    return json({
      transaction_id:data.id||data.transaction_id,
      status:data.status,
      amount_cents:data.amount_cents||990,
      copy_paste:data.pix?.copy_paste||data.pix_copy_paste||data.copy_paste||data.qr_code_copy_paste||"",
      expires_at:data.pix?.expires_at||data.expires_at||null,
      payment_provider:transactionDetails?.provider||null,
      payment_provider_id:transactionDetails?.provider_id||null,
      bravopay_account:account
    });
  }catch(e){
    return json({error:"Erro ao criar PIX."},500);
  }
}
