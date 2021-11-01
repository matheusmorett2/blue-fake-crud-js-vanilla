const express = require("express"); // Importando o Express
const categoriasRoutes = require("./routes/categorias.routes"); // Importando as rotas que criamos
const cors = require("cors");

const app = express(); // Instanciando o Express

app.use(express.json()); // Dizendo que vamos nos comunicar utilizando JSON

app.use(cors());

app.use("/categorias", categoriasRoutes); // Continuando a importação das nossas rotas

app.listen(3000, () => {
  // Inicializando o servidor
  console.log("Projeto rodando na porta 3000");
});
