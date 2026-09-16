# Site de Gestão de Assinantes

Site simples com um pequeno servidor Node/Express (`server.js`) que serve a
página (`public/index.html`) e faz de ponte para o Google Apps Script
(`Code.gs`), que lê e escreve na tua Google Sheet.

## Estrutura

```
.
├── server.js          # servidor Express (serve o site + endpoints /api/subscribers)
├── package.json
├── public/
│   └── index.html      # o site (antigo assinantes.html)
└── Code.gs              # script do Google Apps Script (NÃO vai para o Render;
                          # fica colado no editor do Apps Script, ligado à tua Sheet)
```

## O que foi corrigido

O `index.html` original tentava chamar uma variável `SCRIPT_URL` que nunca
chegou a ser definida no ficheiro — por isso o site ficava sempre "a
carregar". Agora o site fala com o teu próprio servidor
(`/api/subscribers`), que por sua vez fala com o Apps Script. Isto também
evita problemas de CORS.

## 1. Publicar no GitHub

No teu computador, dentro desta pasta:

```bash
git init
git add .
git commit -m "Primeira versão do site de assinantes"
git branch -M main
git remote add origin https://github.com/<o-teu-utilizador>/<nome-do-repo>.git
git push -u origin main
```

(Cria primeiro o repositório vazio em github.com/new, sem README, e usa o
URL que ele te dá em vez do exemplo acima.)

## 2. Publicar no Render

1. Em https://dashboard.render.com clica **New +** → **Web Service**.
2. Liga a tua conta GitHub e escolhe este repositório.
3. Configura:
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (chega para este caso)
4. Clica **Create Web Service**. Ao fim de 1–2 minutos o Render dá-te um
   URL do tipo `https://o-teu-site.onrender.com` — é esse o link do site.

No plano gratuito o Render "adormece" o serviço ao fim de uns minutos sem
visitas, e demora uns segundos a acordar na visita seguinte — normal.

## 3. Confirmar o Google Apps Script

O `server.js` já aponta para um URL de Apps Script (constante `SCRIPT_URL`).
Confirma que:
- Esse Apps Script está implementado como **Aplicação Web**
  (Implementar → Nova implementação → Aplicação Web).
- O acesso está definido como **"Qualquer pessoa"** (senão o servidor do
  Render não consegue chamá-lo).
- Se voltares a implementar o script com um URL novo, atualiza o valor de
  `SCRIPT_URL` no `server.js` e volta a enviar (`git push`) — o Render
  publica automaticamente a versão nova.
