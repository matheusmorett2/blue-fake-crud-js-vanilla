const express = require("express"); // Importando o express

const router = express.Router(); // Instanciando o Router do Express

let categorias = [
  // Criando uma lista fake de categorias para nossa API
  {
    id: 1,
    nome: "T-Shirt Unissex",
  },
  {
    id: 2,
    nome: "Baby Look",
  },
  {
    id: 3,
    nome: "Moletom",
  },
];

// Estamos criando um GET
router.get("/", (req, res) => {
  if (req.query.nome) {
    // If para verificar se o usuário passou um filtro via Query Parameters
    const categoriasFiltradas = categorias.filter(
      (
        categoria // Filtra baseado no que o usuario mandou
      ) => categoria.nome.includes(req.query.nome)
    );

    if (categoriasFiltradas.length === 0) {
      // Verifica se tem um resultado para o filtro
      return res.status(404).send({
        message: "Nenhum resultado encontrado",
      });
    }

    // Retorna as categorias filtrdas
    return res.status(200).send(categoriasFiltradas);
  }

  res.status(200).send(categorias); // Retorna as categorias
});

// Busca uma categoria por ID
router.get("/:id", (req, res) => {
  const categoriaId = Number(req.params.id);

  // Busca na nossa lista fake baseado no ID que o usuario passou pela rota
  const categoria = categorias.find(
    (categoria) => categoria.id === categoriaId
  );

  if (!categoria) {
    // Verifica se a categoria existe na nossa lista
    return res.status(404).send({
      // Retorna 404 caso não exista
      message: "Nenhuma categoria encontrada",
    });
  }

  res.status(200).send(categoria); // Retorna a categoria que o usuario passou o ID
});

// Realiza a criação de  uma categoria
router.post("/", (req, res) => {
  const categoria = req.body; // Pega as infos enviadas pelo usuario

  if (!categoria.nome) {
    // Verifica se o usuario passou o nome
    return res.status(400).send({
      // Retorna erro caso ele não tenha passado
      message: "Nome é um atributo obrigatório",
    });
  }

  const verificaSeJaTemIgual = categorias.find(
    // Busca categorias com mesmo nmoe
    (c) => c.nome.toLowerCase() === categoria.nome.toLowerCase()
  );

  if (verificaSeJaTemIgual) {
    // Verifica se já tem uma categoria com esse nome
    return res.status(409).send({
      // Caso já tenha, retorna erro
      message: "Já existe uma categoria com esse nome!",
    });
  }

  categorias.push({
    // Adiciona categoria a lista de categorias
    ...categoria,
    id: categorias[categorias.length - 1].id + 1,
  });

  return res.status(201).send({
    // Retorna que a criação foi um sucesso
    message: "Cadastro realizado com sucesso!",
  });
});

router.put("/:id", (req, res) => {
  const categoriaId = Number(req.params.id);
  const categoria = req.body;

  if (!categoria.nome) {
    return res.status(400).send({
      message: "Nome é um atributo obrigatório",
    });
  }

  categorias = categorias.map((c) => {
    // Percore lista de categorias e edita a que tem o mesmo ID
    if (c.id === categoriaId) {
      c.nome = categoria.nome;
    }

    return c;
  });

  res.status(204).send({
    message: "Categoria editada com sucesso",
  });
});

router.delete("/:id", (req, res) => {
  const categoriaId = Number(req.params.id);

  const categoria = categorias.find(
    (categoria) => categoria.id === categoriaId
  );

  if (!categoria) {
    return res.status(404).send({
      message: "Nenhuma categoria encontrada",
    });
  }

  const categoriaIndex = categorias.findIndex(
    // Busca Index da categoria na lista para deletar
    (categoria) => categoria.id === categoriaId
  );

  categorias.splice(categoriaIndex, 1); // Deleta categoria da Lista

  res.status(200).send({
    message: "Deletado com sucesso!",
  });
});

module.exports = router;
