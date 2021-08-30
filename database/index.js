const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/db_jogos", {
  useNewURLParser: true,
  useUnifiedTopology: true,
});

module.exports = mongoose;