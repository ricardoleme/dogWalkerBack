// API REST dos passeadores
import express from 'express'
import { connectToDatabase } from '../utils/mongodb.js'
import { check, validationResult } from 'express-validator'

const router = express.Router()
const nomeCollection = 'passeadores'
const { db, ObjectId } = await connectToDatabase()

/**********************************************
 * Validações
 * 
 **********************************************/
const validaPasseador = [
    check('nome', 'Nome do Passeador é obrigatório').not().isEmpty(),
    check('estrelas', 'A nota média deve ser um número').isNumeric()
]


/**********************************************
 * GET /passeadores/
 * Lista todos os passeadores
 **********************************************/
router.get("/", async (req, res) => {
        /* #swagger.tags = ['Passeadores']
      #swagger.description = 'Endpoint que retorna os passeadores em um raio de 20Km da latitude e longitude informados' 
      */
    const lat = parseFloat(req.query.lat) || -23.265700
    const lng = parseFloat(req.query.lng) || -47.299120 //centro de Itu,SP
    try {
        db.collection(nomeCollection).aggregate([
            { $geoNear:{
            near:{
               type:"Point",
               coordinates:[lat,lng]},
               distanceField: "distancia",
               maxDistance: (20 * 1609.34), // milhas para metros - Máximo 20km
               distanceMultiplier: 0.000621371, // metros para milhas
               spherical: true
               }},
        { $match : { nome : /a/i } },
        { $unwind : '$testemunhos' },
        { $group : { _id : {email: '$email', distancia: '$distancia'}, notaMedia : { $avg : '$testemunhos.estrelas' } } },
        { $lookup: {from: "passeadores", localField: "_id.email", foreignField: "email", as: "detalhes"}},
        { $sort : { notaMedia : -1 } }
      ]).toArray((err, docs) => {
            if (err) {
                res.status(400).json(err) //bad request
            } else {
                res.status(200).json(docs) //retorna os documentos
            }
        })
    } catch (err) {
        res.status(500).json({ "error": err.message })
    }
})

/**********************************************
 * GET /passeadores/:id
 **********************************************/
router.get("/:id", async (req, res) => {
      /* #swagger.tags = ['Passeadores']
      #swagger.description = 'Endpoint que retorna os dados do passeador filtrando pelo id' 
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
 * GET /passeadores/nome/:nome
 **********************************************/
router.get("/nome/:nome", async (req, res) => {
    /* #swagger.tags = ['Passeadores']
      #swagger.description = 'Endpoint que retorna os dados do passeador filtrando por parte do nome' 
      */
    try {
        db.collection(nomeCollection).find({ nome: { $regex: req.params.nome, $options: "i" } }).toArray((err, docs) => {
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
 * POST /passeadores/
 **********************************************/
router.post('/', validaPasseador, async (req, res) => {
    /* #swagger.tags = ['Passeadores']
      #swagger.description = 'Endpoint que inclui um novo passeador' 
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
 * PUT /passeadores
 * Alterar um passeador pelo ID
 **********************************************/
router.put('/', validaPasseador, async (req, res) => {
    /* #swagger.tags = ['Passeadores']
      #swagger.description = 'Endpoint que permite alterar os dados do passeador pelo id' 
      */
    const schemaErrors = validationResult(req)
    if (!schemaErrors.isEmpty()) {
        return res.status(403).json(({
            errors: schemaErrors.array() //retorna um Forbidden
        }))
    } else {
        await db.collection(nomeCollection)
            .updateOne({ '_id': { $eq: ObjectId(req.body._id) } },
                { $set: req.body }
            )
            .then(result => res.status(202).send(result))
            .catch(err => res.status(400).json(err))
    }
})

/**********************************************
 * DELETE /passeadores/
 **********************************************/
router.delete('/:id', async (req, res) => {
    /* #swagger.tags = ['Passeadores']
      #swagger.description = 'Endpoint que permite excluir um passeador filtrando pelo id' 
      */
    await db.collection(nomeCollection)
        .deleteOne({ "_id": { $eq: ObjectId(req.params.id) } })
        .then(result => res.status(202).send(result))
        .catch(err => res.status(400).json(err))
})

export default router