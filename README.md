# NodeJS API integrated with MongoDB (without Mongoose) 

É necessário adicionar a chave abaixo no seu arquivo ```package.json```
```json
{ "type": "module" }
```
## Dicas
- Clone o projeto
- Renomeie o arquivo .env-example para .env e informe a sua string de conexão ao MongoDB
- Instale as dependências com ```npm i```
- Abra o Terminal no VSCode e informe ```npm run dev```

## Packages Utilizados
```
yarn add express
yarn add mongodb
yarn add dotenv
yarn add cors
yarn add express-validator
yarn add multer
yarn add nodemon --dev
yarn add node-fetch
yarn add swagger-autogen --dev
yarn add swagger-ui-express 
```

## Função de cada um dos pacotes
<table><thead><tr><th>Pacote</th><th>Descrição</th></tr></thead><tbody><tr><td><code>express</code></td><td>Framework web rápido, flexível e minimalista para Node.js.</td></tr><tr><td><code>mongodb</code></td><td>Driver oficial do MongoDB para Node.js.</td></tr><tr><td><code>dotenv</code></td><td>Carrega variáveis ​​de ambiente do arquivo .env para o processo.env.</td></tr><tr><td><code>cors</code></td><td>Middleware que permite a comunicação entre diferentes domínios na web.</td></tr><tr><td><code>express-validator</code></td><td>Middleware para validação de dados de entrada em solicitações HTTP.</td></tr><tr><td><code>multer</code></td><td>Middleware para lidar com upload de arquivos.</td></tr><tr><td><code>nodemon</code> (dev)</td><td>Ferramenta que monitora as alterações no código-fonte e reinicia automaticamente o servidor.</td></tr><tr><td><code>node-fetch</code></td><td>Módulo leve que traz o recurso Fetch do navegador para o Node.js.</td></tr><tr><td><code>swagger-autogen</code> (dev)</td><td>Ferramenta de geração de documentação Swagger baseada em comentários JSDoc.</td></tr><tr><td><code>swagger-ui-express</code></td><td>Middleware para exibir a documentação Swagger gerada pelo Swagger Autogen em uma interface de usuário amigável.</td></tr></tbody></table>

## Efetuando o Deploy do Backend no Vercel
- Defina a chave _engines_ no fim do arquivo ```package.json```, conforme exemplo a seguir:
```json
 "engines": {
    "node": "16.x",
    "npm": "9.x"
  }
```
- Dentro da chave scripts do arquivo ```package.json``` defina o start:
```json
"scripts": {
    "start": "node ./api/index.js",
```    
- Crie na pasta raiz um arquivo chamado ```verce.json``` com o conteúdo a seguir:
```json
{
    "version": 2,
    "rewrites": [{ "source": "/api/(.*)", "destination": "/api" }]    
}
```
- Acesse o (Vercel)[https://vercel.com/signup] e faça o login com a sua conta do Github
- Importe o projeto desejado que será exibido na lista do Github
- Na área de Environment Variables, recorte e cole o seu arquivo .env
- Clique em Deploy e apaixone-se ♥️😃 pelo Vercel 
- A cada novo push no seu repositório GIT ele automaticamente fará novamente o deploy.👏👏

## Acesse o deploy da API
https://dog-walker-back.vercel.app/

No seu projeto, caso precise ver erros no deploy, informe:
url_projeto/_logs

Exemplo: https://dog-walker-back.vercel.app/_logs (somente o Owner do projeto pode ver)

Se preferir, faça o deploy diretamente no Vercel deste projeto.
 [![Faça o Deploy com Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ricardoleme/dogWalkerBack)