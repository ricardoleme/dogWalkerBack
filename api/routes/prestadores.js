// API REST dos prestadores
import express from 'express'
import { connectToDatabase } from '../utils/mongodb.js'
import { check, validationResult } from 'express-validator'

const router = express.Router()
const nomeCollection = 'prestadores'
const { db, ObjectId } = await connectToDatabase()

/**********************************************
 * Validações
 * 
 **********************************************/
const validaPrestador = [
    check('cnpj')
    .not().isEmpty().trim().withMessage('É obrigatório informar o CNPJ do Prestador')
    .isNumeric().withMessage('O CNPJ não pode conter caracteres especiais, apenas números')
    .isLength({ min: 14, max: 14 }).withMessage('O tamanho do CNPJ informado é inválido.')
    .custom((value, { req }) => {
      return db.collection(nomeCollection).find({ cnpj: { $eq: value } }).toArray()
        .then((cnpj) => {
          if (cnpj.length && !req.body._id) {
            return Promise.reject(`O cnpj ${value} já está informado em outro Prestador`)
          }
        })
    }),
    check('razao_social')
        .not().isEmpty().trim().withMessage('É obrigatório informar a Razão Social')
        .isAlphanumeric('pt-BR', { ignore: '/. ' }).withMessage('A Razão Social deve conter apenas caracteres alfanuméricos')
        .isLength({ min: 3 }).withMessage('A Razão Social é muito curta. Informe ao menos 3 caracteres')
        .isLength({ max: 100 }).withMessage('A Razão Social é muito longa. Informe no máximo 100 caracteres'),
    check('cnae_fiscal', 'O código do CNAE (Classificação Nacional de Atividades Econômicas) deve ser um número').isNumeric(),
    check('nome_fantasia').optional({nullable: true}),
    check('data_inicio_atividade','A data de início de atividade é inválida')
    .optional({nullable: true})
    .isDate({format: 'YYYY-MM-DD'}),
    check('localizacao.type','O tipo (type) da localização deve conter o valor Point').equals('Point'),
    check('localizacao.coordinates','As coordenadas (coordinates) da localização devem ser um array com Latitude e Longitude').isArray()
]


check('text_settings_descriptions.*.value')

/**********************************************
 * GET /api/prestadores
 **********************************************/
 router.get('/', async (req, res) => {
    /* 
     #swagger.tags = ['Prestadores']
     #swagger.description = 'Endpoint para obter todos os Prestadores de Serviço do sistema.' 
     */
    try {
      db.collection(nomeCollection).find({}, {
        projection: { senha: false }
      }).sort({ nome: 1 }).toArray((err, docs) => {
        if (!err) {
          /* 
          #swagger.responses[200] = { 
       schema: { "$ref": "#/definitions/Prestadores" },
       description: "Listagem dos prestadores de serviço obtida com sucesso" } 
       */
          res.status(200).json(docs)
        }
      })
    } catch (err) {
      /* 
         #swagger.responses[500] = { 
      schema: { "$ref": "#/definitions/Erro" },
      description: "Erro ao obter a listagem dos prestadores" } 
      */
      res.status(500).json({
        errors: [
          {
            value: `${err.message}`,
            msg: 'Erro ao obter a listagem dos prestadores de serviço',
            param: '/'
          }
        ]
      })
    }
  })

/**********************************************
 * GET /prestadores/id/:id
 **********************************************/
router.get("/id/:id", async (req, res) => {
      /* #swagger.tags = ['Prestadores']
      #swagger.description = 'Endpoint que retorna os dados do prestador filtrando pelo id' 
      */
    try {
        db.collection(nomeCollection).find({ "_id": { $eq: ObjectId(req.params.id) } }).toArray((err, docs) => {
            if (err) {
                res.status(400).json(err) //bad request
            } else {
                res.status(200).json(docs) //retorna o documento
            }
        })
    } catch (err) {
        res.status(500).json({ "error": err.message })
    }
})

/**********************************************
 * GET /prestadores/razao/:razao
 **********************************************/
router.get("/razao/:razao", async (req, res) => {
    /* #swagger.tags = ['Prestadores']
      #swagger.description = 'Endpoint que retorna os dados do prestador filtrando por parte da Razão Social' 
      */
    try {
        db.collection(nomeCollection).find({ razao_social: { $regex: req.params.razao, $options: "i" } }).toArray((err, docs) => {
            if (err) {
                res.status(400).json(err) //bad request
            } else {
                res.status(200).json(docs) //retorna o documento
            }
        })
    } catch (err) {
        res.status(500).json({ "error": err.message })
    }
})

/**********************************************
 * POST /prestadores/
 **********************************************/
router.post('/', validaPrestador, async (req, res) => {
    /* #swagger.tags = ['Prestadores']
      #swagger.description = 'Endpoint que inclui um novo prestador' 
      */
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json(({
            errors: errors.array()
        }))
    } else {
        await db.collection(nomeCollection)
            .insertOne(req.body)
            .then(result => res.status(201).send(result)) //retorna o ID do documento inserido)
            .catch(err => res.status(400).json(err))
    }
})

/**********************************************
 * PUT /prestadores
 * Alterar um prestador pelo ID
 **********************************************/
router.put('/', validaPrestador, async (req, res) => {
  let idDocumento = req.body._id
  delete req.body._id //removendo o ID do body para o update não apresentar o erro 66
    /* #swagger.tags = ['Prestadores']
      #swagger.description = 'Endpoint que permite alterar os dados do prestador pelo id' 
      */
    const schemaErrors = validationResult(req)
    if (!schemaErrors.isEmpty()) {
        return res.status(403).json(({
            errors: schemaErrors.array() //retorna um Forbidden
        }))
    } else {
        await db.collection(nomeCollection)
            .updateOne({ '_id': { $eq: ObjectId(idDocumento) } },
                { $set: req.body }
            )
            .then(result => res.status(202).send(result))
            .catch(err => res.status(400).json(err))
    }
})

/**********************************************
 * DELETE /prestadores/
 **********************************************/
router.delete('/:id', async (req, res) => {
    /* #swagger.tags = ['Prestadores']
      #swagger.description = 'Endpoint que permite excluir um prestador filtrando pelo id' 
      */
    await db.collection(nomeCollection)
        .deleteOne({ "_id": { $eq: ObjectId(req.params.id) } })
        .then(result => res.status(202).send(result))
        .catch(err => res.status(400).json(err))
})

export default router