# Pagamento BravoPay + Cloudflare Pages Functions

O projeto agora usa a mesma origem para frontend e backend. As rotas /api/* são Cloudflare Pages Functions.

## Secrets no Cloudflare
- BRAVOPAY_API_KEY
- BRAVOPAY_WEBHOOK_SECRET

No Cloudflare: Workers & Pages > projeto > Settings > Variables and Secrets > Add > Encrypt.

## Rotas
- POST /api/create-pix
- GET /api/payment-status?tx=...
- POST /api/webhook

## Deploy
Conecte o repositório GitHub cyberleek94-creator/desafio-biblico ao Cloudflare Pages usando Git integration, com branch main e diretório raiz do projeto. Como é HTML estático, deixe o build command vazio e o diretório de saída como a raiz do projeto.

Configure os dois Secrets antes do deploy. Depois, no BravoPay, use como webhook a URL:
https://SEU-DOMINIO/api/webhook

O frontend já usa URLs relativas (/api/...), portanto não precisa mais substituir PAYMENT_API_BASE.

## Observação
O webhook valida HMAC-SHA256 e timestamp. O status do pagamento continua sendo confirmado pela API da BravoPay no endpoint /api/payment-status antes de liberar o acesso no navegador.
