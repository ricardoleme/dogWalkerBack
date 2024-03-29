import express from 'express'
//import fs from 'fs'
import cors from 'cors'
import rotasUsuarios from './routes/usuarios.js'
import rotasGeo from './routes/geo.js'
import rotaUpload from './routes/upload.js'
import rotasPasseadores from './routes/passeadores.js'
import rotasPrestadores from './routes/prestadores.js'

const app = express();
const port = process.env.PORT || 4000

//import swaggerUI from 'swagger-ui-express'

app.use(cors()) //Habilita o CORS-Cross-origin resource sharing
app.use(express.urlencoded({ extended: true }));
app.use(express.json()) // Parse JSON payloads
app.use('/favicon.ico', express.static('public/favicon.ico')) //Configura o favicon
app.disable('x-powered-by') //Removendo o x-powered-by por segurança

// Rotas do conteúdo público 
app.use('/', express.static('public'))

// Definimos a nossa rota default
app.get('/api', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
  res.status(200).json({
    message: 'API Dog Walker - 100% funcional!🐕👏',
    version: '1.0.1'
  })

})

//Rotas 
app.use('/api/usuarios', rotasUsuarios)
app.use('/api/passeadores', rotasPasseadores)
app.use('/api/prestadores', rotasPrestadores)

app.use('/api/geo', rotasGeo)

/* Rota do upload */
app.use('/upload', rotaUpload)

/* Rota de Documentação do projeto */
//app.use('/doc', swaggerUI.serve, swaggerUI.setup(JSON.parse(fs.readFileSync('./swagger/swagger_output.json'))))

// Rota para tratar exceções - 404 (Deve ser a última rota SEMPRE) 
app.use(function (req, res) {
  res.status(404).json({
    errors: [
      {
        value: `${req.originalUrl}`,
        msg: `A rota ${req.originalUrl} não existe nesta API 🚫`,
        param: 'routes'
      }
    ]
  }
  )
})

app.listen(port, function () {
  console.log(`🚀 Servidor rodando na porta ${port}`)
})

