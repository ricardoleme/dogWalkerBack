# NodeJS API integrated with MongoDB (without Mongoose) 

É necessário adicionar a chave abaixo no seu arquivo package.json
```json
{ "type": "module" }
```


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

- Acesse o (Vercel)[https://vercel.com/signup] e faça o login com a sua conta do Github
- Importe o projeto desejado que será exibido na lista do Github
- Na área de Environment Variables, recorte e cole o seu arquivo .env
- Clique em Deploy e apaixone-se ♥️😃 pelo Vercel 
- A cada novo push no seu repositório GIT ele automaticamente fará novamente o deploy.

