# BravoPay — PIX R$ 9,90

O quiz usa o GitHub Pages no frontend e este backend para falar com a BravoPay. O GitHub Pages é estático e não executa código de servidor, então a chave secreta fica somente no backend.

## Deploy
1. Publique este repositório em um serviço Node/serverless compatível. O vercel.json já está preparado para Vercel.
2. Configure BRAVOPAY_API_KEY, BRAVOPAY_WEBHOOK_SECRET e ALLOWED_ORIGIN.
3. Na BravoPay, cadastre o webhook: https://SEU-BACKEND/api/webhook.
4. No index.html, substitua __PAYMENT_API_BASE__ pela URL do backend.
5. Teste: resultado das 10 perguntas -> gerar PIX R$ 9,90 -> pagar -> confirmação -> 100 perguntas.

A BravoPay documenta POST /transactions sem product_id, PIX com amount_cents e copy_paste, além de webhooks assinados HMAC-SHA256.