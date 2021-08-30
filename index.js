/*jshint esversion: 6 */
/*jshint esversion: 8 */
const express = require("express");
const mongoose = require("./database");
const jogoSchema = require("./models/jogo");

const app = express();
const port = 3000;
app.use(express.json());

//Função para verificação se o id recebido no parâmetro é válido. é válido
function validMongoose(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return false;
  } else {
    return true;
  }
}

//Função para verificar se o document foi encontrado.
function validDocument(jogo) {
  if (!jogo) {
    return false;
  } else {
    return true;
  }
}

//Função para verificar se todos os campos necessários estão completos
function validBody(jogo) {
  if (!jogo || !jogo.name || !jogo.imageURL) {
    return false;
  } else {
    return true;
  }
}

app.get("/", (req, res) => {
  res.send({ info: "Hello MongoDB" });
});

//Retorna a lista com todos os jogos cadastrados
app.get("/jogos", async (req, res) => {
  const jogos = await jogoSchema.find();
  res.send(jogos);
});

//GET by id => /jogos/:id - retorna um unico jogo pelo ID
app.get("/jogos/:id", async (req, res) => {
  const id = req.params.id;

  //verificação se o id recebido no parâmetro é válido. é válido
  if (!validMongoose(id)) {
    res.status(422).send({ error: "Id inválido." });
  }

  //busca no mongodb o document que possui o id recebido pela req.param
  const jogo = await jogoSchema.findById(id);

  //Verifica se o document foi encontrado.
  if (!validDocument(jogo)) {
    res.status(404).send({ error: "Jogo não encontrado." });
  }
  res.send({ jogo });
});

//POST - /jogos - cria um novo jogo
app.post("/jogos", async (req, res) => {
  const jogo = req.body;
  if (!validBody(jogo)) {
    res.status(400).send({ error: "Jogo inválido." });
  }
  const jogoSalvo = await new jogoSchema(jogo).save();
  res.status(201).send({ jogoSalvo });
});

//PUT - /jogos/:id - Atualiza um jogo pelo id
app.put("/jogos/:id", async (req, res) => {
  const id = req.params.id;
  validMongoose(id);
  const jogo = await jogoSchema.findById(id);
  if (!validDocument(jogo)) {
    res.status(404).send({ error: "Jogo não encontrado." });
  }
  const novoJogo = req.body;
  if (!validBody(jogo)) {
    res.status(400).send({ error: "Jogo inválido." });
  };
  await jogoSchema.findOneAndUpdate({ _id: id }, novoJogo);
  const jogoAtualizado = await jogoSchema.findById(id);
  res.send({ jogoAtualizado });
});

//delete
app.delete("/jogos/:id", async (req, res) => {
  const id = req.params.id;
  validMongoose(id);
  const jogo = await jogoSchema.findById(id);
  if (!validDocument(jogo)) {
    res.status(404).send({ error: "Jogo não encontrado." });
  }
  await jogoSchema.findByIdAndDelete(id);
  res.send({ message: "Jogo excluído com sucesso!" });
});

app.listen(port, () =>
  console.log(`Servidor rodando em http://localhost:${port}`)
);
