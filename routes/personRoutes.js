const router = require("express").Router()
const Person = require("../models/Person")

// CREATE - CRIA DADOS
router.post("/", async (req, res) => {
  // req.body
  const { name, salary, approved } = req.body

  if (!name) {
    res.status(422).json({ error: "O nome é obrigatório." })
    return
  }

  const person = {
    name,
    salary,
    approved,
  }

  try {
    // CRIANDO DADOS
    await Person.create(person)

    res
      .status(201)
      .json({ message: "Pessoa inserida no sistema com sucesso!" })
  } catch (error) {
    res.status(500).json({ error: "Vish, algo deu errado!" })
  }
})

// READ - LEITURA DE DADOS
router.get("/", async (req, res) => {
  try {
    const people = await Person.find()
    res.status(200).json(people)
  } catch (error) {
    res.status(500).json({ error: error })
  }
})

router.get("/:id", async (req, res) => {
  // EXTRAIR O DADO DA REQUISIÇÃO, PELA URL = req.params
  const id = req.params.id

  try {
    const person = await Person.findOne({ _id: id })

    if (!person) {
      res.status(422).json({ message: "O usuário não foi encontrado!" })
      return
    }

    res.status(200).json(person)
  } catch (error) {
    res.status(500).json({ error: error })
  }
})

// UPDATE - ATUALIZAÇÃO DE DADOS (PUT, PATCH)
router.patch('/:id', async (req, res) => {
  const id = req.params.id
  const { name, salary, approved} = req.body
  const person = {
    name, 
    salary,
    approved
  }

  try {
    const updatePerson = await Person.updateOne({ _id: id }, person)
    
    if(updatePerson.matchedCount === 0) {
      res.status(422).json({ message: "O usuário não foi encontrado!" })
      return
    }

    res.status(200).json(person)
  }
  catch(error) {
    res.status(500).json({ error: error })
  }
})

// DELETE - DELETAR DADOS
router.delete('/:id', async (req, res) => {
  const id = req.params.id
  const person = await Person.findOne({ _id: id })

  if (!person) {
    res.status(422).json({ message: "O usuário não foi encontrado!" })
    return
  }

  try {
    await Person.deleteOne({ _id: id })
    
    res.status(200).json({ message: 'Usuário removido com sucesso!'})
  } catch (error) {
    res.status(500).json({ error: error })
  }
})
module.exports = router