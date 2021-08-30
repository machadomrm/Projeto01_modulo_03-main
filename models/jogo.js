const mongoose = require("../database/index");

const jogoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  trailler: {
    type: String,
    required: true,
  },
  imageURL: {
      type: String,
      required: true,
  },
});

const Jogo = mongoose.model("Jogo", jogoSchema);

module.exports = Jogo;