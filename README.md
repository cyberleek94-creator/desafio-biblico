# Desafio Bíblico

Site estático do Desafio Bíblico, preparado para publicação no GitHub Pages.

## Fluxo atual

1. Página inicial: apresentação + botão **COMEÇAR DESAFIO GRÁTIS**.
2. Desafio gratuito: 10 perguntas, sem cadastro e sem pagamento.
3. Resultado: percentual, desempenho por categoria, desempenho por dificuldade, análise personalizada e revisão de respostas.
4. Oferta: somente **100 perguntas por R$ 9,90**, exibida depois do resultado gratuito.
5. Checkout de teste: botão de simulação.
6. Pagamento aprovado: `pagamento-aprovado.html`.
7. Acesso de teste: botão libera as 100 perguntas neste navegador e retorna para `index.html?paid=1`.

## Publicação no GitHub Pages

1. Crie um repositório no GitHub.
2. Envie `index.html`, `pagamento-aprovado.html` e este `README.md`.
3. No GitHub, abra **Settings → Pages**.
4. Em **Build and deployment**, selecione **Deploy from a branch**.
5. Escolha a branch principal e a pasta `/ (root)`.
6. Salve e aguarde a publicação.

## Estrutura

```text
desafio-biblico/
├── index.html
├── pagamento-aprovado.html
└── README.md
```

## Importante sobre o pagamento

Esta versão é de teste. O botão **SIMULAR PAGAMENTO APROVADO** não representa uma cobrança real.

Para produção, o pagamento deve ser confirmado no servidor por webhook do provedor. O acesso às 100 perguntas não deve depender apenas de `localStorage`, de `?status=approved` ou de uma URL de retorno.

A estrutura atual foi mantida propositalmente simples para funcionar como site estático durante os testes.